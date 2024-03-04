import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { PlanningTaskFile } from "./columns";
import { DeletePlanningTaskFile } from "@/lib/actions";
import { mutate } from "swr";

const DeleteTask = (task_name: PlanningTaskFile) => {
  return (
    <>
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => {
          DeletePlanningTaskFile(task_name);
          mutate("http://192.168.2.112:8888/api/planning/GetPlanningTaskFiles");
        }}
      >
        删除<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  );
};

export default DeleteTask;
