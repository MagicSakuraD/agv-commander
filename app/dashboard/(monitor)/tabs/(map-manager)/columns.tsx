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
import DeleteMapping from "./DeleteMapping";
import SetCurrentMap from "./SetCurrentMap";
import DeleteMap from "./DeleteMap";
import ViewMap from "./ViewMap";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
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
  {
    id: "actions",
    cell: ({ row }) => {
      const map_name = row.original;

      return (
        <Dialog>
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
                onClick={() => navigator.clipboard.writeText(map_name.name)}
              >
                拷贝地图名
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild onSelect={(e) => e.preventDefault()}>
                <DropdownMenuItem>查看地图 </DropdownMenuItem>
              </DialogTrigger>
              <ViewMap {...map_name} />
              <SetCurrentMap {...map_name} />
              <DeleteMap {...map_name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
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
  {
    id: "actions",
    cell: ({ row }) => {
      const mapping_name = row.original;

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
              onClick={() => navigator.clipboard.writeText(mapping_name.name)}
            >
              拷贝数据包名
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DeleteMapping {...mapping_name} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
