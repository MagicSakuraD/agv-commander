import React from "react";
import { Map_AGV } from "./columns";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { handleSetCurrentMap } from "@/lib/actions";
import { toast, useToast } from "@/components/ui/use-toast";

const SetCurrentMap = (map_name: Map_AGV) => {
  const [mapResult, setMapResult] = React.useState<string>("");

  const handleApplyMap = async () => {
    const result = await handleSetCurrentMap(map_name);
    if (typeof result === "string") {
      setMapResult(result);
      toast({
        description: result,
      });
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
