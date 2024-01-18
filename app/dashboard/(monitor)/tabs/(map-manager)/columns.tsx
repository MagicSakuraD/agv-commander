"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Map_AGV = {
  name: string;
};

export const columns: ColumnDef<Map_AGV>[] = [
  {
    accessorKey: "name",
    header: () => <div className="">地图名</div>,
    // cell: ({ row }) => {
    //   const map = row.original;
    //   return (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger>
    //         <Button variant="ghost" className="h-8 w-8 p-0">
    //           <span className="sr-only">Open menu</span>
    //         </Button>
    //       </DropdownMenuTrigger>
    //     </DropdownMenu>
    //   );
    // },
  },
];

export type Map_bag = {
  name: string;
};

export const columns_bag: ColumnDef<Map_bag>[] = [
  {
    accessorKey: "name",
    header: () => <div className="">建图数据包名</div>,
  },
];
