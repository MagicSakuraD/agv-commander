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
  // useEffect(() => {
  //   let timer: NodeJS.Timeout | undefined;
  //   const fetchData = async () => {
  //     // 发送 GET 请求
  //     fetch("http://192.168.2.112:8888/api/info/GetAllLocalizationBagsName", {
  //       method: "GET",
  //       next: { tags: ["Loc"] },
  //     })
  //       .then((response) => {
  //         // 检查响应的状态码
  //         if (!response.ok) {
  //           throw new Error("HTTP 状态" + response.status);
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         // 处理响应数据
  //         let map_data = data.data.bags;
  //         for (const name of map_data) {
  //           loc_list.push({
  //             name: name,
  //           });
  //         }
  //         console.log(loc_list);
  //         setLocs(loc_list);
  //       })
  //       .catch((error) => {
  //         // 处理错误
  //         console.error("Error:", error);
  //       });

  //   };

  //   if (isRecord > 0 && isRecord % 2 === 0) {
  //     timer = setTimeout(fetchData, 3000);
  //   } else {
  //     fetchData();
  //   }

  //   // 清除定时器
  //   return () => {
  //     if (timer) {
  //       clearTimeout(timer);
  //     }
  //   };
  //   fetchData();
  // }, [isRecord]);
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
