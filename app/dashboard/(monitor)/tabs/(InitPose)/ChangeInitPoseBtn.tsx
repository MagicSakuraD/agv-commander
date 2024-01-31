"use client";

import { z } from "zod";

import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Pose } from "./columns";
import { changeInitPose } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  id: z.number().min(0, { message: "序号不能为空" }),
  name: z.string().min(2, {
    message: "站点名必须至少包含2个字符",
  }),
  x: z.number().min(0, {
    message: "x不能为空",
  }),
  y: z.number().min(0, {
    message: "y不能为空",
  }),
  z: z.number().min(0, { message: "z不能为空" }),
  roll: z.number().min(0, { message: "roll不能为空" }),
  pitch: z.number().min(0, { message: "pitch不能为空" }),
  yaw: z.number().min(0, { message: "yaw不能为空" }),
});

interface ProfileFormProps {
  pose_id: number;
}

export function ProfileForm({ pose_id }: ProfileFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 1,
      name: "test",
      x: 0,
      y: 0,
      z: 0,
      roll: 0,
      pitch: 0,
      yaw: 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const result = await changeInitPose(values);
    if (result) {
      toast({
        description: result,
      });
    } else {
      // handle the case where result is not a string
      console.log("修改失败");
    }
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>序号</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入序号"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                当前站点序号为{pose_id}，也可修改其他序号的站点信息
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>站点名</FormLabel>
              <FormControl>
                <Input placeholder="请输入站点名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="x"
          render={({ field }) => (
            <FormItem>
              <FormLabel>x</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入x坐标"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="y"
          render={({ field }) => (
            <FormItem>
              <FormLabel>y</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入x坐标"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="z"
          render={({ field }) => (
            <FormItem>
              <FormLabel>z</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入z坐标"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roll"
          render={({ field }) => (
            <FormItem>
              <FormLabel>roll</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入roll"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pitch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>pitch</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入pitch"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yaw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>yaw</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入yaw"
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
}

const ChangeInitPoseBtn = (Pose_data: Pose) => {
  return (
    <>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-none w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pen"
            viewBox="0 0 16 16"
          >
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
          </svg>
          修改
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>修改初始化点位</DialogTitle>
        </DialogHeader>
        <ProfileForm pose_id={Pose_data.id} />
      </DialogContent>
    </>
  );
};

export default ChangeInitPoseBtn;
