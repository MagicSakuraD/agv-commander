import React, { use, useEffect, useState } from "react";
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

interface DisplayCompletedMapProps {
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>;
}

const DisplayCompletedMap: React.FC<DisplayCompletedMapProps> = ({
  setDialogStatus,
}) => {
  const { toast } = useToast();
  const [bagname, setBagname] = useAtom(bagnameAtom);
  const [imgdata, setImgdata] = useState("");
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
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
    setDialogStatus(0);
    toast({
      title: "Scheduled: Catch up",
      description: "不保存，建图结束",
    });
  }

  function handleGiveUp() {
    setDialogStatus(0);
    toast({
      title: "Scheduled: Catch up",
      description: "保存成功，建图结束",
    });
  }

  return (
    <div>
      <AlertDialogHeader>
        <AlertDialogTitle>是否保存地图❓</AlertDialogTitle>
        <AlertDialogDescription>
          <img src={`data:image/png;base64,${imgdata}`} alt="地图图片" />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleGiveUp}>不保存</AlertDialogCancel>
        <AlertDialogAction onClick={handleSave}>保存</AlertDialogAction>
      </AlertDialogFooter>
    </div>
  );
};

export default DisplayCompletedMap;
