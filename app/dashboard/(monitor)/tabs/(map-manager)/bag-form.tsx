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
import { cn } from "@/lib/utils";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    // 发送 fetch 请求
    fetch("http://192.168.2.200:8888/api/config/StartRecordMappingData", {
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
        // setStart(data.code);
        if (data.code === 0) {
          setStatus(1);
          toast({
            title: "消息📢:",
            description: data.data,
          });
          setIsSubmitting(false);
        } else {
          toast({
            title: "错误❌:",
            description: data.data,
          });
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });

    setFormValues(values.bag_name);
    console.log(values.bag_name);
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn("w-auto", isSubmitting && "text-muted-foreground")}
          >
            {isSubmitting && (
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 text-gray-200 animate-spin  fill-green-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            {isSubmitting ? "正在提交" : "开始记录"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default Bag_form;
