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
  DialogClose,
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
import { EditTwo } from "@icon-park/react";

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  x: z.string(),
  y: z.string(),
  z: z.string(),
  roll: z.string(),
  pitch: z.string(),
  yaw: z.string(),
});

interface ProfileFormProps {
  pose_id: string;
  pose_name: string;
  pose_x: string;
  pose_y: string;
  pose_z: string;
  pose_roll: string;
  pose_pitch: string;
  pose_yaw: string;
}

export function ProfileForm({
  pose_id,
  pose_name,
  pose_x,
  pose_y,
  pose_z,
  pose_roll,
  pose_pitch,
  pose_yaw,
}: ProfileFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: pose_id.toString(),
      name: pose_name.toString(),
      x: pose_x.toString(),
      y: pose_y.toString(),
      z: pose_z.toString(),
      roll: pose_roll.toString(),
      pitch: pose_pitch.toString(),
      yaw: pose_yaw.toString(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await changeInitPose(values);
    console.log(values, "values✌️");
    if (result) {
      toast({
        title: "消息📢:",
        description: "修改成功✔️",
      });
    } else {
      // handle the case where result is not a string
      console.log("修改失败");
    }
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 overflow-y-auto max-h-screen"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>序号</FormLabel>
              <FormControl>
                <Input placeholder="请输入序号" {...field} disabled />
              </FormControl>
              <FormDescription>固定值,不可修改,用于标识点位</FormDescription>
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
              <FormLabel>x坐标</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入x坐标"
                  {...field}
                  type="number"
                  step="any"
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
              <FormLabel>y坐标</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入x坐标"
                  {...field}
                  type="number"
                  step="any"
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
              <FormLabel>z坐标</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入z坐标"
                  {...field}
                  type="number"
                  step="any"
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
              <FormLabel>roll翻滚角度</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入roll"
                  {...field}
                  type="number"
                  step="any"
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
              <FormLabel>pitch俯仰角度</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入pitch"
                  {...field}
                  type="number"
                  step="any"
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
              <FormLabel>yaw偏航角度</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入yaw"
                  {...field}
                  type="number"
                  step="any"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogClose asChild>
          <Button type="submit">提交</Button>
        </DialogClose>
      </form>
    </Form>
  );
}

const ChangeInitPoseBtn = (Pose_data: Pose) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {/* <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm hover:text-green-600"> */}
            <EditTwo theme="two-tone" size="16" fill={["#333", "#22c55e"]} />
            修改
            {/* </span> */}
          </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent className="sm:max-w-80">
          <DialogHeader>
            <DialogTitle>修改初始化点位</DialogTitle>
          </DialogHeader>
          <ProfileForm
            pose_id={Pose_data.id}
            pose_name={Pose_data.name}
            pose_x={Pose_data.x}
            pose_y={Pose_data.y}
            pose_z={Pose_data.z}
            pose_roll={Pose_data.roll}
            pose_pitch={Pose_data.pitch}
            pose_yaw={Pose_data.yaw}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeInitPoseBtn;
