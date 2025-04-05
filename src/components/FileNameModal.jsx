import React, { useEffect } from "react";

export default function FileNameModal(props) {
  const handleExport = () => {
    // props?.setFileExtend(false);
    const jsonString = props?.jsonInput;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = props?.fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    props?.setFileName("");
  };

  return (
    <div
      className={
        "w-full fixed top-0 left-0 font-[geistRegular] h-[100svh] flex justify-center items-center  bg-opacity-50 z-[100]" +
        (props?.modalDataModal ? " bg-[#0000009f]" : " bg-[#00000000]")
      }
      style={{ transition: ".3s" }}
      onClick={() => {
        // e.stopPropagation();
        // handleExport();

        props?.setModalDataModal(false);
        setTimeout(() => {
          props?.setFileNameModal(false);
        }, 200);
      }}
    >
      <div
        className={
          "w-sm h-auto rounded-xl bg-[#232325] p-[20px] pt-[15px] pb-[20px] flex flex-col justify-start items-start text-[white] text-[14px] border-[1.5px] border-[#2d2d2f]" +
          (props?.modalDataModal
            ? " mt-[0px] opacity-100"
            : " mt-[-40px] opacity-0")
        }
        style={{ transition: ".3s" }}
        onClick={(e) => {
          e.stopPropagation();
          // handleExport();
          //   setFileNameModal(true);
        }}
      >
        <span className="text-[14px] text-[#b8bcc1c7]">JSON filename</span>
        <div className="w-full text-[13px] h-[40px] outline-none px-[15px] bg-[#161618] border-[1.5px] border-[#2a2a2d] mt-[10px] rounded-lg flex justify-start items-center">
          <input
            className="w-full h-[40px] outline-none  "
            value={props?.fileName}
            placeholder="Enter your filename ..."
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                if (props?.fileName.length === 0) {
                } else {
                  props?.setFileNameModal(false);
                  handleExport();
                }
              }
            }}
            onChange={(e) => {
              const invalidChars = " .,/?:;!@#$%^&*()+=-{}[]|'<>`~";

              if (
                invalidChars
                  .split("")
                  .some((char) => e.target.value.includes(char))
              ) {
                // do nothing
              } else {
                props?.setFileName(e.target.value);
              }
            }}
          ></input>
          <span className="text-[14px] text-[#b8bcc178]">.json</span>
        </div>
        <div className="w-full flex justify-end items-center mt-[20px]">
          <button
            className={
              "bg-[#39393b]  border-[1.5px] border-[#49494c]  text-[#a7acb2] text-[13px] flex justify-center items-center h-[28px] px-[7px] rounded-[5px] " +
              (props?.fileName.length === 0
                ? " opacity-50 cursor-not-allowed hover:bg-[#39393b] hover:border-[#49494c] hover:text-[#a7acb2]"
                : " opacity-100 cursor-pointer hover:bg-[#49494b] hover:border-[#57575a] hover:text-[#ffffff]")
            }
            onClick={() => {
              if (props?.fileName.length === 0) {
              } else {
                props?.setFileNameModal(false);
                handleExport();
              }
            }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
