import React, { use, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns_task, PlanningTaskFile } from "./columns";
import useSWR from "swr";

const fetcher = (...args: [string, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

const PlanningTaskFiles = () => {
  // const [tasks_list, setTasks_list] = useState<PlanningTaskFile[]>([]); // [
  const { data, error } = useSWR(
    "http://192.168.2.112:8888/api/planning/GetPlanningTaskFiles",
    fetcher,
    {
      refreshInterval: 1500, // 每隔 3000 毫秒重新获取一次数据
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );
  let dataList: PlanningTaskFile[] = [];

  if (data) {
    let dataEntries = Object.entries(data.data);
    dataList = dataEntries.map(([key, value]) => ({
      name: value as string,
    }));
  }

  if (error) return <div>请求失败</div>;
  if (!data) return <div>加载中...</div>;

  return (
    <div>
      <DataTable columns={columns_task} data={dataList} />
    </div>
  );
};

export default PlanningTaskFiles;
