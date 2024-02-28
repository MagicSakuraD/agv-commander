"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  mainId: z.string({
    required_error: "请选择一个动作大类.",
  }),
  subId: z.string({
    required_error: "请选择一个具体动作.",
  }),
  aciton_value: z.string({
    required_error: "请输入参数.",
  }),
});

interface CardWithFormProps {
  actionData: any[];
  setActionData: React.Dispatch<React.SetStateAction<any[]>>;
  setList: React.Dispatch<React.SetStateAction<any[]>>;
}
let actionlist: string[] = [];

export const CardWithForm: React.FC<CardWithFormProps> = ({
  actionData,
  setActionData,
  setList,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [vehicleAction, setVehicleAction] = useState<any[]>([]);
  const [selectedActionSub, setSelectedActionSub] = useState<string>("");
  const [preActionData, setPreActionData] = useState<string[]>([]);
  // let preAction_data: string[] = [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      aciton_value: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const action_base = actionData.find(
      (action) => action.id.toString() === data.mainId
    );

    const action_sub = vehicleAction.find(
      (action) => action.subId.toString() === data.subId
    );

    let comment_name: string = "";
    if (selectedAction === "130") {
      comment_name = action_base.name + ": " + action_sub.description;
      comment_name = comment_name.replace(/\{.*?\}/g, data.aciton_value);
    } else {
      if (selectedActionSub === "33537") {
        comment_name = action_base.name + ": " + action_sub.description;
        // 将 data.action_value 转换为数组
        let actionValues = data.aciton_value.split(",");

        // 使用 replace 方法的函数参数
        comment_name = comment_name.replace(/\{.*?\}/g, () => {
          // 使用 Array.shift 方法来依次获取 actionValues 中的元素
          return actionValues.shift() || "";
        });
      }
    }

    const form_data = { ...data, name: comment_name };
    setList((prev) => [...prev, form_data]);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(form_data, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  useEffect(() => {
    fetch("http://192.168.2.112:8888/api/planning/GetPlanningActions", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP 状态" + res.status);
        }
        return res.json();
      })
      .then((data) => {
        const action_data = data.data;
        setActionData(action_data.agv.actions);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function handleClickAction() {}

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>添加决策动作</CardTitle>
        <CardDescription>设置AGV车体动作或路径规划</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="mainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>动作大类</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // 这里是你的自定义代码
                      const action_base = actionData.find(
                        (action) => action.id.toString() === value
                      );

                      if (action_base) {
                        setSelectedAction(value);
                        setVehicleAction(action_base.subActions);
                      }
                      // 确保调用 field.onChange，以便 React Hook Form 更新状态
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择一个动作大类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actionData.map((action) => (
                        <SelectItem
                          key={action.id}
                          value={action.id.toString()}
                        >
                          {action.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedAction === "130" && (
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="subId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>具体动作</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择一个具体动作" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleAction.map((action) => (
                            <SelectItem
                              key={action.subId}
                              value={action.subId.toString()}
                            >
                              {action.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aciton_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>参数设置</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="单位：米/度"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {selectedAction === "131" && (
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="subId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>规划方式</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          // 这里是你的自定义代码
                          const action_sub = vehicleAction.find(
                            (action) => action.subId.toString() === value
                          );
                          if (action_sub) {
                            setSelectedActionSub(value);
                          }
                          console.log("Value changed:", value);

                          // 确保调用 field.onChange，以便 React Hook Form 更新状态
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择一个规划方式" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleAction.map((action) => (
                            <SelectItem
                              key={action.subId}
                              value={action.subId.toString()}
                            >
                              {action.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedActionSub === "33537" && (
                  <div>
                    <FormField
                      control={form.control}
                      name="aciton_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>参数设置</FormLabel>
                          <Input
                            placeholder="起始位姿态x坐标"
                            type="number"
                            onChange={(event) => {
                              // 创建一个新的数组，其中第一个元素是新的值，其余元素是 preActionData 中的旧元素
                              const newPreActionData = [
                                ...preActionData,
                                event.target.value,
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                            }}
                          />
                          <Input
                            placeholder="起始位姿态y坐标"
                            onChange={(event) => {
                              // 创建一个新的数组，其中第一个元素是新的值，其余元素是 preActionData 中的旧元素
                              const newPreActionData = [
                                ...preActionData,
                                event.target.value,
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                            }}
                          />
                          <Input
                            placeholder="起始位姿态角度"
                            onChange={(event) => {
                              // 创建一个新的数组，其中第一个元素是新的值，其余元素是 preActionData 中的旧元素
                              const newPreActionData = [
                                ...preActionData,
                                event.target.value,
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                            }}
                          />
                          <Input
                            placeholder="目标位姿态x坐标"
                            onChange={(event) => {
                              // 创建一个新的数组，其中第一个元素是新的值，其余元素是 preActionData 中的旧元素
                              const newPreActionData = [
                                ...preActionData,
                                event.target.value,
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                            }}
                          />
                          <Input
                            placeholder="目标位姿态y坐标"
                            onChange={(event) => {
                              // 创建一个新的数组，其中第一个元素是新的值，其余元素是 preActionData 中的旧元素
                              const newPreActionData = [
                                ...preActionData,
                                event.target.value,
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                            }}
                          />
                          <FormControl>
                            <Input
                              placeholder="目标位姿态角度"
                              onChange={(e) => {
                                // 创建一个新的数组，其中第一个元素是新的值，其余元素是 preActionData 中的旧元素
                                const newPreActionData = [
                                  ...preActionData,
                                  e.target.value,
                                ];
                                console.log(newPreActionData, "😔");
                                // 使用 setPreActionData 函数来更新 preActionData
                                setPreActionData(newPreActionData);

                                console.log(preActionData, "👽");
                                // 确保调用 field.onChange，以便 React Hook Form 更新状态
                                field.onChange(newPreActionData.join(","));
                              }}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {selectedActionSub === "33538" && <div>old</div>}
                {selectedActionSub === "33539" && <div>mic</div>}
              </div>
            )}
            <Button type="submit">提交</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

interface VehicleBodyProps {
  vehicleAction: any[];
}

const initialList: any[] = [];

const PlanPage = () => {
  const [actionData, setActionData] = useState<{}[]>([]);
  const [list, setList] = useState(initialList);

  return (
    <div className="md:container px-2 mx-auto pt-5 flex flex-wrap gap-5 justify-center">
      <CardWithForm
        actionData={actionData}
        setActionData={setActionData}
        setList={setList}
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>待提交表单</CardTitle>
          <CardDescription>
            确认表单正确，后将表单保存到任务工作区
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={list} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanPage;
