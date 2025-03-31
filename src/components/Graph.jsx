import React from "react";
import ReactFlow, {
  Handle,
  Position,
  Controls,
  Background,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

// JSON Data
const jsonData = [
  {
    fruits: [
      {
        name: "Apple",
        color: "Red",
        nutrients: {
          calories: 52,
          fiber: "2.4g",
          vitaminC: "4.6mg",
        },
      },
      {
        name: "Banana",
        color: "Yellow",
        nutrients: {
          calories: 89,
          fiber: "2.6g",
          potassium: "358mg",
        },
      },
      {
        name: "Orange",
        color: "Orange",
        nutrients: {
          calories: 47,
          fiber: "2.4g",
          vitaminC: "53.2mg",
        },
      },
    ],
  },
];

// 🔹 Custom Node Component (Handles Added)
const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        border: "1px solid gray",
        borderRadius: 5,
        padding: 10,
        background: "#fff",
        fontSize: 14,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div dangerouslySetInnerHTML={{ __html: data.label }} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// 🔹 Convert JSON to Nodes & Edges
const nodes = [];
const edges = [];
let idCounter = 1;

// Root Node
const rootId = `node-${idCounter++}`;
nodes.push({
  id: rootId,
  type: "custom",
  data: {
    label: `<strong style="color: orange">fruits</strong> [${jsonData[0].fruits.length}]`,
  },
  position: { x: 50, y: 100 },
});

// Fruit Nodes
jsonData[0].fruits.forEach((fruit, index) => {
  const fruitId = `node-${idCounter++}`;
  nodes.push({
    id: fruitId,
    type: "custom",
    data: {
      label: `<strong>name:</strong> "${fruit.name}"<br/><strong>color:</strong> "${fruit.color}"`,
    },
    position: { x: 250, y: index * 150 },
  });

  edges.push({ id: `e-${rootId}-${fruitId}`, source: rootId, target: fruitId });

  // Nutrient Node
  const nutrientsId = `node-${idCounter++}`;
  nodes.push({
    id: nutrientsId,
    type: "custom",
    data: { label: `<strong style="color: purple">nutrients</strong> {1}` },
    position: { x: 450, y: index * 150 },
  });

  edges.push({
    id: `e-${fruitId}-${nutrientsId}`,
    source: fruitId,
    target: nutrientsId,
  });

  // Nutrient Details
  Object.entries(fruit.nutrients).forEach(([key, value], nutrientIndex) => {
    const nutrientDetailId = `node-${idCounter++}`;
    nodes.push({
      id: nutrientDetailId,
      type: "custom",
      data: { label: `<strong style="color: red">${key}</strong>: "${value}"` },
      position: { x: 650, y: index * 150 + nutrientIndex * 50 },
    });

    edges.push({
      id: `e-${nutrientsId}-${nutrientDetailId}`,
      source: nutrientsId,
      target: nutrientDetailId,
      type: "smoothstep",
    });
  });
});

const nodeTypes = { custom: CustomNode };

const Graph = () => {
  return (
    <>
      <button
        onClick={() => {
          console.log(nodes);
          console.log(edges);
        }}
      >
        Show Data
      </button>
      <div style={{ width: "100vw", height: "100vh", background: "#f8f8f8" }}>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
          <Controls />
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  );
};

export default Graph;
