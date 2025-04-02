import { useReactFlow } from "reactflow";
import { Plus, Minus, Expand, Fullscreen } from "lucide-react";

const CustomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow(); // Get zoom & fitView functions

  return (
    <div className="absolute bottom-[8px] left-[8px] bg-[#232325] p-[6px] rounded-lg flex gap-2 z-[90] border-[1.5px] border-[#2d2d2f] drop-shadow-2xl">
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
        onClick={() => fitView({ padding: 0.2 })}
        className="hover:bg-[#39393B] w-[27px] h-[27px] flex justify-center items-center rounded-[5px] text-[#b8bcc1c7] hover:text-[white] cursor-pointer
        "
      >
        <Fullscreen width={16} height={16} strokeWidth={2.4} className="" />
      </button>
    </div>
  );
};

export default CustomControls;
