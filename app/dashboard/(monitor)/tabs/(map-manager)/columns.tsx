"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Map_AGV = {
  name: string;
};

export const columns: ColumnDef<Map_AGV>[] = [
  {
    accessorKey: "name",
    header: () => <div className="">地图名</div>,
  },
];
