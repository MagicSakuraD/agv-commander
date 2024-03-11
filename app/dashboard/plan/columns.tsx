"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteTask from "./DeleteTask";
// import ParamForm from "./ParamForm";

export type Fileprop = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Fileprop>[] = [
  {
    accessorKey: "mainId",
    header: "动作大类",
  },
  {
    accessorKey: "subId",
    header: "动作子类",
  },
  {
    accessorKey: "aciton_value",
    header: "参数值",
  },
  {
    accessorKey: "name",
    header: "动作名描述",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ActionParam = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              {/* <MoreHorizontal className="h-4 w-4" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 bi bi-three-dots"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ActionParam.name)}
            >
              拷贝动作名
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DeleteTask {...ActionParam} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export type PlanningTaskFile = {
  name: string;
};

export const columns_task: ColumnDef<PlanningTaskFile>[] = [
  {
    accessorKey: "name",
    header: () => <div className="">任务文件名</div>,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const task_name = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              {/* <MoreHorizontal className="h-4 w-4" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 bi bi-three-dots"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(task_name.name)}
            >
              拷贝任务文件名
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteTask {...task_name} />
            {/* <DeleteMapping {...mapping_name} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
