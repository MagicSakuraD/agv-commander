"use client";
import React from "react";
import { kivaProp, columns_kiva } from "../columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gps } from "@icon-park/react";
import { useAtom, useAtomValue } from "jotai";
import { parsedDataAtom } from "@/lib/atoms";
import KivaAdd from "./KivaAdd";

import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  filename: z.string().min(2, {
    message: "filename must be at least 2 characters.",
  }),
});

export function BreadcrumbWithCustomSeparator() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xl">
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/dashboard">dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/dashboard/plan">plan</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-bold">kiva</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// 将fetchKivaData函数定义在useEffect外部
const fetchKivaData = (kivaData: string[]) => {
  // 解析kivaData数组，将每个字符串转换为kivaProp对象
  const parsedData: kivaProp[] = kivaData.map(
    (dataString: string, index: number) => {
      // 分割字符串，得到值数组
      const values = dataString.split(" ");
      // 创建kivaProp对象
      return {
        name: (index + 1).toString(),
        x: values[0],
        y: values[1],
        angle: values[2],
        speed: values[3],
      };
    }
  );
  return parsedData; // Add return statement to return parsed data
};

const CreateKiva = () => {
  const [kivafile, setKivafile] = useAtom(parsedDataAtom);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      filename: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    //将kivafie数组转换为字符串,每个元素之间用换行符
    const strKivafile = kivafile.join("\n");
    fetch("http://192.168.2.200:8888/api/planning/AddKivaPlanningTaskFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 可以添加其他头部信息
      },
      body: JSON.stringify({
        content: strKivafile,
        name: data.filename,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP 状态" + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.msg, "保存成功");
        toast({
          title: "保存成功✅",
        });

        setKivafile([]); // 清空kivafile数组
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    router.push("/dashboard/plan");
  }

  // 渲染数据
  return (
    <div className="mx-auto">
      <h3 className="scroll-m-20 font-semibold tracking-tight my-6">
        <BreadcrumbWithCustomSeparator />
      </h3>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
            <div className="flex flex-row gap-1 items-center">
              <Gps theme="two-tone" size="24" fill={["#333", "#22c55e"]} />
              <p>kiva模式</p>
            </div>
            <div>
              <KivaAdd />
            </div>
          </CardTitle>
          <CardDescription>设置路径点</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns_kiva} data={fetchKivaData(kivafile)} />
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-6"
              >
                <FormField
                  control={form.control}
                  name="filename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>文件名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入文件名" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="min-w-96">
                  保存设置
                </Button>
              </form>
            </Form>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateKiva;
