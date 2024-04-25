import React, { useCallback } from "react";
import { kivaProp } from "../columns";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Delete } from "@icon-park/react";
import { useAtom } from "jotai";
import { parsedDataAtom } from "@/lib/atoms";

const KivaDelete = (kivaData: kivaProp) => {
  const [kivafile, setKivafile] = useAtom(parsedDataAtom);

  // const handleDelete = useCallback(() => {
  //   console.log(kivaData);
  //   const index = Number(kivaData.name) - 1;
  //   const newKivafile = kivafile.filter((_, i) => i !== index);
  //   setKivafile(newKivafile);
  //   console.log(newKivafile); // this should log the updated state
  // }, [kivafile]);
  const handleDelete = () => {
    console.log(kivaData);
    const index = Number(kivaData.name) - 1;
    const newKivafile = kivafile.filter((_, i) => i !== index);
    setKivafile(newKivafile);
    console.log(newKivafile); // this should log the updated state
  };

  return (
    <>
      <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
        <Delete theme="two-tone" size="16" fill={["#333", "#ef4444"]} />
        删除
      </DropdownMenuItem>
    </>
  );
};

export default KivaDelete;
