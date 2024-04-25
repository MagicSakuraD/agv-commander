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
import React from "react";
import { kivaProp } from "../columns";
import { useAtom } from "jotai";
import { parsedDataAtom } from "@/lib/atoms";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditTwo } from "@icon-park/react";

const formSchema = z.object({
  x: z
    .string()
    .min(1, {
      message: "不能为空",
    })
    .max(10),
  y: z
    .string()
    .min(1, {
      message: "不能为空",
    })
    .max(10),
  angle: z
    .string()
    .min(1, {
      message: "不能为空",
    })
    .max(10),
  speed: z
    .string()
    .min(1, {
      message: "不能为空",
    })
    .max(10),
});

const KivaEditor = (kivaData: kivaProp) => {
  const [kivafile, setKivafile] = useAtom(parsedDataAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      x: kivaData.x,
      y: kivaData.y,
      angle: kivaData.angle,
      speed: kivaData.speed,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //将values转换为字符串
    //获取kivaData的name的值
    const index = Number(kivaData.name) - 1;
    const dataString = `${values.x} ${values.y} ${values.angle} ${values.speed}`;
    //将kivafile数组中的第index个元素替换为dataString,用map来实现
    const newKivafile = kivafile.map((item, i) => {
      if (i === index) {
        return dataString;
      } else {
        return item;
      }
    });
    setKivafile(newKivafile);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <EditTwo theme="two-tone" size="16" fill={["#333", "#22c55e"]} />
            修改
          </DropdownMenuItem>
        </DialogTrigger>

        <DialogContent className="sm:max-w-96">
          <DialogHeader>
            <DialogTitle>{kivaData.name}号点</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>x坐标</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
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
                        placeholder=""
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
                name="angle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角度</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
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
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>速度</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KivaEditor;
