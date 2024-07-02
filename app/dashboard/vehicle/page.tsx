"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GameThree, PauseOne, Play, RobotOne } from "@icon-park/react";
import { Separator } from "@/components/ui/separator";
import { use, useEffect, useState } from "react";
import {
  SetControlNodeState,
  SetPlanningNodeState,
  SetPlanningTaskFile,
} from "@/lib/actions";
import { useTask, useKivaTask } from "@/lib/swr";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { on } from "events";

const FormSchema = z.object({
  task: z.string({
    required_error: "Please select an task to display.",
  }),
});

export default function VehiclePage() {
  const [task, setTask] = useState("暂无");
  const [pause, setPause] = useState(true);
  // 使用 useState 钩子来跟踪开关状态
  const [isKivaMode, setIsKivaMode] = useState(false);

  // 使用 useEffect 钩子来处理开关状态变化
  useEffect(() => {
    // 根据 isKivaMode 的值发送不同的请求
    const mode = isKivaMode ? "kiva" : "free";
    const url = "http://192.168.2.200:8888/api/planning/SetPlanningMode";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 可以添加其他头部信息
      },
      body: JSON.stringify({
        content: mode,
        name: "setPlanningMode",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP 状态" + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.msg, `切换${mode}模式成功`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [isKivaMode]); // 依赖数组中包含 isKivaMode，以便在其变化时触发

  const handleRadioChange = async (value: string) => {
    let cmd = value === "Manual" ? "0" : "1";
    const data = SetControlNodeState(cmd);
    console.log(data);
  };

  const { data, isLoading, isError } = useTask();
  const {
    data: kivaData,
    isLoading: kivaIsLoading,
    isError: kivaIsError,
  } = useKivaTask();

  const dataEntries = data?.data ? Object.entries(data.data) : [];
  const kivaDataEntries = kivaData?.data ? Object.entries(kivaData.data) : [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("设置任务", data.task);

    const task_data = SetPlanningTaskFile(data.task);
    let cmd = "1";
    const start_data = SetPlanningNodeState(cmd);
    console.log(start_data, "开始运行");
    console.log(task_data, "task_data");
    let filename = data.task.split("/").pop();
    if (filename) {
      console.log("设置任务", filename);
      setTask(filename);
    } else {
      console.log("设置任务失败");
    }
  }

  function onSubmitkiva(data: z.infer<typeof FormSchema>) {
    const real_task = data.task.replace(/\.txt$/, "");
    console.log("任务文件名", real_task);
    const kiva_data = SetPlanningTaskFile(real_task);
    console.log(kiva_data, "设置kiva文件返回值");
    let cmd = "2";
    const kiva_state = SetControlNodeState(cmd);
    console.log(kiva_state, "设置kiva状态,开始运行");
  }

  function hadnlePause() {
    setPause(!pause);
    console.log(pause, "pause");
    let cmd = pause ? "3" : "4";
    const State_data = SetPlanningNodeState(cmd);
    console.log(State_data, "State_data");
  }
  // 处理开关点击事件
  const handleSwitchChange = () => {
    setIsKivaMode(!isKivaMode); // 切换开关状态
    console.log(data, "切换成功🤯");
  };

  function handleClick() {
    let cmd = "1";
    const start_data = SetPlanningNodeState(cmd);
    console.log(start_data, "开始运行");
  }

  return (
    <div className="md:container px-2 mx-auto pt-5 h-[50rem]">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>控制模式</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="kiva-mode"
              checked={isKivaMode}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="kiva-mode" className="font-bold">
              kiva模式
            </Label>
          </div>
        </CardHeader>

        <CardContent className="grid gap-16">
          {!isKivaMode ? (
            <div className="flex flex-col space-y-10">
              <RadioGroup
                defaultValue="card"
                className="grid grid-cols-2 gap-4"
                onValueChange={handleRadioChange}
              >
                <div>
                  <RadioGroupItem
                    value="Manual"
                    id="Manual"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="Manual"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <GameThree
                      className="mb-3"
                      theme="two-tone"
                      size="40"
                      fill={["#333", "#22c55e"]}
                    />
                    手动模式
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="Automatic"
                    id="Automatic"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="Automatic"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <RobotOne
                      className="mb-3"
                      theme="two-tone"
                      size="40"
                      fill={["#333", "#22c55e"]}
                    />
                    自动模式
                  </Label>
                </div>
              </RadioGroup>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-16"
                >
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>选择任务文件</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dataEntries.map(([key, value]) => (
                              <SelectItem value={value as string} key={key}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center">
                    <Button
                      className="md:w-96 w-full rounded-full"
                      type="submit"
                    >
                      执行任务
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <div className="text-center">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitkiva)}
                  className="w-full space-y-16"
                >
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>选择任务文件</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {kivaDataEntries.map(([key, value]) => (
                              <SelectItem value={key as string} key={key}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center">
                    <Button
                      className="md:w-96 w-full rounded-full"
                      type="submit"
                    >
                      执行任务
                    </Button>
                  </div>
                </form>
              </Form>
              {/* <Button
                className="md:w-96 w-full rounded-full"
                onClick={handleClick}
              >
                开始运行
              </Button> */}
            </div>
          )}
        </CardContent>
        <CardFooter className="mt-8 flex flex-col gap-5">
          <Separator />
          <div className="flex flex-row gap-1 w-full justify-center rounded-full h-12 items-center border-2 shadow-md">
            {!isKivaMode ? (
              <span>
                <b className="text-muted-foreground">正在运行的任务: </b>
                <b>{task}</b>
              </span>
            ) : (
              <span className="font-medium">暂停/继续</span>
            )}

            <Button
              variant="ghost"
              className="rounded-full w-10"
              onClick={hadnlePause}
            >
              {pause ? (
                <PauseOne
                  theme="two-tone"
                  size="36"
                  fill={["#333", "#22c55e"]}
                />
              ) : (
                <Play theme="two-tone" size="36" fill={["#333", "#22c55e"]} />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
