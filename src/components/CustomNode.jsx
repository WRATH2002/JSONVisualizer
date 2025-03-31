import React from "react";

const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        background: "#f0f0f0",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        width: "120px",
      }}
    >
      <strong>{data.label}</strong>
    </div>
  );
};

export default CustomNode;
