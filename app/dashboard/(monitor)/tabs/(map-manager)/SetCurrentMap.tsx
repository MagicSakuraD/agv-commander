import React from "react";
import { Map_AGV } from "./columns";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { handleSetCurrentMap } from "@/lib/actions";
import { toast, useToast } from "@/components/ui/use-toast";
import { MapNameAtom } from "@/lib/atoms";
import { useAtom, useSetAtom } from "jotai";

const SetCurrentMap = (map_name: Map_AGV) => {
  const setMapName = useSetAtom(MapNameAtom);

  const handleApplyMap = async () => {
    const result = await handleSetCurrentMap(map_name);
    if (typeof result === "string") {
      // setMapResult(result);
      toast({
        title: "消息📢:",
        description: result,
      });
      setMapName(result);
    } else {
      // handle the case where result is not a string
      console.log("result is not a string");
    }
  };
  return (
    <>
      <DropdownMenuItem onClick={handleApplyMap}>应用地图</DropdownMenuItem>
    </>
  );
};

export default SetCurrentMap;
