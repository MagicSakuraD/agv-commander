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
import { useForm, useFieldArray } from "react-hook-form";
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

import SaveForm from "./SaveForm";
import PlanningTaskFiles from "./PlanningTaskFiles";
import { FileDisplay, Notes, OneKey, TwoKey } from "@icon-park/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KivaPage from "./(kiva)/KivaPage";
import KivaTask from "./(kiva)/KivaTask";

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

const CardWithForm: React.FC<CardWithFormProps> = ({
  actionData,
  setActionData,
  setList,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [vehicleAction, setVehicleAction] = useState<any[]>([]);
  const [selectedActionSub, setSelectedActionSub] = useState<string>("");
  const [preActionData, setPreActionData] = useState<string[]>([]);
  const [inputs, setInputs] = useState<
    { x: string; y: string; theta: string }[]
  >([]);
  const [inputnumber, setInputNumber] = useState<number>(0);

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
    if (selectedAction === "0x82") {
      comment_name = action_base.name + ": " + action_sub.description;
      comment_name = comment_name.replace(/\{.*?\}/g, data.aciton_value);
    } else {
      if (selectedActionSub === "0x8301") {
        comment_name = action_base.name + ": " + action_sub.description;
        // 将 data.action_value 转换为数组
        let actionValues = data.aciton_value.split(",");
        let firstThree = actionValues.slice(0, 3).join(",");
        let rest = actionValues.slice(3).join(",");
        let result = firstThree + "|" + rest;
        data.aciton_value = result;
        // 使用 replace 方法的函数参数
        comment_name = comment_name.replace(/\{.*?\}/g, () => {
          // 使用 Array.shift 方法来依次获取 actionValues 中的元素
          return actionValues.shift() || "";
        });
      } else if (selectedActionSub === "0x8302") {
        let guide_point = data.aciton_value.split(",");
        let speed = guide_point[0];
        let coordinates = guide_point.slice(1);
        let groups = [];
        for (let i = 0; i < coordinates.length; i += 3) {
          groups.push(
            `(${coordinates[i]}, ${coordinates[i + 1]}, ${coordinates[i + 2]})`
          );
        }

        let res_groups = [];
        for (let i = 0; i < coordinates.length; i += 3) {
          res_groups.push(
            `${coordinates[i]},${coordinates[i + 1]},${coordinates[i + 2]}`
          );
        }
        let result = res_groups.join("|");
        data.aciton_value = speed + "|" + result;

        console.log(groups, "😊😊😊", speed, coordinates);
        let formattedCoordinates = groups.join(", ");
        comment_name = `${action_base.name}: 以${speed}m/s的速度依次经过${formattedCoordinates}引导点`;
      } else if (selectedActionSub === "0x8303") {
        comment_name = action_base.name + ": " + action_sub.description;
        let actionValues = data.aciton_value.split(",");
        let speed = actionValues[0];
        let coordinates = actionValues.slice(1);
        let iterator = actionValues.values();
        comment_name = comment_name.replace(/\{.*?\}/g, () => {
          let nextValue = iterator.next();
          return nextValue.done ? "" : nextValue.value;
        });
        data.aciton_value = speed + "|" + coordinates;
      }
    }

    const form_data = { ...data, name: comment_name };
    setList((prev) => [...prev, form_data]);
  }

  useEffect(() => {
    fetch("http://192.168.2.200:8888/api/planning/GetPlanningActions", {
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

  function handleAppend() {
    setInputs([...inputs, { x: "", y: "", theta: "" }]);
  }

  const handleInputChange = () => () => {
    // const newInputs = [...inputs];
    // newInputs[index][field] = event.target.value;
    // setInputs(newInputs);
  };

  let newPreActionData: string[] = [];
  function onChangeInputs(
    index: number,
    value: string,
    field: any,
    id: string
  ) {
    if (id === "x") {
      newPreActionData = [
        ...preActionData.slice(0, index * 3 + 1), // 保留第一个值
        value, // 使用 event.target.value 替换第二个值
        ...preActionData.slice(index * 3 + 2), // 保留剩余的值
      ];
      // 使用 setPreActionData 函数来更新 preActionData
      setPreActionData(newPreActionData);
    } else if (id === "y") {
      newPreActionData = [
        ...preActionData.slice(0, index * 3 + 2), // 保留第一个值
        value, // 使用 event.target.value 替换第二个值
        ...preActionData.slice(index * 3 + 3),
      ];
      setPreActionData(newPreActionData);
    } else if (id === "theta") {
      newPreActionData = [
        ...preActionData.slice(0, index * 3 + 3), // 保留第一个值
        value, // 使用 event.target.value 替换第二个值
        ...preActionData.slice(index * 3 + 4),
      ];
      setPreActionData(newPreActionData);
    }

    if (newPreActionData.length === index * 3 + 4) {
      field.onChange(newPreActionData.join(","));
    }
    console.log(newPreActionData, "😔");
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <OneKey theme="two-tone" size="20" fill={["#333", "#22c55e"]} />
          新建任务文件
        </CardTitle>
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
            {selectedAction === "0x82" && (
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
                          step="any" // 允许输入任何数字，包括小数
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {selectedAction === "0x83" && (
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

                {selectedActionSub === "0x8301" && (
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
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                event.target.value,
                                ...preActionData.slice(1),
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 6) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <Input
                            placeholder="起始位姿态y坐标"
                            type="number"
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                ...preActionData.slice(0, 1), // 保留第一个值
                                event.target.value, // 使用 event.target.value 替换第二个值
                                ...preActionData.slice(2), // 保留剩余的值
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 6) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <Input
                            placeholder="起始位姿态角度"
                            type="number"
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                ...preActionData.slice(0, 2), // 保留前两个值
                                event.target.value, // 使用 event.target.value 替换第三个值
                                ...preActionData.slice(3), // 保留剩余的值
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 6) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <Input
                            placeholder="目标位姿态x坐标"
                            type="number"
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                ...preActionData.slice(0, 3), // 保留前三个值
                                event.target.value, // 使用 event.target.value 替换第四个值
                                ...preActionData.slice(4), // 保留剩余的值
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 6) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <Input
                            placeholder="目标位姿态y坐标"
                            type="number"
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                ...preActionData.slice(0, 4), // 保留前四个值
                                event.target.value, // 使用 event.target.value 替换第五个值
                                ...preActionData.slice(5), // 保留剩余的值
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 6) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <FormControl>
                            <Input
                              placeholder="目标位姿态角度"
                              type="number"
                              step="any" // 允许输入任何数字，包括小数
                              onChange={(e) => {
                                const newPreActionData = [
                                  ...preActionData.slice(0, 5), // 保留前五个值
                                  e.target.value, // 使用 e.target.value 替换第六个值
                                  // ...preActionData.slice(6), // 保留剩余的值
                                ];

                                // 使用 setPreActionData 函数来更新 preActionData
                                setPreActionData(newPreActionData);

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
                {selectedActionSub === "0x8302" && (
                  <div>
                    <FormField
                      control={form.control}
                      name="aciton_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>参数设置</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="目标速度,单位m/s"
                              onChange={(e) => {
                                const newPreActionData = [
                                  e.target.value, // 使用 e.target.value 替换第六个值
                                  ...preActionData.slice(1), // 保留剩余的值
                                ];

                                // 使用 setPreActionData 函数来更新 preActionData
                                setPreActionData(newPreActionData);

                                // 确保调用 field.onChange，以便 React Hook Form 更新状态
                                field.onChange(newPreActionData.join(","));
                              }}
                            />
                          </FormControl>

                          {inputs.map((input, index) => (
                            <div key={index} className="flex flex-row gap-2">
                              <Input
                                type="text"
                                placeholder="x坐标"
                                onChange={(e) => {
                                  onChangeInputs(
                                    index,
                                    e.target.value,
                                    field,
                                    "x"
                                  );
                                }}
                              />
                              <Input
                                type="text"
                                placeholder="y坐标"
                                onChange={(e) => {
                                  onChangeInputs(
                                    index,
                                    e.target.value,
                                    field,
                                    "y"
                                  );
                                }}
                              />
                              <Input
                                type="text"
                                placeholder="角度theta"
                                onChange={(e) => {
                                  onChangeInputs(
                                    index,
                                    e.target.value,
                                    field,
                                    "theta"
                                  );
                                }}
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={handleAppend}
                          >
                            添加引导点
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {selectedActionSub === "0x8303" && (
                  <div>
                    <FormField
                      control={form.control}
                      name="aciton_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>参数设置</FormLabel>
                          <Input
                            placeholder="目标速度,单位m/s"
                            type="number"
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                event.target.value,
                                ...preActionData.slice(1),
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 4) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <Input
                            placeholder="目标位姿态x坐标"
                            type="number"
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                ...preActionData.slice(0, 1), // 保留第一个值
                                event.target.value, // 使用 event.target.value 替换第二个值
                                ...preActionData.slice(2), // 保留剩余的值
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 4) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <Input
                            placeholder="目标位姿态y坐标"
                            type="number"
                            step="any" // 允许输入任何数字，包括小数
                            onChange={(event) => {
                              const newPreActionData = [
                                ...preActionData.slice(0, 2), // 保留前两个值
                                event.target.value, // 使用 event.target.value 替换第三个值
                                ...preActionData.slice(3), // 保留剩余的值
                              ];

                              // 使用 setPreActionData 函数来更新 preActionData
                              setPreActionData(newPreActionData);
                              if (newPreActionData.length === 4) {
                                field.onChange(newPreActionData.join(","));
                              }
                            }}
                          />
                          <FormControl>
                            <Input
                              placeholder="目标位姿态角度"
                              type="number"
                              step="any" // 允许输入任何数字，包括小数
                              onChange={(event) => {
                                const newPreActionData = [
                                  ...preActionData.slice(0, 3), // 保留前三个值
                                  event.target.value, // 使用 event.target.value 替换第四个值
                                  ...preActionData.slice(4), // 保留剩余的值
                                ];

                                // 使用 setPreActionData 函数来更新 preActionData
                                setPreActionData(newPreActionData);
                                if (newPreActionData.length === 4) {
                                  field.onChange(newPreActionData.join(","));
                                }
                              }}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}
            <Button type="submit">提交</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const initialList: any[] = [];

const PlanPage = () => {
  const [actionData, setActionData] = useState<{}[]>([]);
  const [list, setList] = useState(initialList);

  return (
    <div className="md:container px-2 mx-auto pt-5 flex flex-wrap gap-5 justify-center">
      <Tabs defaultValue="kiva" className="w-full">
        <TabsList>
          <TabsTrigger value="kiva">Kiva模式</TabsTrigger>
          <TabsTrigger value="free">Free模式</TabsTrigger>
        </TabsList>
        <TabsContent value="kiva" className="mt-6">
          <KivaTask />
        </TabsContent>

        <TabsContent value="free" className="space-y-4 mt-6">
          <CardWithForm
            actionData={actionData}
            setActionData={setActionData}
            setList={setList}
          />

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex flex-row gap-2 items-center">
                <TwoKey theme="two-tone" size="20" fill={["#333", "#22c55e"]} />
                保存任务文件
              </CardTitle>
              <CardDescription>
                检查任务，确认无误后保存到任务工作区
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={list} />
            </CardContent>
            <CardFooter>
              <SaveForm list={list} />
            </CardFooter>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2">
                <Notes theme="two-tone" size="20" fill={["#333", "#22c55e"]} />
                任务文件列表
              </CardTitle>
              <CardDescription>规划模块下的所有任务文件</CardDescription>
            </CardHeader>
            <CardContent>
              <PlanningTaskFiles />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanPage;
