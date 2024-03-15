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
        className="text-red-600 flex flex-row gap-2 items-center"
        onClick={() => handleDelete(loc)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 10V44H39V10H9Z"
            fill="#dc2626"
            stroke="#333"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            d="M20 20V33"
            stroke="#333"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M28 20V33"
            stroke="#333"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 10H44"
            stroke="#333"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 10L19.289 4H28.7771L32 10H16Z"
            fill="#dc2626"
            stroke="#333"
            stroke-width="4"
            stroke-linejoin="round"
          />
        </svg>
        删除
      </DropdownMenuItem>
    </>
  );
};

export default DeletItem;
