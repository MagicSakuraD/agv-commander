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
  function onSubmit(data: z.infer<typeof FormSchema>) {
    // 创建请求体对象
    let bodyContent = {
      name: data.Posename,
      pitch: "0",
      roll: "0",
      x: AGV_point_real![0].toString(),
      y: AGV_point_real![1].toString(),
      yaw: angle,
      z: "0",
    };
    fetch("http://192.168.2.112:8888/api/config/addInitPose", {
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
          title: "成功添加如下站点:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(Pose_data, null, 2)}
              </code>
            </pre>
          ),
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
  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());
  // 定义一个常量，用于存储 API 的 URL

  // 使用 useSWR，传入一个 URL，一个获取数据的函数，和一些选项
  // 把 shouldFetch 加入到依赖项中
  const { data, error, isLoading } = useSWR(
    "http://192.168.2.112:8888/api/info/GetInitPoseFileContent",
    fetcher,
    {
      refreshInterval: 1000, // 每隔 3000 毫秒重新获取一次数据
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );
  const data1 = [
    {
      name: "showcase",
      x: 0,
      y: 0,
      roll: 0,
      pitch: 0,
      yaw: 0,
    },
  ];

  useEffect(() => {
    let res_data = data?.data;
    if (res_data) {
      const ros_Pose = res_data
        .filter((item: string) => item.startsWith("  pose"))
        .map((item: string) => {
          const [pose, values] = item.split(": ");
          const [coords, name_test] = values.split("#");
          const name = name_test || "起始点";
          const [x, y, roll, pitch, yaw] = coords
            .replace("[", "")
            .replace("]", "")
            .split(",")
            .map((value) => (isNaN(Number(value)) ? value : Number(value)));
          return { name, x, y, roll, pitch, yaw };
        });
      setRes_pose(ros_Pose);
      console.log(ros_Pose);
    }
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>激光定位初始化点</CardTitle>
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
