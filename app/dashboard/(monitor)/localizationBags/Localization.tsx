"use client";
import React, { use, useEffect, useState } from "react";
import { Loc_AGV, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { GetAllLocalizationBagsName } from "@/lib/actions";
import { set } from "react-hook-form";
import useSWR from "swr";

interface LocalizationProps {
  isRecord: number;
}

const Localization: React.FC<LocalizationProps> = ({ isRecord }) => {
  const [locs, setLocs] = useState<Loc_AGV[]>([]); // [
  let loc_list: Loc_AGV[] = [];

  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());
  // 定义一个常量，用于存储 API 的 URL

  // 使用 useSWR，传入一个 URL，一个获取数据的函数，和一些选项
  // 把 shouldFetch 加入到依赖项中
  const { data, error, isLoading } = useSWR(
    "http://192.168.2.112:8888/api/info/GetAllLocalizationBagsName",
    fetcher,
    {
      refreshInterval: 1000, // 每隔 3000 毫秒重新获取一次数据
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );

  useEffect(() => {
    let map_data;
    if (data && data.data) {
      map_data = data.data.bags;
      for (const name of map_data) {
        loc_list.push({
          name: name,
        });
      }
      console.log(loc_list);
      setLocs(loc_list);
    }
  }, [data]);

  return (
    <div>
      <DataTable columns={columns} data={locs} />
    </div>
  );
};

export default Localization;
