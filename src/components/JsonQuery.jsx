import { Files, TriangleAlert, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";

export default function JsonQuery(props) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState();

  const { setCenter } = useReactFlow();
  const { fitView } = useReactFlow();

  const handleZoom = (zoomNodeID) => {
    const targetNode = props?.nodes.find((node) => node.id === zoomNodeID);

    if (targetNode) {
      const { x, y } = targetNode.position;
      const nodeWidth = targetNode.width || 150; // fallback width
      const nodeHeight = targetNode.height || 50; // fallback height

      // Calculate center point of the node
      const centerX = x + nodeWidth / 2;
      const centerY = y + nodeHeight / 2;

      setCenter(centerX, centerY, {
        zoom: 1.2,
        duration: 800,
      });
    }
  };

  useEffect(() => {
    setResult(query?.split(".")?.reduce((acc, key) => acc?.[key], props?.json));
  }, [query]);

  useEffect(() => {
    if (props?.json) {
      console.log("result");
      console.log(
        query
          ?.replace(/\[(\d+)\]/g, ".$1")
          ?.split(".")
          ?.reduce((acc, key) => acc?.[key], JSON?.parse(props?.json))
      );
    }
  }, [query]);

  const CopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // alert("Copied to clipboard!");
      props?.setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  function getNodeID(JSONpath) {
    let id = "";
    props?.nodes?.map((data) => {
      if (data?.data?.path == JSONpath) {
        id = data?.id;
      }
    });
    console.log("id ----> ", id);
    return id;
  }

  function getFirstNodeID(JSONpath) {
    let id = "";
    props?.nodes?.map((data) => {
      if (id.length > 0) {
        return;
      } else {
        if (data?.data?.path == JSONpath) {
          id = data?.id;
        }
      }
    });
    console.log("id ----> ", id);
    return id;
  }

  function getChildSubgraph(startNodeId, nodes, edges) {
    const visited = new Set();
    const newNodes = new Set();
    const newEdges = [];

    function dfs(currentNodeId) {
      if (visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      // Find all edges where currentNodeId is the source
      const childrenEdges = edges.filter(
        (edge) => edge.source === currentNodeId
      );

      for (const edge of childrenEdges) {
        const targetNodeId = edge.target;

        newEdges.push(edge); // Add edge to result
        newNodes.add(targetNodeId); // Add target node

        dfs(targetNodeId); // Recursively explore
      }
    }

    // Start from the given node
    newNodes.add(startNodeId); // Include the root node itself
    dfs(startNodeId);

    // Extract full node objects
    const finalNodes = nodes.filter((node) => newNodes.has(node.id));

    console.log(finalNodes);
    console.log(newEdges);
    props?.setNodes(finalNodes);
    props?.setEdges(newEdges);
    setTimeout(() => {
      fitView({ duration: 800 });
    }, 200);
  }

  return (
    <>
      <div
        className={
          "w-full fixed top-0 left-0 font-[geistRegular] h-[100svh] flex justify-center items-center  bg-opacity-50 z-[100]" +
          (props?.modalDataModal ? " bg-[#0000009f]" : " bg-[#00000000]")
        }
        style={{ transition: ".3s" }}
        onClick={() => {
          props?.setModalDataModal(false);
          setTimeout(() => {
            props?.setJsonQModal(false);
          }, 200);
        }}
      >
        <div
          className={
            "bg-[#232325] rounded-xl p-[10px] py-[20px]  w-xl h-[70%] border-[1.5px] border-[#2d2d2f]  " +
            (props?.modalDataModal
              ? " mt-[0px] opacity-100"
              : " mt-[-40px] opacity-0")
          }
          style={{ transition: ".3s" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between items-center h-[30px] mb-[0px] pr-[10px]">
            {/* <h2 className="text-xl font-bold ">Node Details</h2> */}
            <div className="pl-[10px] text-[#b8bcc1c7] font-bold">
              JSON Path
            </div>
            <button
              onClick={() => {
                props?.setModalDataModal(false);
                setTimeout(() => {
                  props?.setJsonQModal(false);
                }, 200);
                // console.log(pro  ps?.json);
              }}
              className="text-[#b8bcc1c7] hover:text-[white] hover:bg-[#39393B] h-[30px] w-[30px] rounded-[6px] cursor-pointer flex justify-center items-center"
            >
              <X width={20} height={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="mt-[5px] text-[14px] w-full px-[10px] h-[40px] text-[#b8bcc197]">
            Write your JSON Path and see the output.
          </div>
          <div className="px-[10px] w-full h-[20px] flex justify-start items-center text-[14px] mt-[0px] text-[#b8bcc1c7]">
            Your Query [ start -{`>`} root ]
          </div>

          <pre className=" w-[calc(100%-20px)] ml-[10px] bg-[#161618] border-[1.5px] border-[#2a2a2d] h-[50px] pl-[15px] rounded-lg mt-[10px] flex justify-start items-center text-[14px]">
            <input
              className="h-full w-[calc(100%-40px)] mr-[0px] flex justify-start items-center whitespace-nowrap  overflow-x-scroll outline-none"
              value={"root." + query}
              onChange={(e) => {
                if (e.target.value.includes(" ")) {
                } else {
                  setQuery(e.target.value.substr(5));
                }
              }}
            ></input>
            <div className="w-[40px] h-[50px] flex justify-center items-center text-[#b8bcc1c7] hover:text-[white] cursor-pointer">
              <Files
                width={16}
                height={16}
                strokeWidth={2}
                className="text-[#b8bcc1c7] hover:text-[white] cursor-pointer"
                onClick={() => {
                  CopyToClipboard("root." + query);
                }}
              />
            </div>
          </pre>
          <div className="px-[10px] w-full h-[20px] flex justify-start items-center text-[14px] mt-[20px] text-[#b8bcc1c7]">
            JSON Output
          </div>
          <div className="mt-[10px] mb-[-44px] w-full h-[44px] flex justify-end items-center pr-[22px]">
            <Files
              width={16}
              height={16}
              strokeWidth={2}
              className="text-[#b8bcc1c7] hover:text-[white] cursor-pointer"
              onClick={() => {
                if (
                  JSON.stringify(
                    query
                      ?.replace(/\[(\d+)\]/g, ".$1")
                      ?.split(".")
                      ?.reduce(
                        (acc, key) => acc?.[key],
                        JSON?.parse(props?.json)
                      ),
                    null,
                    2
                  ) != undefined
                ) {
                  CopyToClipboard(
                    // JSON.stringify(
                    JSON.stringify(
                      query
                        ?.replace(/\[(\d+)\]/g, ".$1")
                        ?.split(".")
                        ?.reduce(
                          (acc, key) => acc?.[key],
                          JSON?.parse(props?.json)
                        ),
                      null,
                      2
                    ),
                    null,
                    2
                    // )
                  );
                }
              }}
            />
          </div>
          {JSON.stringify(
            query
              ?.replace(/\[(\d+)\]/g, ".$1")
              ?.split(".")
              ?.reduce((acc, key) => acc?.[key], JSON?.parse(props?.json)),
            null,
            2
          ) == undefined && query.length != 0 ? (
            <>
              <pre className="w-[calc(100%-20px)] ml-[10px] bg-[#161618] border-[1.5px] border-[#2a2a2d] h-[calc(100%-245px)] flex justify-center items-center p-[15px] text-[#b8bcc1c7] text-[14px] overflow-scroll rounded-lg whitespace-pre-wrap">
                <TriangleAlert
                  width={18}
                  height={18}
                  strokeWidth={2}
                  className="text-[#b8bcc1c7]  cursor-pointer mr-[9px]"
                />{" "}
                Not a valid JSON Path
              </pre>
            </>
          ) : (
            <>
              {/* payload.value.content */}
              <pre className="w-[calc(100%-20px)] ml-[10px] bg-[#161618] border-[1.5px] border-[#2a2a2d] h-[calc(100%-245px)] p-[15px] text-[white] text-[14px] overflow-scroll rounded-lg whitespace-no-wrap">
                {/* {JSON.stringify(JSON.parse(props?.json), null, 2)} */}
                {query.length == 0 ? (
                  <>{props?.json}</>
                ) : (
                  <>
                    {JSON.stringify(
                      query
                        ?.replace(/\[(\d+)\]/g, ".$1")
                        ?.split(".")
                        ?.reduce(
                          (acc, key) => acc?.[key],
                          JSON?.parse(props?.json)
                        ),
                      null,
                      2
                    )}
                  </>
                )}
              </pre>
            </>
          )}

          <div className="w-full flex justify-end items-center mt-[10px] pr-[10px]">
            <button
              className={
                "bg-[#39393b]  border-[1.5px] border-[#49494c]  text-[#a7acb2] text-[14px] flex justify-center items-center h-[30px] px-[9px] rounded-[5px] w-auto" +
                (JSON.stringify(
                  query
                    ?.replace(/\[(\d+)\]/g, ".$1")
                    ?.split(".")
                    ?.reduce(
                      (acc, key) => acc?.[key],
                      JSON?.parse(props?.json)
                    ),
                  null,
                  2
                ) == undefined
                  ? " opacity-50 cursor-not-allowed hover:bg-[#39393b] hover:border-[#49494c] hover:text-[#a7acb2]"
                  : " opacity-100 cursor-pointer hover:bg-[#49494b] hover:border-[#57575a] hover:text-[#ffffff]")
              }
              onClick={() => {
                if (
                  JSON.stringify(
                    query
                      ?.replace(/\[(\d+)\]/g, ".$1")
                      ?.split(".")
                      ?.reduce(
                        (acc, key) => acc?.[key],
                        JSON?.parse(props?.json)
                      ),
                    null,
                    2
                  ) == undefined
                ) {
                } else {
                  // props?.setFileNameModal(false);
                  // handleExport();
                  // handleZoom(getNodeID("root." + query));
                  getChildSubgraph(
                    getFirstNodeID("root." + query),
                    props?.nodes,
                    props?.edges
                  );
                  props?.setModalDataModal(false);
                  setTimeout(() => {
                    props?.setJsonQModal(false);
                  }, 200);
                }
              }}
            >
              Show on Graph
            </button>
            <button
              className={
                "bg-[#39393b]  border-[1.5px] border-[#49494c] text-[#a7acb2] text-[14px] flex justify-center items-center h-[30px] px-[9px] rounded-[5px] ml-[10px] w-auto" +
                (JSON.stringify(
                  query
                    ?.replace(/\[(\d+)\]/g, ".$1")
                    ?.split(".")
                    ?.reduce(
                      (acc, key) => acc?.[key],
                      JSON?.parse(props?.json)
                    ),
                  null,
                  2
                ) == undefined
                  ? " opacity-50 cursor-not-allowed hover:bg-[#39393b] hover:border-[#49494c] hover:text-[#a7acb2]"
                  : " opacity-100 cursor-pointer hover:bg-[#49494b] hover:border-[#57575a] hover:text-[#ffffff]")
              }
              onClick={() => {
                if (
                  JSON.stringify(
                    query
                      ?.replace(/\[(\d+)\]/g, ".$1")
                      ?.split(".")
                      ?.reduce(
                        (acc, key) => acc?.[key],
                        JSON?.parse(props?.json)
                      ),
                    null,
                    2
                  ) == undefined
                ) {
                } else {
                  // props?.setFileNameModal(false);
                  // handleExport();
                  handleZoom(getNodeID("root." + query));
                  props?.setModalDataModal(false);
                  setTimeout(() => {
                    props?.setJsonQModal(false);
                  }, 200);
                }
              }}
            >
              Zoom to Node
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
