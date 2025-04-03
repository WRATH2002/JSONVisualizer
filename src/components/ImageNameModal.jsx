import React, { useEffect, useState } from "react";
import { Panel, useReactFlow, getNodesBounds } from "reactflow";
import { toPng } from "html-to-image";
import { ImageDown, ImageIcon } from "lucide-react";

function downloadImage(dataUrl, fileName, fileType) {
  const a = document.createElement("a");
  a.setAttribute("download", `${fileName}.${fileType}`);
  a.setAttribute("href", dataUrl);
  a.click();
}

const scaleFactor = 30; // Further increased scale factor for ultra-high resolution
const padding = 50; // Padding around the content
const backgroundColor = "#161618"; // Background color for the image

export default function ImageNameModal(props) {
  const [fileName, setFileName] = useState("JSON_beauty");
  const [imageType, setImageType] = useState("png");

  const { getNodes } = useReactFlow();

  const onClickDownload = () => {
    props?.setDownloading(true);
    const nodesBounds = getNodesBounds(getNodes());

    const paddedBounds = {
      x: nodesBounds.x - padding,
      y: nodesBounds.y - padding,
      width: nodesBounds.width + padding * 2,
      height: nodesBounds.height + padding * 2,
    };

    const contentWidth = paddedBounds.width * scaleFactor;
    const contentHeight = paddedBounds.height * scaleFactor;

    const element = document.querySelector(".react-flow__viewport");

    const options = {
      backgroundColor: backgroundColor,
      width: contentWidth,
      height: contentHeight,
      pixelRatio: scaleFactor,
      style: {
        width: `${paddedBounds.width}px`,
        height: `${paddedBounds.height}px`,
        transform: `translate(${-paddedBounds.x * scaleFactor}px, ${
          -paddedBounds.y * scaleFactor
        }px) scale(${scaleFactor})`,
        transformOrigin: "top left",
      },
    };

    // Handle different file formats
    if (imageType === "png") {
      toPng(element, options).then((dataUrl) =>
        downloadImage(dataUrl, fileName, "png")
      );
    } else if (imageType === "jpg") {
      import("html-to-image").then(({ toJpeg }) =>
        toJpeg(element, { ...options, quality: 0.95 }).then((dataUrl) =>
          downloadImage(dataUrl, fileName, "jpg")
        )
      );
    } else if (imageType === "svg") {
      import("html-to-image").then(({ toSvg }) =>
        toSvg(element, options).then((dataUrl) =>
          downloadImage(dataUrl, fileName, "svg")
        )
      );
    }
  };

  return (
    <div
      className={
        "w-full fixed top-0 left-0 font-[geistRegular] h-[100svh] flex justify-center items-center  bg-opacity-50 z-[100]" +
        (props?.modalAnime ? " bg-[#0000009f]" : " bg-[#00000000]")
      }
      style={{ transition: ".3s" }}
      onClick={() => {
        props?.setModalAnime(false);
        setTimeout(() => {
          props?.setImageModal(false);
        }, 200);
      }}
    >
      <div
        className={
          "w-sm h-auto rounded-xl bg-[#232325]  p-[20px] pt-[15px] pb-[20px] flex flex-col justify-start items-start text-[white] text-[14px] border-[1.5px] border-[#2d2d2f]" +
          (props?.modalAnime
            ? " mt-[0px] opacity-100"
            : " mt-[-40px] opacity-0")
        }
        style={{ transition: ".3s" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span className="text-[14px] text-[#b8bcc1c7]">Image filename</span>
        <div className="p-[4px] bg-[#161618] border-[1.5px] border-[#2a2a2d] rounded-lg mt-[10px]">
          <div
            className={
              "w-[50px] h-[26px] rounded-md bg-[#39393B]" +
              (imageType == "png"
                ? " ml-[0px]"
                : imageType == "jpg"
                ? " ml-[50px]"
                : " ml-[100px]")
            }
            style={{ transition: ".3s" }}
          ></div>
          <div className="flex justify-start items-center mt-[-26px]">
            <div
              className={
                "w-[50px] h-[26px] rounded-md flex justify-center items-center cursor-pointer hover:text-[white]" +
                (imageType == "png"
                  ? " bg-transparent text-[white]"
                  : " bg-transparent text-[#b8bcc16d]")
              }
              style={{ transition: ".3s" }}
              onClick={(e) => {
                e.stopPropagation();
                setImageType("png");
              }}
            >
              png
            </div>
            <div
              className={
                "w-[50px] h-[26px] rounded-md flex justify-center items-center cursor-pointer hover:text-[white]" +
                (imageType == "jpg"
                  ? " bg-transparent text-[white]"
                  : " bg-transparent text-[#b8bcc16d]")
              }
              style={{ transition: ".3s" }}
              onClick={(e) => {
                e.stopPropagation();
                setImageType("jpg");
              }}
            >
              jpg
            </div>
            <div
              className={
                "w-[50px] h-[26px] rounded-md flex justify-center items-center cursor-pointer hover:text-[white]" +
                (imageType == "svg"
                  ? " bg-transparent text-[white]"
                  : " bg-transparent text-[#b8bcc16d]")
              }
              style={{ transition: ".3s" }}
              onClick={(e) => {
                e.stopPropagation();
                setImageType("svg");
              }}
            >
              svg
            </div>
          </div>
        </div>
        <div className="w-full text-[13px] h-[40px] outline-none px-[15px] bg-[#161618] border-[1.5px] border-[#2a2a2d] mt-[10px] rounded-lg flex justify-start items-center">
          <input
            className="w-full h-[40px] outline-none  "
            value={fileName}
            placeholder="Enter your filename ..."
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                if (fileName.length === 0) {
                } else {
                  onClickDownload();
                  props?.setModalAnime(false);
                  setTimeout(() => {
                    setImageModal(false);
                  }, 200);
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
                setFileName(e.target.value);
              }
            }}
          ></input>
          <span className="text-[14px] text-[#b8bcc178]">.{imageType}</span>
        </div>
        <div className="w-full flex justify-end items-center mt-[20px]">
          <button
            className={
              "bg-[#39393b]  border-[1.5px] border-[#49494c]  text-[#a7acb2] text-[13px] flex justify-center items-center h-[28px] px-[7px] rounded-[5px] " +
              (fileName.length === 0
                ? "opacity-50 cursor-not-allowed hover:bg-[#39393b] hover:border-[#49494c] hover:text-[#a7acb2]"
                : " opacity-100 cursor-pointer hover:bg-[#49494b] hover:border-[#57575a] hover:text-[#ffffff]")
            }
            onClick={() => {
              if (fileName.length === 0) {
              } else {
                onClickDownload();
                props?.setModalAnime(false);
                setTimeout(() => {
                  setImageModal(false);
                }, 200);
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
