import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import React from "react";
import { Loc_AGV } from "./columns";
import { handleDelete } from "@/lib/actions";
import { Delete } from "@icon-park/react";

const DeletItem = (loc: Loc_AGV) => {
  return (
    <>
      {" "}
      <DropdownMenuItem
        className="text-red-600 flex flex-row gap-2 items-center"
        onClick={() => handleDelete(loc)}
      >
        <Delete theme="two-tone" size="20" fill={["#333", "#e11d48"]} />
        删除
      </DropdownMenuItem>
    </>
  );
};

export default DeletItem;
