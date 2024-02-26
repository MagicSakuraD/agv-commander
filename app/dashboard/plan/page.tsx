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
import { set } from "zod";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

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

  function handleChangeAction(value: string) {
    actionlist.push(value);
    setSelectedAction(value);
    setVehicleAction(actionData[0].subActions);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>创建决策元动作</CardTitle>
        <CardDescription>设置AGV车体动作或路径规划</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-8">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mainAciton">动作大类</Label>
              <Select onValueChange={handleChangeAction}>
                <SelectTrigger id="mainAciton">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {actionData.map((action) => (
                    <SelectItem key={action.id} value={action.id.toString()}>
                      {action.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedAction === "130" && (
            <VehicleBody vehicleAction={vehicleAction} />
          )}
          {selectedAction === "131" && <div>that</div>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>提交</Button>
      </CardFooter>
    </Card>
  );
};

function handleChangeSubAct(value: string) {
  console.log(value);
  actionlist.push(value);
  console.log(actionlist);
}

function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
  actionlist.push(e.target.value);
  console.log(actionlist);
}

interface VehicleBodyProps {
  vehicleAction: any[];
}

const VehicleBody: React.FC<VehicleBodyProps> = ({ vehicleAction }) => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="area">具体动作</Label>
          <Select onValueChange={handleChangeSubAct}>
            <SelectTrigger id="area">
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              {vehicleAction.map((action) => (
                <SelectItem key={action.subId} value={action.subId.toString()}>
                  {action.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="security-level">参数设置</Label>
          <Input
            type="number"
            placeholder="单位：米/度"
            id="security-level"
            onChange={handleChangeInput}
          />
        </div>
      </div>
    </div>
  );
};

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
          <CardTitle>表单预览</CardTitle>
          <CardDescription>将表单保存到任务工作区</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={initialList} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanPage;
