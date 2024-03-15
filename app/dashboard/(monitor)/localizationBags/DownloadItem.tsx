import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import React from "react";
import { Loc_AGV } from "./columns";

const handleDownload = async (loc: Loc_AGV) => {
  // 发送 POST 请求
  fetch("http://192.168.2.112:8888//api/download/LocalizationBagZipFile", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bag_name: loc.name,
    }),
  })
    .then((response) => {
      // 检查响应的状态码
      if (!response.ok) {
        throw new Error("HTTP 状态" + response.status);
      }
      return response.blob();
    })
    .then((data) => {
      console.log(data);
      //   const url = window.URL.createObjectURL(data);
      //   const a = document.createElement("a");
      //   a.href = url;
      //   a.download = "filename.zip"; // replace with your filename
      //   a.click();
      // 处理响应数据
    })
    .catch((error) => {
      // 处理错误
      console.error("Error:", error);
    });
};

const DownloadItem = (loc: Loc_AGV) => {
  return (
    <>
      <DropdownMenuItem
        className="flex flex-row gap-2 items-center"
        onClick={() => handleDownload(loc)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z"
            fill="#16a34a"
            stroke="#333"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M30 28L23.9933 34L18 28.0134"
            stroke="#333"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M24 20V34"
            stroke="#333"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        下载
      </DropdownMenuItem>
    </>
  );
};

export default DownloadItem;
