"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  File: z.string({
    required_error: "请选择一个配置文件",
  }),
});

const MappingPage = () => {
  interface File {
    label: string;
    value: string;
  }
  const [Files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    // 发送 GET 请求
    fetch("http://192.168.2.112:8888/api/info/GetAllConfigsFileName", {
      method: "GET",
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
        const Files = Object.keys(data.data).map((key) => ({
          label: key,
          value: data.data[key],
        }));
        setFiles(Files);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "消息📢:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(data.File, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <div className="container mx-auto pt-5 flex flex-wrap gap-5 justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>参数配置</CardTitle>
          <CardDescription>修改相关配置文件参数</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="File"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>配置文件</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? Files.find((File) => File.value === field.value)
                                  ?.label
                              : "选择配置文件"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="搜索文件..."
                            className="h-9"
                          />
                          <CommandEmpty>找不到相关文件😞</CommandEmpty>
                          <CommandGroup>
                            {Files.map((File) => (
                              <CommandItem
                                value={File.label}
                                key={File.value}
                                onSelect={() => {
                                  form.setValue("File", File.value);
                                }}
                              >
                                {File.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    File.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      选择一个配置文件，修改相关参数
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">提交</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MappingPage;
