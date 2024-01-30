"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import React from "react";
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

const FormSchema = z.object({
  Posename: z.string().min(2, {
    message: "站点名必须至少包含2个字符。",
  }),
});

const InputName = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Posename: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full justify-between items-center space-y-8 gap-3"
      >
        <FormField
          control={form.control}
          name="Posename"
          render={({ field }) => (
            <FormItem className="w-5/6">
              <FormLabel>站点名</FormLabel>
              <FormControl>
                <Input placeholder="请输入站点名" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
};

const AddInitPose = () => {
  const data = [
    {
      name: "test",
      x: 1,
      y: 2,
      roll: 3,
      pitch: 4,
      yaw: 5,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>激光定位初始化点</CardTitle>
        <CardDescription>按照AGV当前位姿设置初始化点</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
      <CardFooter>
        <InputName />
      </CardFooter>
    </Card>
  );
};

export default AddInitPose;
