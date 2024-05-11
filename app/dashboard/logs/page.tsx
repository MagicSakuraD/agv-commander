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
import { use, useEffect, useState } from "react";

import { ClearLogFileContents, GetLogFileContents } from "@/lib/actions";

import { OneKey, TwoKey } from "@icon-park/react";

const FormSchema = z.object({
  logName: z.string().min(1).max(50),
});

const LogsPage = () => {
  const [Files, setFiles] = useState<string[]>([]);

  const [logData, setLogData] = useState("");

  const [logName, setLogName] = useState("");

  useEffect(() => {
    // 发送 GET 请求
    fetch("http://192.168.2.200:8888/api/info/GetAllLogFilesName", {
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
        console.log(data.data.logs, "😫");
        const Files = data.data.logs;
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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLogName(data.logName);
    const result = await GetLogFileContents(data.logName);
    setLogData(result);
  }

  async function handleClear() {
    try {
      await ClearLogFileContents(logName);
      const result = await GetLogFileContents(logName);
      setLogData(result);
    } catch (error) {
      console.error("清空日志内容时出错:", error);
    }
  }

  return (
    <div className="md:container px-2 mx-auto pt-5 flex flex-wrap gap-5 justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 items-center">
            <OneKey theme="two-tone" size="20" fill={["#333", "#22c55e"]} />
            选择日志文件
          </CardTitle>
          <CardDescription>可按照关键字搜素文件</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
              <FormField
                control={form.control}
                name="logName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>日志</FormLabel>
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
                              ? Files.find((file) => file === field.value)
                              : "选择日志"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="选择日志文件..."
                            className="h-9"
                          />
                          <CommandEmpty>找不到相关文件😞.</CommandEmpty>
                          <CommandGroup>
                            {Files.map((file) => (
                              <CommandItem
                                value={file}
                                key={file}
                                onSelect={() => {
                                  form.setValue("logName", file);
                                }}
                              >
                                {file}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    file === field.value
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

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">提交</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2 items-center">
              {" "}
              <TwoKey theme="two-tone" size="20" fill={["#333", "#22c55e"]} />
              查看日志详情
            </div>
            {logData && (
              <Button variant={"destructive"} onClick={handleClear}>
                清空
              </Button>
            )}
          </CardTitle>
          <CardDescription>日志文件内容</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold overflow-auto">
            {logData}
          </code>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
