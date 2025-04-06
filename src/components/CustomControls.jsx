import { useReactFlow } from "reactflow";
import {
  Plus,
  Minus,
  Expand,
  Fullscreen,
  Search,
  RotateCcwSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchNodeArr, updateSearchNodeArr } from "../utils/dataSlice";

const CustomControls = (props) => {
  const [searchPrompt, setSearchPrompt] = useState(""); // State to hold the search prompt
  const [tempSearchPrompt, setTempSearchPrompt] = useState(""); // State to hold the search prompt
  const { zoomIn, zoomOut, fitView } = useReactFlow(); // Get zoom & fitView functions

  const temp1 = useSelector((store) => store.data.searchNodeArr);
  const dispatch = useDispatch();

  function isSubstring(str1, str2) {
    return str1.toLowerCase().includes(str2.toLowerCase());
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     fitView({ duration: 800 });
  //   }, 50);
  // }, [props?.nodes, props?.edges]);

  useEffect(() => {
    if (props?.changed) {
      setTimeout(() => {
        fitView({ duration: 800 });
      }, 50);
      props?.setChanged(false);
    }
  }, [props?.changed]);

  function getResultArray() {
    // props?.nodes
    let tempArr = [];
    props?.nodes?.map((node) => {
      if (node?.data?.label == "Attributes") {
        node?.data?.attributes?.map((item) => {
          if (
            isSubstring(JSON.stringify(item?.key), searchPrompt) ||
            isSubstring(JSON.stringify(item?.value), searchPrompt)
          ) {
            if (!tempArr.includes(node?.id)) {
              tempArr.push(node?.id);
            }
          }
        });
        // tempArr.push(node.id);
      } else {
        if (
          node?.data?.label
            ?.toLowerCase()
            ?.includes(searchPrompt?.toLowerCase())
        ) {
          if (!tempArr.includes(node?.id)) {
            tempArr.push(node?.id);
          }
        }
      }
    });

    console.log("tempArr ---------> ", tempArr);
    // props?.setSearchNodeArr(tempArr);
    dispatch(updateSearchNodeArr(tempArr));
    let a = searchPrompt;
    setTempSearchPrompt(a);
    handleZoom(tempArr[0]);

    // console.log(typeof props?.nodes[7].data.attributes[0].value);
  }

  // useEffect(() => {
  //   console.log("searchNodeArr ---------> ", props?.searchNodeArr);
  // }, [props?.searchNodeArr]);

  const { setCenter } = useReactFlow();

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
    // if (searchPrompt.length != 0) {
    const timer = setTimeout(() => {
      if (searchPrompt.length === 0) {
        dispatch(clearSearchNodeArr());
        setTempSearchPrompt("");
        fitView({ duration: 800 });
      } else if (searchPrompt == tempSearchPrompt) {
        if (props?.currZoomIndex + 1 >= temp1?.length) {
          handleZoom(temp1[0]);
          props?.setCurrZoomIndex(0);
        } else {
          handleZoom(temp1[props?.currZoomIndex + 1]);
          props?.setCurrZoomIndex(props?.currZoomIndex + 1);
        }
      } else {
        console.log("calling getResultArray()");
        getResultArray();
      }
    }, 300);
    return () => {
      clearTimeout(timer);
    };
    // }
  }, [searchPrompt]);

  return (
    <div className="absolute bottom-[8px] left-[8px] flex justify-start items-end z-[90] ">
      <div className="bg-[#232325] p-[5px] rounded-lg flex gap-[5px] z-[90] border-[1.5px] border-[#2d2d2f] drop-shadow-2xl">
        {/* Zoom In */}
        <button
          onClick={() => zoomIn()}
          className="hover:bg-[#39393B] w-[27px] h-[27px] flex justify-center items-center rounded-[5px] text-[#b8bcc1c7] hover:text-[white] cursor-pointer
        "
        >
          <Plus width={16} height={16} strokeWidth={2.4} className="" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => zoomOut()}
          className="hover:bg-[#39393B] w-[27px] h-[27px] flex justify-center items-center rounded-[5px] text-[#b8bcc1c7] hover:text-[white] cursor-pointer
        "
        >
          <Minus width={16} height={16} strokeWidth={2.4} className="" />
        </button>

        {/* Fit View */}
        <button
          onClick={() => fitView({ duration: 800 })}
          className="hover:bg-[#39393B] w-[27px] h-[27px] flex justify-center items-center rounded-[5px] text-[#b8bcc1c7] hover:text-[white] cursor-pointer
        "
        >
          <Fullscreen width={16} height={16} strokeWidth={2.4} className="" />
        </button>
      </div>
      <div className="w-[200px] h-[38px] border-b-[2px] border-[#424245] ml-[10px] flex justify-start items-center text-[#b8bcc1c7]">
        <div className="w-[25px]  flex justify-start items-center ">
          <Search width={16} height={16} strokeWidth={2.4} />
        </div>
        <input
          className="text-[14px] text-[white] w-[calc(100%-60px)] h-full outline-none"
          placeholder="Search data"
          value={searchPrompt}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              // console.log(tempSearchPrompt, searchPrompt);
              if (searchPrompt?.length === 0) {
                dispatch(clearSearchNodeArr());
                setTempSearchPrompt("");
              } else if (searchPrompt == tempSearchPrompt) {
                if (props?.currZoomIndex + 1 >= temp1?.length) {
                  handleZoom(temp1[0]);
                  props?.setCurrZoomIndex(0);
                } else {
                  handleZoom(temp1[props?.currZoomIndex + 1]);
                  props?.setCurrZoomIndex(props?.currZoomIndex + 1);
                }
              } else {
                console.log("calling getResultArray()");
                getResultArray();
              }
            }
            console.log(temp1);
          }}
          onChange={(e) => {
            setSearchPrompt(e.target.value);
            // setTempSearchPrompt(e.target.value);
          }}
        ></input>
        <div className="w-[35px] text-[12px]  h-full flex justify-end items-center">
          {temp1.length > 0 ? <>{props?.currZoomIndex + 1}</> : <>0</>}/
          {temp1?.length}
        </div>
      </div>
      {props?.nodes == props?.tempNodes || props?.edges == props?.tempEdges ? (
        <></>
      ) : (
        <>
          <button
            className="bg-[#232325] text-[14px] flex justify-center items-center min-h-[37px] ml-[10px] w-auto  rounded-lg px-[10px] border-[1.5px] border-[#2d2d2f] drop-shadow-2xl text-[#b8bcc1c7] hover:text-[white] cursor-pointer hover:bg-[#39393b] hover:border-[#49494c]"
            onClick={() => {
              props?.setNodes(props?.tempNodes);
              props?.setEdges(props?.tempEdges);
              setTimeout(() => {
                fitView({ duration: 800 });
              }, 200);
            }}
          >
            <RotateCcwSquare
              width={16}
              height={16}
              strokeWidth={2.4}
              className="mr-[7px]"
            />{" "}
            Show original
          </button>
        </>
      )}
    </div>
  );
};

export default CustomControls;
