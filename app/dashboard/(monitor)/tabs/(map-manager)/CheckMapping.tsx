import { DialogHeader } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface CheckMappingProps {
  setCheck: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckMapping: React.FC<CheckMappingProps> = ({
  setCheck,
  setSuccess,
}) => {
  const API_URL = "http://192.168.2.112:8888/api/info/CheckIsMappingRecord";
  const [shouldFetch, setShouldFetch] = useState(true);
  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());
  // 定义一个常量，用于存储 API 的 URL

  // 使用 useSWR，传入一个 URL，一个获取数据的函数，和一些选项
  // 把 shouldFetch 加入到依赖项中
  const { data, error, isLoading } = useSWR(
    shouldFetch ? API_URL : null,
    fetcher,
    {
      refreshInterval: 3000, // 每隔 3000 毫秒重新获取一次数据
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );

  useEffect(() => {
    // 定义一个变量，用于存储 setTimeout 的返回值
    let timerId: NodeJS.Timeout;
    // 如果 shouldFetch 为 true，设置一个 30 秒后停止发送请求的定时器
    if (shouldFetch) {
      timerId = setTimeout(() => {
        setShouldFetch(false); // 30 秒后停止发送请求
        console.log("结束请求");
        setCheck(false);
      }, 30000);
    }
    // 返回一个清理函数，用于清除定时器
    return () => {
      clearTimeout(timerId); // 组件卸载时或者 shouldFetch 变化时，清除定时器
      console.log(shouldFetch);
    };
  }, [shouldFetch]); // 依赖于 shouldFetch

  useEffect(() => {
    if (data && data.data === true) {
      console.log("录制完成✅");
      setShouldFetch(false); // 如果返回值为 true，停止发送请求
      setCheck(false);
      setSuccess(false);
    }
  }, [data]);

  // if (error) return <div>failed to load</div>;
  // if (isLoading) return <div>loading...</div>;
  return (
    <div>
      <DialogHeader>
        <div className="text-lg text-muted-foreground flex gap-2 items-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          <p>等待ROS节点响应中</p>
        </div>
      </DialogHeader>
    </div>
  );
};

export default CheckMapping;
