import { Files, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function JsonQuery(props) {
  const [query, setQuery] = useState("payload");
  const [result, setResult] = useState();

  useEffect(() => {
    setResult(query?.split(".")?.reduce((acc, key) => acc?.[key], props?.json));
  }, [query]);

  return (
    <>
      <div className="fixed text-[white] inset-0 bg-[#0000009f] bg-opacity-50 flex items-center justify-center z-[100]">
        <div className="bg-[#323A44] rounded-xl p-[10px] pb-[20px] w-2xl max-h-[60vh] ">
          <div className="flex justify-between items-center h-[30px] mb-[0px]">
            {/* <h2 className="text-xl font-bold ">Node Details</h2> */}
            <div className="pl-[10px] text-[#b8bcc1] font-bold">JSON Query</div>
            <button
              onClick={() => {
                props?.setJsonQModal(false);
                // console.log(pro  ps?.json);
              }}
              className="text-gray-500 hover:text-[white] hover:bg-[#414b57] h-[30px] w-[30px] rounded-[6px] cursor-pointer flex justify-center items-center"
            >
              <X width={20} height={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="mt-[10px] text-[14px] w-full px-[10px] h-[40px] text-[#b8bcc1]">
            Write your JSON Query and see the output.
          </div>
          <div className="px-[10px] w-full h-[20px] flex justify-self-auto items-center text-[14px] mt-[0px] text-[#909cad]">
            Your Query [ start -{`>`} root ]
          </div>

          <pre className=" w-[calc(100%-20px)] ml-[10px] bg-[#262C35] h-[50px] pl-[15px] rounded-lg mt-[10px] flex justify-start items-center text-[14px]">
            <input
              className="h-full w-[calc(100%-40px)] mr-[0px] flex justify-start items-center whitespace-nowrap  overflow-x-scroll outline-none"
              value={query}
              onChange={(e) => {
                if (e.target.value.includes(" ")) {
                } else {
                  setQuery(e.target.value);
                }
              }}
            ></input>
            <div className="w-[40px] h-[50px] flex justify-center items-center text-gray-500 hover:text-[white] cursor-pointer">
              <Files width={18} height={18} strokeWidth={2} />
            </div>
          </pre>
          <div className="px-[10px] w-full h-[20px] flex justify-start items-center text-[14px] mt-[20px] text-[#909cad]">
            JSON Output
          </div>
          <div className="mt-[10px] mb-[-40px] w-full h-[40px] flex justify-end items-center pr-[20px]">
            <Files
              width={18}
              height={18}
              strokeWidth={2}
              className="text-gray-500 hover:text-[white] cursor-pointer"
            />
          </div>
          <pre className="w-[calc(100%-20px)] ml-[10px] bg-[#262C35] max-h-[calc(100%-190px)] p-[15px] text-[white] text-[14px] overflow-scroll rounded-lg whitespace-pre-wrap">
            {JSON.stringify(JSON.parse(props?.json), null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
