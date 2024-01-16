"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Node = {
  name: string;
  status: "启动" | "关闭";
};

export const columns: ColumnDef<Node>[] = [
  {
    accessorKey: "name",
    header: () => <div className="">节点名</div>,
  },
  {
    accessorKey: "status",
    header: "状态",
  },
];
