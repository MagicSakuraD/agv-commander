import { toast } from "@/components/ui/use-toast";
import React, { useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Node, columns } from "./columns";
import { set } from "react-hook-form";

const Nodelist = () => {
  const [nodes, setNodes] = React.useState<Node[]>([]); // [
  const nodes_list: Node[] = [];

  useEffect(() => {
    // 发送 GET 请求
    fetch("http://192.168.2.200:8888/api/info/GetAllNodeStatus", {
      method: "GET",
    })
      .then((response) => {
        // 检查响应的状态码
        if (!response.ok) {
          throw new Error("HTTP 状态" + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // 处理响应数据

        let node_data = data.data;

        for (const [name, status] of Object.entries(node_data)) {
          let statusText = "";
          if (status === 0) {
            statusText = "停止";
          } else if (status === 1) {
            statusText = "运行中";
          } else if (status === 2) {
            statusText = "完成";
          } else if (status === -1) {
            statusText = "异常";
          }
          nodes_list.push({
            name: name,
            status: statusText as "启动" | "关闭",
          });
        }
        setNodes(nodes_list);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }, []);

  return (
    <div>
      <DataTable columns={columns} data={nodes} />
    </div>
  );
};

export default Nodelist;
