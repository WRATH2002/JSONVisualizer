import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  ControlButton,
} from "reactflow";
import "reactflow/dist/style.css";
import { JsonNode } from "./components/JsonNode";
import { jsonToFlow } from "./utils/jsonToFlow";
import {
  BadgeCheck,
  BadgeX,
  Check,
  ChevronDown,
  Download,
  Expand,
  FileDown,
  FileJson,
  Files,
  FileUp,
  Github,
  HardDriveDownload,
  HardDriveUpload,
  Minus,
  PanelLeft,
  Plus,
  Pyramid,
  Route,
  SearchCode,
  SunMoon,
  X,
} from "lucide-react";
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
import DownloadButton from "./components/DownloadButton";
import Prism from "prismjs";
import "./assets/prism-vsc-dark-plus.css";
import { Editor, useMonaco } from "@monaco-editor/react";
import JsonQuery from "./components/JsonQuery";
import { ring2 } from "ldrs";
import CustomControls from "./components/CustomControls";
import FileNameModal from "./components/FileNameModal";
import "./assets/style/cursor.css";

ring2.register();

// Default values shown

const nodeTypes = {
  jsonNode: JsonNode,
};

const sampleJson = {
  people: [
    {
      firstName: "Joe",
      lastName: "Jackson",
      gender: "male",
      age: 28,
      number: "7349282382",
    },
    {
      firstName: "James",
      lastName: "Smith",
      gender: "male",
      age: 32,
      number: "5678568567",
    },
    {
      firstName: "Emily",
      lastName: "Jones",
      gender: "female",
      age: 24,
      number: "456754675",
    },
  ],
};

function App() {
  const [modalData, setModalData] = useState(null);
  const [path, setPath] = useState("");
  const [show, setShow] = useState(true);
  const [fileExtend, setFileExtend] = useState(false);
  const [viewExtend, setViewExtend] = useState(false);
  const [toolsExtend, setToolsExtend] = useState(false);
  const [jsonQModal, setJsonQModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileNameModal, setFileNameModal] = useState(false);
  const [fileName, setFileName] = useState("JSON_beauty");
  const [theme, setTheme] = useState(true);
  const [leftSidebar, setLeftSidebar] = useState(true);
  const [modalDataModal, setModalDataModal] = useState(false);

  const monaco = useMonaco(); // Get monaco instance

  useEffect(() => {
    if (theme) {
      if (monaco) {
        monaco.editor.defineTheme("customDark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#161618", // Set editor background color
            "editor.foreground": "#e2e2e2f8", // Text color
            "editor.lineHighlightBackground": "#1e1e1e", // Highlight current line
            "editorCursor.foreground": "#ffffff", // Cursor color
          },
        });

        monaco.editor.setTheme("customDark"); // Apply theme after defining
      }
    } else {
      if (monaco) {
        monaco.editor.defineTheme("customDark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#F6F6F6", // Set editor background color
            "editor.foreground": "#e2e2e2f8", // Text color
            "editor.lineHighlightBackground": "#1e1e1e", // Highlight current line
            "editorCursor.foreground": "#ffffff", // Cursor color
          },
        });

        monaco.editor.setTheme("customDark"); // Apply theme after defining
      }
    }
  }, [monaco, theme]);

  useEffect(() => {
    console.log("modalData--------------------->");
    console.log(modalData);
  }, [modalData]);

  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(sampleJson, null, 2)
  );
  const [nodes, setNodes] = useState(
    jsonToFlow(sampleJson, setModalData, setModalDataModal, setPath).nodes
  );
  const [edges, setEdges] = useState(
    jsonToFlow(sampleJson, setModalData, setModalDataModal, setPath).edges
  );
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
        setModalDataModal,
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

  const handleJsonChangeThroughImport = (data) => {
    setJsonInput(data);
    try {
      const parsed = JSON.parse(data);
      const { nodes: newNodes, edges: newEdges } = jsonToFlow(
        parsed,
        setModalData,
        setModalDataModal,
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

  // -------------- import json file -----------------
  const handleFileUpload = (event) => {
    setFileExtend(false);
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      // Ensure it's a JSON file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result); // Parse JSON content
          console.log(jsonData);
          console.log(JSON.stringify(jsonData, null, 2)); // Pretty-print JSON output
          handleJsonChangeThroughImport(JSON.stringify(jsonData, null, 2)); // Pass JSON data to a function
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error("Please upload a valid JSON file.");
    }
  };

  // ------------------ Export JSON File ----------------

  const handleExport = () => {
    setFileExtend(false);
    const jsonString = jsonInput;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------- apply code color ----------

  useEffect(() => {
    Prism.highlightAll();
  });

  const handleInput = (data) => {
    setJsonInput(data);
    try {
      const parsed = JSON.parse(data);
      const { nodes: newNodes, edges: newEdges } = jsonToFlow(
        parsed,
        setModalData,
        setModalDataModal,
        setPath
      );
      setNodes(newNodes);
      console.log(newNodes);
      setEdges(newEdges);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
    } // Sync code block with state
  };

  useEffect(() => {
    if (downloading) {
      setTimeout(() => {
        setDownloading(false);
      }, 2500);
    }
  }, [downloading]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const CopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // alert("Copied to clipboard!");
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  function convertArrayToJson(data) {
    let result = {};

    data.forEach(({ key, value }) => {
      result[key] = value;
    });

    return JSON.stringify(result, null, 2); // Converts object to formatted JSON string
  }

  // useEffect(() => {
  //   console.log("localStorage");
  //   console.log(localStorage);
  //   setTheme(localStorage.getItem("JSONBeauty_theme") == "true" ? true : false);
  // }, []);

  return (
    <>
      {fileNameModal ? (
        <>
          <FileNameModal
            fileName={fileName}
            setFileName={setFileName}
            setFileNameModal={setFileNameModal}
            setFileExtend={setFileExtend}
            jsonInput={jsonInput}
            modalDataModal={modalDataModal}
            setModalDataModal={setModalDataModal}
          />
        </>
      ) : (
        <></>
      )}
      {/* <ReactFlowProvider> */}
      <div
        className={
          "flex flex-col w-full h-[100svh] justify-start items-start px-[8px] font-[geistRegular]" +
          (theme ? " bg-[#232325] text-[white]" : " bg-[white] text-[black]")
        }
        onClick={() => {
          setViewExtend(false);
          setFileExtend(false);
          setToolsExtend(false);
        }}
      >
        <div className="w-full h-[45px] overflow-visible px-[20px] flex justify-between items-center">
          <div className="flex justify-start items-center ml-[-18px]">
            <div
              className={
                "flex justify-start items-center " +
                (theme ? " text-[white]" : " text-[black]")
              }
            >
              <Pyramid
                width={20}
                height={20}
                strokeWidth={2.5}
                className=" mr-[10px]"
              />
              <h1 className="text-xl font-semibold whitespace-nowrap font-[umr]">
                JSON Beauty
              </h1>
            </div>
            <div className="flex flex-col justify-start items-start ml-[40px] h-[30px] w-[70px] overflow-visible text-[13px]">
              <div
                className={
                  "flex justify-start items-center px-[10px] min-h-[30px] border-[1.5px] border-transparent    rounded-[8px] cursor-pointer  " +
                  (theme
                    ? " text-[#b8bcc1c7] hover:text-[white]"
                    : " text-[#2e2f30c7] hover:text-[#000000]")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setFileExtend(!fileExtend);
                  setViewExtend(false);
                  setToolsExtend(false);
                }}
              >
                File
                <ChevronDown
                  width={14}
                  height={14}
                  strokeWidth={2.4}
                  className="ml-[5px] mr-[-3px] mt-[2px]"
                />
              </div>
              <div
                className={
                  "w-auto px-[4px] h-auto py-[4px]  rounded-lg border-[1.5px] border-[#353538]   z-30 bg-[#232325] flex-col justify-center items-start mt-[15px]" +
                  (fileExtend ? " flex" : " hidden")
                }
              >
                <label
                  className="flex w-full justify-start items-center px-[7px] min-h-[30px] max-h-[30px] hover:bg-[#39393b] border-[1.5px] border-transparent  text-[#b8bcc1c7] hover:text-[white] rounded-[6px]  cursor-pointer whitespace-nowrap"
                  // style={{ transition: "2s", transitionDelay: ".4s" }}
                  for="image-file-input"
                >
                  <FileDown
                    width={14}
                    height={14}
                    strokeWidth={2.4}
                    className="mt-[2x] mr-[10px]"
                  />
                  Import File
                  <input
                    id="image-file-input"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  ></input>
                </label>
                <label
                  className="flex w-full justify-start items-center px-[7px] min-h-[30px] max-h-[30px] hover:bg-[#39393b] border-[1.5px] border-transparent  text-[#b8bcc1c7] hover:text-[white] rounded-[6px]  cursor-pointer whitespace-nowrap"
                  // style={{ transition: "2s", transitionDelay: ".4s" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleExport();

                    setFileExtend(false);
                    setFileNameModal(true);
                    setTimeout(() => {
                      setModalDataModal(true);
                    }, 100);
                  }}
                >
                  <FileUp
                    width={14}
                    height={14}
                    strokeWidth={2.4}
                    className="mt-[2x] mr-[10px]"
                  />
                  Export File
                  {/* <input
                    id="image-file-input"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  ></input> */}
                </label>
              </div>
            </div>{" "}
            <div className="flex flex-col justify-start items-start ml-[0px] h-[30px] w-[70px] overflow-visible text-[13px]">
              <div
                className={
                  "flex justify-start items-center px-[10px] min-h-[30px] border-[1.5px] border-transparent   rounded-[8px]  cursor-pointer " +
                  (theme
                    ? " text-[#b8bcc1c7] hover:text-[white]"
                    : " text-[#2e2f30c7] hover:text-[#000000]")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setViewExtend(!viewExtend);
                  setFileExtend(false);
                  setToolsExtend(false);
                }}
              >
                View
                <ChevronDown
                  width={14}
                  height={14}
                  strokeWidth={2.4}
                  className="ml-[5px] mr-[-3px] mt-[2px]"
                />
              </div>
              <div
                className={
                  "w-auto px-[4px] h-auto py-[4px]  rounded-lg border-[1.5px] border-[#353538]   z-30 bg-[#232325] flex-col justify-center items-start mt-[15px]" +
                  (viewExtend ? " flex" : " hidden")
                }
              >
                <div className="p-[6px] w-auto flex flex-col justify-start items-start bg-[#161618] rounded-[6px]">
                  {/* <div></div> */}
                  <div className="bg-[#39393b] w-[50px] rounded-[5px] min-h-[25px] max-h-[25px] "></div>
                  <div className="flex justify-start items-center mt-[-25px]">
                    <label
                      className="flex w-[50px] justify-center items-center px-[7px] min-h-[25px] max-h-[25px] text-[white] rounded-[6px]  cursor-pointer whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewExtend(false);
                      }}
                      // style={{ transition: "2s", transitionDelay: ".4s" }}
                    >
                      Graph
                    </label>
                    <label
                      className="flex w-[50px] justify-center items-center px-[7px] min-h-[25px] max-h-[25px] text-[#b8bcc16d] rounded-[6px]  cursor-not-allowed whitespace-nowrap"
                      // style={{ transition: "2s", transitionDelay: ".4s" }}
                    >
                      Tree
                    </label>
                  </div>
                </div>
                {/* <label
                  className="flex w-full justify-between items-center mt-[4px] px-[7px] min-h-[30px] max-h-[30px] hover:bg-[#39393b] border-[1.5px] border-transparent  text-[#b8bcc1c7] hover:text-[white] rounded-[6px]  cursor-pointer whitespace-nowrap"
                  // style={{ transition: "2s", transitionDelay: ".4s" }}

                  onClick={(e) => {
                    e.stopPropagation();
                    setViewExtend(false);
                    localStorage.setItem("JSONBeauty_theme", !theme);
                    setTheme(!theme);
                  }}
                >
              
                  Dark Mode
                  {theme ? (
                    <Check width={14} height={14} strokeWidth={2.8} />
                  ) : (
                    <></>
                  )}
                </label> */}
              </div>
            </div>{" "}
            <div className="flex flex-col justify-start items-start ml-[0px] h-[30px] w-[70px] overflow-visible text-[13px]">
              <div
                className={
                  "flex justify-start items-center px-[10px] min-h-[30px] border-[1.5px] border-transparent   rounded-[8px]  cursor-pointer " +
                  (theme
                    ? " text-[#b8bcc1c7] hover:text-[white]"
                    : " text-[#2e2f30c7] hover:text-[#000000]")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setToolsExtend(!toolsExtend);
                  setViewExtend(false);
                  setFileExtend(false);
                }}
              >
                Tools
                <ChevronDown
                  width={14}
                  height={14}
                  strokeWidth={2.4}
                  className="ml-[5px] mr-[-3px] mt-[2px]"
                />
              </div>
              <div
                className={
                  "w-auto px-[4px] h-auto py-[4px]  rounded-lg border-[1.5px] border-[#353538] text-[13px]  z-30 bg-[#232325] flex-col justify-center items-start mt-[15px]" +
                  (toolsExtend ? " flex" : " hidden")
                }
              >
                <div
                  className="flex w-full justify-start items-center px-[7px] min-h-[30px] max-h-[30px] hover:bg-[#39393b] border-[1.5px] border-transparent  text-[#b8bcc1c7] hover:text-[white] rounded-[6px]  cursor-pointer whitespace-nowrap"
                  // style={{ transition: "2s", transitionDelay: ".4s" }}
                  for="image-file-input"
                  onClick={(e) => {
                    e.stopPropagation();
                    setJsonQModal(true);
                    setToolsExtend(false);
                  }}
                >
                  <SearchCode
                    width={14}
                    height={14}
                    strokeWidth={2.4}
                    className="mt-[2x] mr-[10px]"
                  />
                  JSON Query
                  <input
                    id="image-file-input"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  ></input>
                </div>
                <div
                  className="flex w-full justify-start items-center px-[7px] min-h-[30px] max-h-[30px] hover:bg-[#39393b] border-[1.5px] border-transparent  text-[#b8bcc1c7] hover:text-[white] rounded-[6px]  cursor-pointer whitespace-nowrap"
                  // style={{ transition: "2s", transitionDelay: ".4s" }}
                  for="image-file-download"
                >
                  <Route
                    width={14}
                    height={14}
                    strokeWidth={2.4}
                    className="mt-[2x] mr-[10px]"
                  />
                  JSON Path
                  {/* <input
                    id="image-file-input"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  ></input> */}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center">
            {/* <span className="text-[13px] mr-[15px] text-[#b8bcc18d]">
              v 1.3.4.10
            </span> */}
            <a
              href="https://github.com/WRATH2002/JSONVisualizer"
              target="_blank"
              className="w-[32px] h-[32px] rounded-[6px] mr-[-18px] text-[white] border-[1.5px] border-transparent hover:border-[#49494c] hover:bg-[#39393B] cursor-pointer flex justify-center items-center "
            >
              <Github width={18} height={18} strokeWidth={2} />
            </a>
          </div>
        </div>
        <div className="w-full h-[calc(100%-83px)] flex flex-row justify-start items-start">
          <div
            style={{ width: leftSidebar ? `${leftWidth}px` : "0px" }}
            className={
              " h-full  rounded-l-xl overflow-hidden" +
              (theme ? " bg-[#161618]" : " bg-[#F6F6F6]")
            }
          >
            <Editor
              className={
                "w-full h-full font-mono text-[14px] border-[2px] border-r-[0px] rounded-l-xl overflow-hidden cursor-text    " +
                (theme ? " border-[#36363a]" : " border-[#f0efef]")
              }
              defaultLanguage="json"
              theme="customDark" // Use the custom theme
              value={jsonInput}
              onChange={(value) => handleInput(value)}
              options={{
                minimap: { enabled: false },
                formatOnPaste: true,
                automaticLayout: true,
                stickyScroll: { enabled: false },
                scrollbar: {
                  verticalScrollbarSize: 4,
                  horizontalScrollbarSize: 4,
                  alwaysConsumeMouseWheel: false,
                },
              }}
            />

            {/* {error && <p className="mt-2 text-sm text-red-600">{error}</p>}  */}
          </div>

          {/* Drag Handle */}
          <div
            onMouseDown={handleMouseDown}
            className={
              " cursor-ew-resize h-full" +
              (leftSidebar ? " w-[2px]" : " 0px") +
              (theme ? " bg-[#36363a]" : " bg-[#f0efef]")
            }
          />

          {/* Right Div */}
          <div
            style={{
              width: leftSidebar ? `calc(100% - ${leftWidth}px)` : "100%",
            }}
            className={
              "h-full  border-[2px] overflow-hidden " +
              (leftSidebar
                ? " rounded-r-xl border-l-[0px]"
                : " rounded-xl border-l-[2px]") +
              (theme
                ? " bg-[#161618] border-[#36363a]"
                : " bg-[#F6F6F6] border-[#f0efef]")
            }
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
                style: { stroke: "#6a6a72", strokeWidth: 2 },
              }}
              // className="react-flow__pane custom-grab"
            >
              <Background />
              {/* <Controls
                position="bottom-left" // Move controls to top-left
                showZoom={true} // Show zoom buttons
                showFitView={true} // Show "Fit View" button
                showInteractive={false} // Hide interaction toggle button
                backgroundColor="#232325" // Background color for controls
                style={{
                  backgroundColor: "#232325",
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "row",
                }} // Custom styles for controls
              /> */}
              <CustomControls />
              {/* <Controls>
                <ControlButton
                  onClick={() => alert("Something magical just happened. ✨")}
                >
                 
                  eh
                </ControlButton>
              </Controls> */}
              {/* <Controls orientation="horizontal">
              
                <ControlButton onClick={() => console.log("Zoom In")}>
                  <Plus />
                </ControlButton>
                <ControlButton onClick={() => console.log("Zoom Out")}>
                  <Minus />
                </ControlButton>

                <ControlButton onClick={() => console.log("Fit View")}>
                  <Expand />
                </ControlButton>
              </Controls> */}
              <DownloadButton setDownloading={setDownloading} />
            </ReactFlow>
          </div>
        </div>
        <div className="w-full h-[30px] font-[geistRegular] flex justify-between items-center mt-[8px] pb-[8px] px-[8px] text-[#b8bcc1c7]">
          <div className="flex justify-start items-center">
            <PanelLeft
              width={14}
              height={14}
              strokeWidth={2}
              className="hover:text-[white] cursor-pointer mr-[15px]"
              onClick={() => {
                setLeftSidebar(!leftSidebar);
              }}
            />
            <span
              className={
                "text-[12px] flex justify-start items-center whitespace-nowrap " +
                (error.length == 0 ? " text-[#29e179c7]" : " text-[#f06d1cea]")
              }
            >
              {error.length == 0 ? (
                <>
                  <BadgeCheck
                    width={14}
                    height={14}
                    strokeWidth={2}
                    className=" cursor-pointer mr-[5px]"
                  />
                </>
              ) : (
                <>
                  <BadgeX
                    width={14}
                    height={14}
                    strokeWidth={2}
                    className=" cursor-pointer mr-[5px]"
                  />
                </>
              )}
              {error.length == 0 ? <>Valid</> : <>{error}</>}
            </span>
          </div>
          <div className="flex justify-end items-center">
            <span className="text-[12px] mr-[15px] flex justify-start items-center whitespace-nowrap">
              Nodes : {nodes.length}
            </span>
            <span className="text-[12px] mr-[25px] flex justify-start items-center whitespace-nowrap">
              Edges : {edges.length}
            </span>
            <span className="text-[12px] text-[#b8bcc18d]">v 1.3.4.10</span>
          </div>
        </div>
        {jsonQModal ? (
          <JsonQuery json={jsonInput} setJsonQModal={setJsonQModal} />
        ) : (
          <></>
        )}
      </div>
      {/* </ReactFlowProvider> */}
      {/* <JsonQuery /> */}
      {modalData && (
        <div
          className={
            "w-full fixed top-0 left-0 font-[geistRegular] h-[100svh] flex justify-center items-center  bg-opacity-50 z-[100]" +
            (modalDataModal ? " bg-[#0000009f]" : " bg-[#00000000]")
          }
          style={{ transition: ".3s" }}
          onClick={() => {
            setModalDataModal(false);
            setTimeout(() => {
              setModalData(null);
            }, 200);
          }}
        >
          <div
            className={
              "bg-[#232325] rounded-xl p-[10px] py-[20px] w-xl max-h-[60%] border-[1.5px] border-[#2d2d2f]  " +
              (modalDataModal
                ? " mt-[0px] opacity-100"
                : " mt-[-40px] opacity-0")
            }
            style={{ transition: ".3s" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="px-[10px] w-full h-[20px] flex justify-start items-center text-[14px] mt-[0px] text-[#b8bcc1c7]">
              Node Content
            </div>
            <div className="mt-[10px] mb-[-40px] w-full h-[40px] flex justify-end items-center pr-[20px]">
              <Files
                width={16}
                height={16}
                strokeWidth={2}
                className="text-[#b8bcc1c7] hover:text-[white] cursor-pointer"
                onClick={(e) => {
                  CopyToClipboard(convertArrayToJson(modalData));
                }}
              />
            </div>
            <pre
              className="w-[calc(100%-20px)] ml-[10px] bg-[#161618] max-h-[calc(100%-130px)] p-[15px] text-[white] text-[14px] overflow-scroll rounded-lg border-[1.5px] border-[#2a2a2d]"
              style={{ maxHeight: "calc(100% - 130px)" }}
            >
              <span>{`{`}</span>
              {modalData.map((data, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="flex justify-start items-start ml-[20px]"
                    >
                      <span className="text-[#3fbcf6]">"{data.key}"</span> :{" "}
                      <span
                        className={
                          "whitespace-nowrap" +
                          (typeof data?.value == "number"
                            ? " text-[#dcdcaa]"
                            : typeof data?.value == "boolean"
                            ? " text-[#fe732d]"
                            : typeof data?.value == "string"
                            ? " text-[#ce9178]"
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
            <div className="px-[10px] w-full h-[20px] flex justify-self-auto items-center text-[14px] mt-[20px] text-[#b8bcc1c7]">
              JSON Path
            </div>
            <pre className=" w-[calc(100%-20px)] ml-[10px] bg-[#161618] h-[50px] pl-[15px] rounded-lg mt-[10px] flex justify-start items-center text-[14px] border-[1.5px] border-[#2a2a2d]">
              <div className="h-full w-[calc(100%-40px)] mr-[0px] flex justify-start items-center whitespace-nowrap  overflow-x-scroll text-[#ffffffba]">
                {path}
              </div>
              <div className="w-[40px] h-[50px] flex justify-center items-center text-[#b8bcc1c7] hover:text-[white] cursor-pointer">
                <Files
                  width={16}
                  height={16}
                  strokeWidth={2}
                  onClick={(e) => {
                    CopyToClipboard(path);
                  }}
                />
              </div>
            </pre>
          </div>
        </div>
      )}
      <DownloadLoader downloading={downloading} />
      <CopyLoader copied={copied} />
    </>
  );
}

export default App;

const DownloadLoader = (props) => {
  return (
    <>
      <div
        className={
          "bottom-[20px]  text-[#cdd3db] border-[1.5px] border-[#4b4b4d] text-[14px] fixed z-[40] px-[13px] h-[40px] rounded-lg  bg-[#39393B] flex justify-center items-center" +
          (props?.downloading
            ? " right-[20px] opacity-100"
            : " right-[-200px] opacity-0")
        }
        style={{ transition: ".4s" }}
      >
        <l-ring-2
          size="15"
          stroke="2"
          stroke-length="0.25"
          bg-opacity="0.3"
          speed="0.8"
          color="#cdd3db"
        ></l-ring-2>
        <span className="ml-[10px]">Downloading</span>
      </div>
    </>
  );
};

const CopyLoader = (props) => {
  return (
    <>
      <div
        className={
          "bottom-[20px]  text-[#cdd3db] border-[1.5px] border-[#4b4b4d] text-[14px] fixed z-[150] px-[13px] h-[40px] rounded-lg  bg-[#39393B] flex justify-center items-center" +
          (props?.copied
            ? " right-[20px] opacity-100"
            : " right-[-200px] opacity-0")
        }
        style={{ transition: ".2s" }}
      >
        <span className="">Text Copied</span>
      </div>
    </>
  );
};
