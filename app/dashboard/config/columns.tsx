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
// import ChangeInitPoseBtn from "./ChangeInitPoseBtn";
// import DeleteInitPosebtn from "./DeleteInitPosebtn";

export type Fileprop = {
  id: number;
  param_name: string;
  param_value: string;
  comment: string;
};

export const columns: ColumnDef<Fileprop>[] = [
  {
    accessorKey: "id",
    header: "序号",
  },
  {
    accessorKey: "param_name",
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
      const InitPose = row.original;

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
                onClick={() =>
                  navigator.clipboard.writeText(InitPose.param_name)
                }
              >
                拷贝参数名
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <ChangeInitPoseBtn {...InitPose} />
              <DeleteInitPosebtn {...InitPose} /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];
