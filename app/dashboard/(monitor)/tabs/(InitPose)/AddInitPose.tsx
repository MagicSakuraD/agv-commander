"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import React, { use, useEffect, useState } from "react";
import { Pose, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSWR from "swr";
import { carShowAtom, markerlistAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { WholeSiteAccelerator } from "@icon-park/react";

const FormSchema = z.object({
  Posename: z.string().min(2, {
    message: "站点名必须至少包含2个字符。",
  }),
});

interface InputNameProps {
  AGV_point_real: [number, number] | null;
  angle: any;
}

const InputName: React.FC<InputNameProps> = ({ AGV_point_real, angle }) => {
  const [Pose, setPose] = useState([]); // [
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Posename: "",
    },
  });
  // console.log(angle, "angle😡");
  function onSubmit(data: z.infer<typeof FormSchema>) {
    // 创建请求体对象
    let bodyContent = {
      name: data.Posename,
      pitch: "0",
      roll: "0",
      x: AGV_point_real![1].toString(),
      y: AGV_point_real![0].toString(),
      yaw: angle,
      z: "0",
    };
    fetch("http://192.168.2.200:8888/api/config/addInitPose", {
      method: "POST",
      body: JSON.stringify(bodyContent),
      headers: {
        "Content-Type": "application/json",
      },
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
        let Pose_data = data.data;
        setPose(Pose_data);
        toast({
          title: "消息📢:",
          description: "添加成功✔️",
        });
        console.log(Pose_data);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });

    // return res.json();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between items-center gap-3"
      >
        <FormField
          control={form.control}
          name="Posename"
          render={({ field }) => (
            <FormItem className="w-5/6">
              {/* <FormLabel>站点名</FormLabel> */}
              <FormControl>
                <Input placeholder="请输入站点名" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
};

interface AddInitPoseProps {
  AGV_point_real: [number, number] | null;
  angle: any;
}

const AddInitPose: React.FC<AddInitPoseProps> = ({ AGV_point_real, angle }) => {
  const [res_pose, setRes_pose] = useState([]);
  const [markerlist, setMarkerlist] = useAtom(markerlistAtom);
  const [carShow, setCarShow] = useAtom(carShowAtom);
  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());
  // 定义一个常量，用于存储 API 的 URL

  // 使用 useSWR，传入一个 URL，一个获取数据的函数，和一些选项
  // 把 shouldFetch 加入到依赖项中
  const { data, error, isLoading } = useSWR(
    "http://192.168.2.200:8888/api/info/GetInitPoseFileContent",
    fetcher,
    {
      refreshInterval: 1000, // 每隔 3000 毫秒重新获取一次数据
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );

  useEffect(() => {
    let res_data = data?.data;
    if (res_data && data.code === 0) {
      const ros_Pose = res_data
        .filter((item: string) => item.startsWith("  pose"))
        .map((item: string) => {
          const [pose, values] = item.split(": ");
          const id = Number(pose.substring(6));
          const [coords, name_test] = values.split("#");

          const name = name_test || "起始点";
          const [x, y, z, roll, pitch, yaw] = coords
            .replace("[", "")
            .replace("]", "")
            .split(",")
            .map((value) => (isNaN(Number(value)) ? value : Number(value)));
          return { id, name, x, y, z, roll, pitch, yaw };
        });
      setRes_pose(ros_Pose);
      const markerlist_res = ros_Pose.map(
        (pose: { id: number; x: number; y: number; yaw: number }) => ({
          id: pose.id,
          x: pose.y,
          y: pose.x,
          yaw: pose.yaw,
        })
      );

      setMarkerlist(markerlist_res);
      console.log(markerlist, "👻");
      setCarShow(false);
    }
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <WholeSiteAccelerator
            theme="two-tone"
            size="20"
            fill={["#333", "#22c55e"]}
          />
          激光定位初始化点
        </CardTitle>
        <CardDescription>按照AGV当前位姿设置初始化点</CardDescription>
        <div className="mt-5">
          <InputName AGV_point_real={AGV_point_real} angle={angle} />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={res_pose} />
      </CardContent>
    </Card>
  );
};

export default AddInitPose;
