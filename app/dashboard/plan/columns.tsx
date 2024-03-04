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
        <Dialog>
          <DialogTrigger className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-pen w-4 h-4"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg>
            修改
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>修改配置参数</DialogTitle>
            </DialogHeader>
            {/* <ParamForm
              id={FileParam.id.toString()}
              param_name={FileParam.name}
              param_value={FileParam.param_value}
              param_comment={FileParam.comment}
            /> */}
          </DialogContent>
        </Dialog>
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
