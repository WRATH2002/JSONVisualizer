import React from "react";
import { Panel, useReactFlow, getNodesBounds } from "reactflow";
import { toPng } from "html-to-image";
import { ImageDown } from "lucide-react";

function downloadImage(dataUrl) {
  const a = document.createElement("a");
  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const scaleFactor = 30; // Further increased scale factor for ultra-high resolution
const padding = 50; // Padding around the content
const backgroundColor = "#161618"; // Background color for the image

function DownloadButton(props) {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    // Get the bounds of all nodes
    props?.setDownloading(true);
    const nodesBounds = getNodesBounds(getNodes());

    // Add padding to the bounds
    const paddedBounds = {
      x: nodesBounds.x - padding,
      y: nodesBounds.y - padding,
      width: nodesBounds.width + padding * 2,
      height: nodesBounds.height + padding * 2,
    };

    // Calculate the width and height of the content
    const contentWidth = paddedBounds.width * scaleFactor;
    const contentHeight = paddedBounds.height * scaleFactor;

    // Use html-to-image to capture the entire graph
    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: backgroundColor,
      width: contentWidth,
      height: contentHeight,
      pixelRatio: scaleFactor, // Increase pixel ratio for ultra-high resolution
      style: {
        width: `${paddedBounds.width}px`,
        height: `${paddedBounds.height}px`,
        transform: `translate(${-paddedBounds.x * scaleFactor}px, ${
          -paddedBounds.y * scaleFactor
        }px) scale(${scaleFactor})`,
        transformOrigin: "top left", // Ensure proper scaling
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        className="px-[10px] mt-[-10px] mr-[-10px] h-[33px] rounded-lg flex justify-center items-center text-[14px] bg-[#232325] text-[#b8bcc1] hover:bg-[#39393b] hover:text-[white] cursor-pointer border-[1.5px] border-[#353538] hover:border-[#49494c] drop-shadow-lg"
        onClick={onClick}
      >
        <ImageDown
          width={15}
          height={15}
          strokeWidth={2}
          className="mr-[7px]"
        />{" "}
        Export as image
      </button>
    </Panel>
  );
}

export default DownloadButton;
