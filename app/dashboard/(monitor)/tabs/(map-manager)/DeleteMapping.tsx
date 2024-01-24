import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Map_bag } from "./columns";
import { handleDeleteMappingBag } from "@/lib/actions";

const DeleteMapping = (mapping_name: Map_bag) => {
  return (
    <>
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => handleDeleteMappingBag(mapping_name)}
      >
        删除<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  );
};

export default DeleteMapping;
