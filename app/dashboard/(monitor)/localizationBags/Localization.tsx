import React, { useEffect } from "react";
import { Loc_AGV, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface LocalizationProps {
  isRecord: number;
}

const Localization: React.FC<LocalizationProps> = ({ isRecord }) => {
  console.log(isRecord, "🏎️");
  const [locs, setLocs] = React.useState<Loc_AGV[]>([]); // [
  let loc_list: Loc_AGV[] = [];
  useEffect(() => {
    // 发送 GET 请求
    fetch("http://192.168.2.112:8888/api/info/GetAllLocalizationBagsName", {
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
        let map_data = data.data.bags;
        for (const name of map_data) {
          loc_list.push({
            name: name,
          });
        }
        console.log(loc_list);
        setLocs(loc_list);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }, [isRecord]);
  return (
    <div>
      <DataTable columns={columns} data={locs} />
    </div>
  );
};

export default Localization;
