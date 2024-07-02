import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import React from "react";
import { KivaMode } from "./columns";
import { handleDeletekiva } from "@/lib/actions";
import { Delete } from "@icon-park/react";

const KivaDeleteItem = (Kivafile: KivaMode) => {
  return (
    <>
      <DropdownMenuItem
        className="text-red-600 flex flex-row gap-2 items-center"
        onClick={() => {
          handleDeletekiva(Kivafile.name.replace(/\.txt$/, ""));
        }}
      >
        <Delete theme="two-tone" size="16" fill={["#333", "#e11d48"]} />
        删除
      </DropdownMenuItem>
    </>
  );
};

export default KivaDeleteItem;
