import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";
import { Loc_AGV } from "./columns";
import { handleDelete } from "@/lib/actions";

const DeletItem = (loc: Loc_AGV) => {
  return (
    <>
      {" "}
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => handleDelete(loc)}
      >
        删除<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  );
};

export default DeletItem;
