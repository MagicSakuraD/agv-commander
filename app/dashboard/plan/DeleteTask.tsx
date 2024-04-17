import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { PlanningTaskFile } from "./columns";
import { DeletePlanningTaskFile } from "@/lib/actions";
import { mutate } from "swr";
import { Delete } from "@icon-park/react";

const DeleteTask = (task_name: PlanningTaskFile) => {
  return (
    <>
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => {
          DeletePlanningTaskFile(task_name);
          //   mutate("http://192.168.2.200:8888/api/planning/GetPlanningTaskFiles");
        }}
      >
        <Delete theme="two-tone" size="16" fill={["#333", "#ef4444"]} />
        删除
      </DropdownMenuItem>
    </>
  );
};

export default DeleteTask;
