import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
// #ebe6e7 -- border color default
export function JsonNode({ data, id }) {
  const [showChild, setShowChild] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const temp1 = useSelector((store) => store.data.searchNodeArr);

  useEffect(() => {}, [data?.searchNodeArr]);
  return (
    <>
      {/* {showModal ? <PopInfo /> : <></>} */}
      <div
        className={
          "  rounded-[8px]  border-[1.5px] hover:border-[#88d87d] min-w-[150px] max-w-[700px]" +
          (temp1?.includes(id)
            ? " border-[#88d87d] bg-[#21331f]"
            : " border-[#535358] bg-[#212123]")
        }
        onClick={() => {
          console.log(data);
          console.log(data.setModalData);
          data.setModalData(data.attributes);
          setTimeout(() => {
            data.setModalDataModal(true);
          }, 100);
          data.setPath(data.path);
          // console.log(id);
          // data?.setTargetNode(id);
        }}
      >
        <Handle type="target" position={Position.Left} className="w-2 h-2 " />
        <div className="font-mono w-full h-auto">
          <div
            className={
              "font-medium h-[40px] w-full text-[#f6a03f] px-4 flex justify-between items-center " +
              (data.label == "Attributes" ? " hidden" : " flex")
            }
          >
            {data.isArray ? (
              <div className="flex justify-start items-center">
                {data.label}{" "}
                <span className="ml-[20px] text-[#e2e2e2f8]">
                  [{data?.length}]
                </span>
              </div>
            ) : (
              <div className="flex justify-start items-center">
                {data.label}{" "}
                <span className="ml-[20px] text-[#e2e2e2f8]">{`{${data?.length}}`}</span>
              </div>
            )}
            <div
              className={
                "h-[40px] w-[30px] flex justify-end cursor-pointer items-center text-[#e2e2e2f8] ml-[10px]" +
                (data.label == "Attributes" ? " hidden" : " flex")
              }
              onClick={() => {
                if (showChild) {
                  data?.setTargetNode(id);
                  setShowChild(false);
                } else {
                  data?.setTargetNode("");
                  setShowChild(true);
                }
              }}
            >
              {!showChild ? (
                <EyeClosed width={18} height={18} strokeWidth={1.9} />
              ) : (
                <Eye width={18} height={18} strokeWidth={1.9} />
              )}
            </div>
          </div>
          {showChild ? (
            <>
              {data.attributes && (
                <div
                  className={
                    " w-full" + (data.label == "Attributes" ? " mt-0" : " mt-2")
                  }
                >
                  {data.attributes.map((attr, index) => (
                    <>
                      <div
                        key={index}
                        className={
                          "text-[14px] h-[40px] w-full font-medium flex justify-start items-center whitespace-nowrap  px-4 " +
                          (data.attributes.length - 1 == index
                            ? temp1?.includes(id)
                              ? " border-b-[1.5px] border-transparent"
                              : " border-b-[1.5px] border-transparent"
                            : temp1?.includes(id)
                            ? " border-b-[1.5px] border-[#244420]"
                            : " border-b-[1.5px] border-[#5353582a]")
                        }
                      >
                        <span className="text-[#9cdcfe] mr-[7px]">
                          {attr.key} :
                        </span>{" "}
                        <span
                          className={
                            "w-full whitespace-nowrap overflow-hidden text-ellipsis " +
                            (typeof attr.value == "number"
                              ? " text-[#dcdcaa]"
                              : typeof attr.value == "boolean"
                              ? " text-[#fe732d]"
                              : typeof attr.value == "string"
                              ? " text-[#ce9178]"
                              : " text-[#e2e2e2f8]")
                          }
                        >
                          {JSON.stringify(attr.value)}
                        </span>
                      </div>
                      {/* <div
                        className={
                          "w-full border-t-[1.5px] my-[10px] mb-[7px]" +
                          (data.attributes.length - 1 == index
                            ? " hidden"
                            : " flex") +
                          (temp1?.includes(id)
                            ? " border-[#244420]"
                            : " border-[#5353582a]")
                        }
                      ></div> */}
                    </>
                  ))}
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        <Handle type="source" position={Position.Right} className="w-2 h-2 " />
      </div>
    </>
  );
}

const PopInfo = () => {
  return (
    <div className="w-full h-[100svh] flex justify-center items-center fixed left-0 top-0 z-50 bg-[#262c35c9]">
      <div className="w-[300px] h-[200px] rounded-xl flex flex-col justify-start items-start bg-amber-400">
        Hello
      </div>
    </div>
  );
};
