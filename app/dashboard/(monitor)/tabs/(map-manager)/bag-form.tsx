"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
import { DialogFooter } from "@/components/ui/dialog";
import next from "next";
import useSWR from "swr";
import { time } from "console";
import { toast } from "@/components/ui/use-toast";
import { startAtom } from "@/lib/atoms";
import { useAtom } from "jotai";

const formSchema = z.object({
  bag_name: z
    .string()
    .min(1, { message: "名称至少需要1个字符" })
    .max(50, { message: "名称最多可以有50个字符" }),
});

interface Bag_formProps {
  status: number; // 或者你的状态的类型
  setStatus: React.Dispatch<React.SetStateAction<number>>;

  setFormValues: React.Dispatch<React.SetStateAction<string>>;
}

const Bag_form: React.FC<Bag_formProps> = ({
  status,
  setStatus,
  setFormValues,
}) => {
  const [start, setStart] = useAtom(startAtom);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bag_name: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    // 发送 fetch 请求
    fetch("http://192.168.2.112:8888/api/config/StartRecordMappingData", {
      method: "POST", // 或 'GET'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cmd: "start", name: values.bag_name }), // 将表单值转换为 JSON
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
        setStart(data.code);
        toast({
          title: "消息📢:",
          description: data.data,
        });
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });

    setFormValues(values.bag_name);
    console.log(values.bag_name);
    setStatus(1);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="bag_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>数据包名</FormLabel>
              <FormControl>
                <Input placeholder="请输入数据包名" {...field} />
              </FormControl>
              {/* <FormDescription>请输入数据包名</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" className="mx-auto">
            开始录制
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default Bag_form;
