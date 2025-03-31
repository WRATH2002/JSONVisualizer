import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { JsonNode } from "./components/JsonNode";
import { jsonToFlow } from "./utils/jsonToFlow";
import { ChevronDown, FileJson, Files, Github, Plus, X } from "lucide-react";
import {
  a11yLight,
  CopyBlock,
  dracula,
  github,
  hybrid,
  monokai,
  nord,
  obsidian,
  ocean,
} from "react-code-blocks";
import { dat } from "./utils/mediumJSON";

const nodeTypes = {
  jsonNode: JsonNode,
};

const sampleJson = dat;

function App() {
  const [modalData, setModalData] = useState([]);
  const [path, setPath] = useState("");

  useEffect(() => {
    console.log("modalData--------------------->");
    console.log(modalData);
  }, [modalData]);

  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(sampleJson, null, 2)
  );
  const [nodes, setNodes] = useState(jsonToFlow(sampleJson).nodes);
  const [edges, setEdges] = useState(jsonToFlow(sampleJson).edges);
  const [error, setError] = useState("");

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      const { nodes: newNodes, edges: newEdges } = jsonToFlow(
        parsed,
        setModalData,
        setPath
      );
      setNodes(newNodes);
      console.log(newNodes);
      setEdges(newEdges);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const [leftWidth, setLeftWidth] = useState(400); // Initial width (between 300px - 600px)
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const newWidth = e.clientX; // Mouse position as width
    if (newWidth >= 300 && newWidth <= 600) {
      setLeftWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-[100svh] justify-start items-start bg-[#262C35] pr-[8px] pb-[8px] text-white">
        <div className="w-full h-[45px] bg-[#262C35] overflow-visible px-[20px] flex justify-between items-center">
          <div className="flex justify-start items-center">
            <FileJson className="w-6 h-6 text-[white] mr-[10px]" />
            <h1 className="text-xl font-semibold text-[white]">JSON Beauty</h1>
          </div>
          <div className="flex flex-col justify-start items-start h-[30px] overflow-visible">
            <div className="flex justify-start items-center px-[10px] min-h-[30px] border-[1.5px] border-transparent hover:border-[#616e7d] text-[#a7a7a7] hover:text-[white] hover:bg-[#515d6c] rounded-[8px] text-[14px] cursor-pointer ">
              {/* <Plus width={16} height={16} strokeWidth={2} className="mr-[7px]" /> */}
              File
              <ChevronDown
                width={14}
                height={14}
                strokeWidth={2.4}
                className="ml-[5px] mr-[-3px]"
              />
            </div>
            {/* <div className="w-auto px-[10px] h-auto py-[5px]  rounded-lg border-[1.5px] border-[#4b535e] text-[14px]  z-30 bg-[#3d4753] flex flex-col justify-center items-start mt-[15px]">
              <span className="text-[#a7a7a7] hover:text-[white] h-[30px] flex justify-start items-center cursor-pointer">
                Import
              </span>
              <span className="text-[#a7a7a7] hover:text-[white] h-[30px] flex justify-start items-center cursor-pointer">
                Export
              </span>
            </div> */}
          </div>
          <div className="w-[32px] h-[32px] rounded-[6px] text-[white] border-[1.5px] border-transparent hover:border-[#616e7d] hover:bg-[#515d6c] cursor-pointer flex justify-center items-center">
            <Github width={18} height={18} strokeWidth={2} />
          </div>
        </div>
        <div className="w-full h-[calc(100%-45px)] flex flex-row justify-start items-start">
          <div
            style={{ width: `${leftWidth}px` }}
            className=" px-[8px] h-full bg-[#262C35]"
          >
            {/* <CopyBlock
            className="bg-transparent"
            text={jsonInput}
            language="javascript"
            showLineNumbers={true}
            theme={hybrid}
            wrapLines
            codeBlock={false}
          /> */}
            <textarea
              value={jsonInput}
              onChange={handleJsonChange}
              className="w-full h-full p-4 font-mono text-[14px] bg-[#2a303a] border-[2px] border-[#303741] text-[#e2e2e2f8] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your JSON here..."
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Drag Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="w-[2px] cursor-ew-resize bg-transparent h-full"
          />

          {/* Right Div */}
          <div
            style={{ width: `calc(100% - ${leftWidth}px)` }}
            className="bg-[#262C33] h-full rounded-lg inset-shadow-sm inset-shadow-[#0000002d]"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              minZoom={0.01} // Allows infinite zoom out
              maxZoom={50} // Allows infinite zoom in
              fitView
              defaultEdgeOptions={{
                type: "smoothstep",
                style: { stroke: "#5f6d7a", strokeWidth: 2 },
              }}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
      {modalData && (
        <div className="fixed text-[white] inset-0 bg-[#0000009f] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#323A44] rounded-lg p-[10px] max-w-2xl max-h-[60vh] ">
            <div className="flex justify-end items-center h-[30px] mb-[0px]">
              {/* <h2 className="text-xl font-bold ">Node Details</h2> */}
              <button
                onClick={() => setModalData(null)}
                className="text-gray-500 hover:text-[white] hover:bg-[#414b57] h-[30px] w-[30px] rounded-[6px] cursor-pointer flex justify-center items-center"
              >
                <X width={20} height={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="px-[10px] w-full h-[20px] flex justify-self-auto items-center text-[14px] mt-[0px] text-[#909cad]">
              Node Content
            </div>
            <div className="mt-[10px] mb-[-40px] w-full h-[40px] flex justify-end items-center pr-[20px]">
              <Files
                width={18}
                height={18}
                strokeWidth={2}
                className="text-gray-500 hover:text-[white] cursor-pointer"
              />
            </div>
            <pre className="w-[calc(100%-20px)] ml-[10px] bg-[#262C35] h-[calc(100%-170px)] p-[15px] text-[white] text-[14px] overflow-scroll rounded-lg">
              <span>{`{`}</span>
              {modalData.map((data, index) => {
                return (
                  <>
                    <div className="flex justify-start items-center ml-[20px]">
                      <span className="text-[#3fbcf6]">"{data.key}"</span> :{" "}
                      <span
                        className={
                          "" +
                          (typeof data.value == "number"
                            ? " text-[#fddc21]"
                            : typeof data.value == "boolean"
                            ? " text-[#fe732d]"
                            : " text-[#e2e2e2f8]")
                        }
                      >
                        {typeof data.value == "string" ? (
                          <>"{data.value}"</>
                        ) : (
                          <>{data.value}</>
                        )}
                      </span>
                      ,
                    </div>
                  </>
                );
              })}
              <span>{`}`}</span>
            </pre>
            <div className="px-[10px] w-full h-[20px] flex justify-self-auto items-center text-[14px] mt-[20px] text-[#909cad]">
              JSON Path
            </div>
            <pre className=" w-[calc(100%-20px)] ml-[10px] bg-[#262C35] h-[50px] pl-[15px] rounded-lg mt-[10px] flex justify-start items-center text-[14px]">
              <div className="h-full w-[calc(100%-40px)] mr-[0px] flex justify-start items-center whitespace-nowrap  overflow-x-scroll">
                {path}
              </div>
              <div className="w-[40px] h-[50px] flex justify-center items-center text-gray-500 hover:text-[white] cursor-pointer">
                <Files width={18} height={18} strokeWidth={2} />
              </div>
            </pre>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
