import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import React from "react";
import { Loc_AGV } from "./columns";
import { FolderDownload } from "@icon-park/react";

const handleDownload = async (loc: Loc_AGV) => {
  // 发送 POST 请求
  // fetch("http://192.168.2.200:8888//api/download/LocalizationBagZipFile", {
  //   method: "POST",
  //   cache: "no-store",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     bag_name: loc.name,
  //   }),
  // })
  //   .then((response) => {
  //     // 检查响应的状态码
  //     if (!response.ok) {
  //       throw new Error("HTTP 状态" + response.status);
  //     }
  //     return response.blob();
  //   })
  //   .then((blob) => {
  //     // 创建一个链接元素
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.style.display = "none";
  //     a.href = url;
  //     // 设置下载的文件名
  //     a.download = loc.name + ".zip";
  //     // 将链接元素添加到DOM中
  //     document.body.appendChild(a);
  //     // 触发下载
  //     a.click();
  //     // 清理
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   })
  //   .catch((error) => {
  //     // 处理错误
  //     console.error("Error:", error);
  //   });
};

const DownloadItem = (loc: Loc_AGV) => {
  return (
    <>
      <DropdownMenuItem
        className="flex flex-row gap-2 items-center"
        onClick={() => handleDownload(loc)}
      >
        <FolderDownload theme="two-tone" size="20" fill={["#333", "#16a34a"]} />
        下载
      </DropdownMenuItem>
    </>
  );
};

export default DownloadItem;
