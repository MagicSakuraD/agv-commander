import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Map_AGV } from "./columns";
import { handleDeleteMap } from "@/lib/actions";
const DeleteMap = (map_name: Map_AGV) => {
  return (
    <>
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => {
          handleDeleteMap(map_name);
        }}
      >
        删除<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  );
};

export default DeleteMap;
