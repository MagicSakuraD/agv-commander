import React, { useEffect } from "react";
import { Map_AGV, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const Map_Manager = () => {
  const [maps, setMaps] = React.useState<Map_AGV[]>([]); // [
  let map_list: Map_AGV[] = [];
  useEffect(() => {
    // 发送 GET 请求
    fetch("http://192.168.2.112:8888/api/info/GetAllMapsName", {
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
        let map_data = data.data.maps;
        for (const name of map_data) {
          map_list.push({
            name: name,
          });
        }
        console.log(map_list);
        setMaps(map_list);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }, []);
  return (
    <div>
      <DataTable columns={columns} data={maps} />
    </div>
  );
};

export default Map_Manager;
