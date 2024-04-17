import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import React from "react";

function handleCancelMapping(
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>
) {
  fetch("http://192.168.2.200:8888/api/work/StopMappingTask", {
    method: "POST", // 或 'GET'
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // 检查响应是否成功
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // 解析响应主体
      return response.json();
    })
    .then((data) => {
      // 处理解析后的数据
      console.log(data);
    })
    .catch((error) => {
      // 处理错误
      console.error("Error:", error);
    });
  setDialogStatus(0);
}
interface MappingCancelProps {
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>;
}

const MappingCancel: React.FC<MappingCancelProps> = ({ setDialogStatus }) => {
  return (
    <div>
      <AlertDialogAction
        onClick={() => handleCancelMapping(setDialogStatus)}
        className="bg-red-500 hover:bg-red-600"
      >
        结束建图
      </AlertDialogAction>
    </div>
  );
};

export default MappingCancel;
