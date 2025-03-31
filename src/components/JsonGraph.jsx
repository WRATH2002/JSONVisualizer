import React from "react";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  ReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

export default function JsonGraph() {
  const { nodes, edges } = generateGraphData(jsonData);
  const [nodeState, setNodes] = useNodesState(nodes);
  const [edgeState, setEdges] = useEdgesState(edges);

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodeState}
          edges={edgeState}
          nodeTypes={nodeTypes}
          fitView
        />
      </div>
    </ReactFlowProvider>
  );
}
