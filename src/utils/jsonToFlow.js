const LEVEL_WIDTH = 900;
const ATTRIBUTE_HEIGHT = 41.5; // Per your request
const NODE_SPACING = 25; // Reduced gap between nodes in same column

export function jsonToFlow(
  json,
  setModalData,
  setModalDataModal,
  setPath,
  searchNodeArr,
  setTargetNode
) {
  const nodes = [];
  const edges = [];
  let nodeId = 0;
  const levelMap = new Map();

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
      attributesCount = simpleAttrs > 0 ? simpleAttrs : complexAttrs;
    } else {
      attributesCount = 1;
    }
    return (attributesCount + 1) * ATTRIBUTE_HEIGHT;
  }

  function addToLevelMap(depth, node) {
    if (!levelMap.has(depth)) {
      levelMap.set(depth, []);
    }
    levelMap.get(depth).push(node);
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

    const nodeData = {
      id: currentId,
      type: "jsonNode",
      position: { x: depth * LEVEL_WIDTH, y: 0 },
      data: {
        label,
        isArray: Array.isArray(obj),
        length: Array.isArray(obj) ? obj.length : 0,
        setModalData,
        setModalDataModal,
        setPath,
        searchNodeArr,
        setTargetNode,
        nodeData: obj,
        path,
      },
      custom: {
        depth,
        height: nodeHeight,
      },
    };

    nodes.push(nodeData);
    addToLevelMap(depth, nodeData);

    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => {
        const childId = processObject(
          item,
          currentId,
          depth + 1,
          obj.length,
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

      if (simpleAttrs.length > 0) {
        const attrsId = `node-${nodeId++}`;
        const attrsHeight = ATTRIBUTE_HEIGHT * (simpleAttrs.length + 1);
        const attrsNode = {
          id: attrsId,
          type: "jsonNode",
          position: { x: (depth + 1) * LEVEL_WIDTH, y: 0 },
          data: {
            label: "Attributes",
            attributes: simpleAttrs,
            setModalData,
            setModalDataModal,
            setTargetNode,
            setPath,
            searchNodeArr,
            nodeData: obj,
            path,
          },
          custom: {
            depth: depth + 1,
            height: attrsHeight,
          },
        };
        nodes.push(attrsNode);
        addToLevelMap(depth + 1, attrsNode);
        edges.push({
          id: `edge-${currentId}-${attrsId}`,
          source: currentId,
          target: attrsId,
          type: "default",
        });
      }

      complexAttrs.forEach(([key, value], idx) => {
        const childId = processObject(
          value,
          currentId,
          depth + 1,
          complexAttrs.length,
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
    }

    return currentId;
  }

  processObject(json);

  // --- Layout: Assign Y positions column-wise ---
  for (const [depth, levelNodes] of levelMap.entries()) {
    let totalHeight = levelNodes.reduce(
      (sum, node) => sum + node.custom.height,
      0
    );
    let totalSpacing = (levelNodes.length - 1) * NODE_SPACING;
    let columnHeight = totalHeight + totalSpacing;
    let startY = -columnHeight / 2;

    for (let node of levelNodes) {
      node.position.y = startY;
      startY += node.custom.height + NODE_SPACING;
    }
  }

  // --- Center everything vertically so root is centered ---
  const yPositions = nodes.map((n) => n.position.y);
  const minY = Math.min(...yPositions);
  const maxY = Math.max(...yPositions);
  const centerOffset = (maxY + minY) / 2;

  for (let node of nodes) {
    node.position.y -= centerOffset;
    delete node.custom;
  }

  return { nodes, edges };
}
