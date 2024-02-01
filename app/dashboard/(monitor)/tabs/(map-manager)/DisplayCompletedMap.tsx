import React, { use, useEffect, useRef, useState } from "react";
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
import { useAtom } from "jotai";
import { bagnameAtom } from "../../atoms";
import { set } from "react-hook-form";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface DisplayCompletedMapProps {
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>;
}

const DisplayCompletedMap: React.FC<DisplayCompletedMapProps> = ({
  setDialogStatus,
}) => {
  const { toast } = useToast();
  const [bagname, setBagname] = useAtom(bagnameAtom);
  const [imgdata, setImgdata] = useState("");
  const screenRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    fetch("http://192.168.2.112:8888/api/work/GetMappingTaskCacheImage", {
      method: "GET", // 或 'GET'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // 检查响应是否成功
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // 解析响应主体
        return response.json();
      })
      .then((data) => {
        // 处理解析后的数据
        console.log(data.data, "地图图片");
        setImgdata(data.data);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }, []);

  function handleSave() {
    fetch("http://192.168.2.112:8888//api/work/SaveMappingTaskCacheImage", {
      method: "POST", // 或 'GET'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ map_name: bagname }), // 将表单值转换为 JSON
    })
      .then((response) => {
        // 检查响应是否成功
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // 解析响应主体
        return response.json();
      })
      .then((data) => {
        // 处理解析后的数据
        console.log(data);
        toast({
          title: "消息📢:",
          description: `建图结束：${data.data}`,
        });
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
    setDialogStatus(0);
  }

  function handleGiveUp() {
    setDialogStatus(0);
    toast({
      title: "消息📢:",
      description: "不保存，建图结束",
    });
  }

  function FullscreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        screenRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    return (
      <button
        onClick={handleFullscreen}
        className="btn border-none bg-transparent w-fit m-1 rounded-xl hover:bg-transparent absolute bottom-0 right-0"
      >
        {isFullscreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-fullscreen-exit"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-fullscreen"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div>
      <AlertDialogHeader>
        <AlertDialogTitle>是否保存地图❓</AlertDialogTitle>
      </AlertDialogHeader>
      <div ref={screenRef} className="relative flex h-96">
        <Image
          src={`data:image/png;base64,${imgdata}`}
          alt="地图图片"
          fill={true}
        />
        <FullscreenButton />
      </div>
      <AlertDialogFooter className="mt-4">
        <AlertDialogCancel onClick={handleGiveUp}>不保存</AlertDialogCancel>
        <AlertDialogAction onClick={handleSave}>保存</AlertDialogAction>
      </AlertDialogFooter>
    </div>
  );
};

export default DisplayCompletedMap;
