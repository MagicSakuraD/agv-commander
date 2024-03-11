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

import ParamForm from "./ParamForm";
import { EditTwo } from "@icon-park/react";
// import ChangeInitPoseBtn from "./ChangeInitPoseBtn";
// import DeleteInitPosebtn from "./DeleteInitPosebtn";

export type Fileprop = {
  id: number;
  name: string;
  param_value: string;
  comment: string;
};

export const columns: ColumnDef<Fileprop>[] = [
  {
    accessorKey: "id",
    header: "序号",
  },
  {
    accessorKey: "name",
    header: "参数名",
  },
  {
    accessorKey: "param_value",
    header: "参数值",
  },
  {
    accessorKey: "comment",
    header: "注释",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const FileParam = row.original;
      return (
        <Dialog>
          <DialogTrigger className="flex gap-1 items-center">
            <EditTwo theme="two-tone" size="20" fill={["#333", "#22c55e"]} />
            修改
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>修改配置参数</DialogTitle>
            </DialogHeader>
            <ParamForm
              id={FileParam.id.toString()}
              param_name={FileParam.name}
              param_value={FileParam.param_value}
              param_comment={FileParam.comment}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
