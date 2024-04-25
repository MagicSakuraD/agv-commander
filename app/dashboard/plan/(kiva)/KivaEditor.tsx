import React from "react";
import { kivaProp } from "../columns";
import { useAtom } from "jotai";
import { parsedDataAtom } from "@/lib/atoms";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const KivaEditor = (kivaData: kivaProp) => {
  const [kivafile, setKivafile] = useAtom(parsedDataAtom);
  const handleClick = () => {
    console.log(kivafile);
  };
  return (
    <>
      <DropdownMenuItem className="text-red-600" onClick={handleClick}>
        {/* <Delete theme="two-tone" size="16" fill={["#333", "#ef4444"]} /> */}
        删除
      </DropdownMenuItem>
    </>
  );
};

export default KivaEditor;
