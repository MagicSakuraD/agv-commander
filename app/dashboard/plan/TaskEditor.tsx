"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import React, { useEffect, useState } from "react";
import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EditTwo, ViewList } from "@icon-park/react";
import { PlanningTaskFile } from "./columns";
import { GetPlanningTaskFile } from "@/lib/actions";
import { cn } from "@/lib/utils";
import parseAction from "@/lib/parseAction";
import { toast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  taskName: z.array(
    z.object({
      value: z.string(),
    })
  ),
});

const TaskEditor = (task_name: PlanningTaskFile) => {
  const [taskArray, setTaskArray] = useState<{ value: string }[]>([]);
  let filename = task_name.name.split("/").pop();
  type ProfileFormValues = z.infer<typeof profileFormSchema>;
  let transformedData: { value: string }[] = [];

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    taskName: transformedData,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "taskName", // 注意这里
    control: form.control,
  });

  useEffect(() => {
    // Call the function that updates Router's state here
    GetPlanningTaskFile(task_name).then((subtask_data) => {
      console.log(subtask_data);
      const newData = subtask_data.data.map((item: string) => ({
        value: item,
      }));
      // setTaskArray(transformedData);

      setTaskArray(transformedData);
      transformedData = newData;
      form.reset({ taskName: transformedData });
    });
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const resultList = values.taskName.map((item) => item.value).join("\n");
    console.log(resultList);
    const filenameWithoutExtension = filename!.replace(".txt", "");
    console.log(filenameWithoutExtension, "filename🚒");
    let bodyContent = {
      content: resultList,
      name: filenameWithoutExtension,
    };
    fetch("http://192.168.2.200:8888/api/planning/OverridePlanningTaskFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
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

        if (data.code === 0) {
          // 如果 'code' 的值为 0，那么打印 'data' 的值
          console.log(data.data);
          toast({
            title: "消息📢:",
            description: "✅: " + data.msg,
          });
        } else if (data.code === -1) {
          // 如果 'code' 的值为 -1，那么打印一个错误消息
          console.log(data.msg);
          toast({
            title: "消息📢:",
            description: "❌: " + data.msg,
          });
        }
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {/* <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm hover:text-green-600"> */}
          <EditTwo theme="two-tone" size="16" fill={["#333", "#22c55e"]} />
          查看&修改
          {/* </span> */}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-1 items-center justify-center">
            <ViewList theme="two-tone" size="20" fill={["#333", "#16a34a"]} />
            {filename}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`taskName.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      动作列表
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      添加，删除或编辑动作
                    </FormDescription>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <Button
                          variant={"destructive"}
                          onClick={() => remove(index)}
                        >
                          删除
                        </Button>
                      </div>

                      <FormDescription className="text-green-600">
                        {parseAction(field.value)}
                      </FormDescription>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ value: "" })}
            >
              添加动作
            </Button>

            <DialogFooter className="w-full">
              <DialogClose asChild>
                <Button type="submit" className="w-full">
                  提交
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditor;
