const LEVEL_WIDTH = 900; // Fixed width for each level (column)
const ATTRIBUTE_HEIGHT = 40; // Height of each attribute in pixels
const NODE_PADDING = 100; // Increased padding between nodes

export function jsonToFlow(
  json,
  setModalData,
  setModalDataModal,
  setPath,
  setTargetNode
) {
  const nodes = [];
  const edges = [];
  let nodeId = 0;
  const levelNodes = new Map(); // Track nodes for each level
  const levelPositions = new Map(); // Track vertical positions for each level

  // Helper function to calculate the height of a node
  function calculateNodeHeight(obj) {
    let attributesCount = 0;
    if (Array.isArray(obj)) {
      attributesCount = obj.length;
    } else if (typeof obj === "object" && obj !== null) {
      const simpleAttrs = Object.entries(obj).filter(
        ([_, value]) => typeof value !== "object" || value === null
      ).length;
      const complexAttrs = Object.entries(obj).filter(
        ([_, value]) => typeof value === "object" && value !== null
      ).length;
      attributesCount = Math.max(simpleAttrs, complexAttrs);
    } else {
      attributesCount = 1;
    }
    return (attributesCount + 1) * ATTRIBUTE_HEIGHT;
  }

  // First pass: Collect nodes for each level
  function collectNodesForLevel(obj, depth = 0) {
    if (!levelNodes.has(depth)) {
      levelNodes.set(depth, []);
    }

    levelNodes.get(depth).push(obj);

    if (Array.isArray(obj)) {
      obj.forEach((item) => collectNodesForLevel(item, depth + 1));
    } else if (typeof obj === "object" && obj !== null) {
      Object.values(obj).forEach((value) => {
        if (typeof value === "object" && value !== null) {
          collectNodesForLevel(value, depth + 1);
        }
      });
    }
  }

  // Get next available vertical position for a level
  function getNextVerticalPosition(depth, nodeHeight) {
    if (!levelPositions.has(depth)) {
      // Calculate total height for this level
      const nodesInLevel = levelNodes.get(depth) || [];
      const totalHeight = nodesInLevel.reduce(
        (sum, node) => sum + calculateNodeHeight(node) + NODE_PADDING,
        0
      );

      // Set initial position to center the nodes
      const startY = -totalHeight / 2;
      levelPositions.set(depth, startY);
      return startY;
    }

    const currentPosition = levelPositions.get(depth);
    const newPosition = currentPosition + nodeHeight + NODE_PADDING;
    levelPositions.set(depth, newPosition);
    return currentPosition;
  }

  function processObject(
    obj,
    parentId = null,
    depth = 0,
    siblings = 1,
    index = 0,
    label = "root",
    path = "root"
  ) {
    const currentId = `node-${nodeId++}`;
    const nodeHeight = calculateNodeHeight(obj);
    const x = depth * LEVEL_WIDTH;
    const y = getNextVerticalPosition(depth, nodeHeight);

    let connectedNodesCount = 0; // Track the number of connected nodes

    if (Array.isArray(obj)) {
      nodes.push({
        id: currentId,
        type: "jsonNode",
        position: { x, y },
        data: {
          label,
          isArray: true,
          length: obj.length, // Add length attribute for arrays
          setModalData,
          setModalDataModal,
          setPath,
          setTargetNode,
          nodeData: obj,
          path,
        },
      });

      const childCount = obj.length;
      obj.forEach((item, idx) => {
        const childId = processObject(
          item,
          currentId,
          depth + 1,
          childCount,
          idx,
          `[${idx}]`,
          `${path}[${idx}]`
        );
        edges.push({
          id: `edge-${currentId}-${childId}`,
          source: currentId,
          target: childId,
          type: "default",
        });
      });
    } else if (typeof obj === "object" && obj !== null) {
      const simpleAttrs = [];
      const complexAttrs = [];

      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          complexAttrs.push([key, value]);
        } else {
          simpleAttrs.push({ key, value });
        }
      });

      // Add the node for the object
      nodes.push({
        id: currentId,
        type: "jsonNode",
        position: { x, y },
        data: {
          label,
          length: 0, // Placeholder, will be updated later
          setModalData,
          setModalDataModal,
          setTargetNode,
          setPath,
          nodeData: obj,
          path,
        },
      });

      // Add a node for simple attributes if they exist
      if (simpleAttrs.length > 0) {
        connectedNodesCount++; // Increment connected nodes count
        const attrsId = `node-${nodeId++}`;
        const attrsY = getNextVerticalPosition(
          depth + 1,
          ATTRIBUTE_HEIGHT * simpleAttrs.length
        );
        nodes.push({
          id: attrsId,
          type: "jsonNode",
          position: {
            x: x + LEVEL_WIDTH,
            y: attrsY,
          },
          data: {
            label: "Attributes",
            attributes: simpleAttrs,
            setModalData,
            setModalDataModal,
            setTargetNode,
            setPath,
            nodeData: obj,
            path,
          },
        });
        edges.push({
          id: `edge-${currentId}-${attrsId}`,
          source: currentId,
          target: attrsId,
          type: "default",
        });
      }

      // Process complex attributes (nested objects/arrays)
      const totalComplexAttrs = complexAttrs.length;
      complexAttrs.forEach(([key, value], idx) => {
        connectedNodesCount++; // Increment connected nodes count
        const childId = processObject(
          value,
          currentId,
          depth + 1,
          totalComplexAttrs,
          idx,
          key,
          `${path}.${key}`
        );
        edges.push({
          id: `edge-${currentId}-${childId}`,
          source: currentId,
          target: childId,
          type: "default",
        });
      });

      // Update the length attribute for the object node
      nodes.find((node) => node.id === currentId).data.length =
        connectedNodesCount;
    } else {
      nodes.push({
        id: currentId,
        type: "jsonNode",
        position: { x, y },
        data: {
          label: String(obj),
          setModalData,
          setModalDataModal,
          setTargetNode,
          setPath,
          nodeData: obj,
          path,
        },
      });
    }

    return currentId;
  }

  // Initialize by collecting all nodes per level first
  collectNodesForLevel(json);
  // Then process the nodes with vertical centering
  processObject(json);
  return { nodes, edges };
}
