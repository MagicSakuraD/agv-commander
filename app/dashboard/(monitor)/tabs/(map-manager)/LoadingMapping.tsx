import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import useSWR from "swr";
import MappingCancel from "./MappingCancel";
import { set } from "react-hook-form";
interface LoadingMappingProps {
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>;
}

const LoadingMapping: React.FC<LoadingMappingProps> = ({ setDialogStatus }) => {
  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://192.168.2.112:8888/api/work/GetMappingTaskProcess",
    fetcher,
    {
      refreshInterval: 1000, // 每隔 3000 毫秒重新获取一次数据
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );

  useEffect(() => {
    if (data && data.data.includes("运行状态成功")) {
      console.log(data.data);
      console.log("建图完成✅");
      setDialogStatus(3);
    }
  }, [data]);
  //   console.log(data_loading, "建图进度");

  return (
    <div>
      <AlertDialogHeader>
        <AlertDialogTitle>建图中</AlertDialogTitle>
        <AlertDialogDescription>
          实时建图进度
          {data?.data}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <MappingCancel setDialogStatus={setDialogStatus} />
      </AlertDialogFooter>
    </div>
  );
};

export default LoadingMapping;
