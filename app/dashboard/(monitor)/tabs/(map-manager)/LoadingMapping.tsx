import React, { useEffect, useRef, useState } from "react";
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
import { type } from "os";

interface LoadingMappingProps {
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>;
}

const LoadingMapping: React.FC<LoadingMappingProps> = ({ setDialogStatus }) => {
  const fetcher = (url: string, init?: RequestInit) =>
    fetch(url, {
      ...init,
      method: "GET",
      headers: {
        ...init?.headers,
        Accept: "application/json",
      },
    }).then((res) => res.json());

  const [loadingData, setLoadingData] = useState<number>(0);
  const [resData, setResData] = useState<any>(null);

  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const startFetching = () => {
    intervalId.current = setInterval(() => {
      fetch("http://192.168.2.112:8888/api/work/GetMappingTaskProcess", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // 处理数据

          setResData(data.data);

          if (data.data === "建图流程执行完成!") {
            console.log("建图成功1✅");
            setDialogStatus(3);
          }
          const match = data.data.match(/running (\d+\.\d+)%/);
          if (match) {
            const percentage = Math.floor(parseFloat(match[1]));
            console.log(percentage); // 输出：52
            setLoadingData(percentage);
          }
        })
        .catch((error) => {
          // 处理错误
          console.error(error);
        });
    }, 1000); // 每隔 1000 毫秒（1 秒）发送一次请求
  };

  const stopFetching = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };
  useEffect(() => {
    startFetching();
    return () => {
      stopFetching();
    };
  }, []);

  return (
    <div>
      <AlertDialogHeader>
        <AlertDialogTitle>建图进度</AlertDialogTitle>
        <AlertDialogDescription>建图中...</AlertDialogDescription>
        <Progress value={loadingData} className="my-2" />
        <p className="text-sm text-muted-foreground">{resData}</p>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-2">
        <MappingCancel setDialogStatus={setDialogStatus} />
      </AlertDialogFooter>
    </div>
  );
};

export default LoadingMapping;
