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
// import ParamForm from "./ParamForm";

export type Fileprop = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Fileprop>[] = [
  {
    accessorKey: "Id",
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
    header: "动作解释",
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
