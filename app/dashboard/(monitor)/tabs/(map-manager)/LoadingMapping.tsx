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
import { Progress } from "@/components/ui/progress";
import { toast, useToast } from "@/components/ui/use-toast";

interface LoadingMappingProps {
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>;
}

const LoadingMapping: React.FC<LoadingMappingProps> = ({ setDialogStatus }) => {
  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());
  const [loadingData, setLoadingData] = useState<number>(0);
  const { data, error, isLoading } = useSWR(
    "http://192.168.2.112:8888/api/work/GetMappingTaskProcess",
    fetcher,
    {
      refreshInterval: 2000, // 每隔 3000 毫秒重新获取一次数据
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );

  if (data?.data) {
    if (data.data === "建图成功") {
      setDialogStatus(3);
    }
    const match = data.data.match(/running (\d+\.\d+)%/);
    if (match) {
      const percentage = Math.floor(parseFloat(match[1]));
      console.log(percentage); // 输出：52
      setLoadingData(percentage);
    }
  }

  if (error) {
    toast({
      title: "请求失败",
      description: "请检查网络连接",
    });
  }

  return (
    <div>
      <AlertDialogHeader>
        <AlertDialogTitle>建图中</AlertDialogTitle>
        <AlertDialogDescription>
          实时建图进度
          {data?.data}
        </AlertDialogDescription>
        <Progress value={loadingData} className="my-2" />
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-2">
        <MappingCancel setDialogStatus={setDialogStatus} />
      </AlertDialogFooter>
    </div>
  );
};

export default LoadingMapping;
