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
import { useState } from "react";
import {
  SetControlNodeState,
  SetPlanningNodeState,
  SetPlanningTaskFile,
} from "@/lib/actions";
import { useTask } from "@/lib/swr";
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

const FormSchema = z.object({
  task: z.string({
    required_error: "Please select an task to display.",
  }),
});

export default function VehiclePage() {
  const [task, setTask] = useState("暂无");
  const [pause, setPause] = useState(true);

  const handleRadioChange = async (value: string) => {
    let cmd = value === "Manual" ? "0" : "1";
    const data = SetControlNodeState(cmd);
    console.log(data);
  };

  const { data, isLoading, isError } = useTask();
  // const dataEntries = Object.entries(data?.data);
  const dataEntries = data?.data ? Object.entries(data.data) : [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("设置任务", data.task);

    const task_data = SetPlanningTaskFile(data.task);
    console.log(task_data, "task_data");
    let filename = data.task.split("/").pop();
    if (filename) {
      console.log("设置任务", filename);
      setTask(filename);
    } else {
      console.log("设置任务失败");
    }
  }

  function hadnlePause() {
    setPause(!pause);
    console.log(pause, "pause");
    let cmd = pause ? "3" : "4";
    const State_data = SetPlanningNodeState(cmd);
    console.log(State_data, "State_data");
  }

  return (
    <div className="md:container px-2 mx-auto pt-5">
      <Card>
        <CardHeader>
          <CardTitle>控制模式</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-16">
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

          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
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
                <Button className="w-full" type="submit">
                  执行任务
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="mt-8 flex flex-col gap-5">
          <Separator />
          <div className="flex flex-row gap-5 w-full justify-center rounded-full h-12 items-center border-2 shadow-md">
            <span>
              <b className="text-muted-foreground">正在运行的任务: </b>
              <b>{task}</b>
            </span>

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
