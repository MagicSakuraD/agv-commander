import React, { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Map_AGV } from "./columns";
import { GetMappingBagPngData } from "@/lib/actions";
import { set } from "zod";
import Image from "next/image";

const ViewMap = (currnetMap_name: Map_AGV) => {
  const [Map_png, setMap_png] = useState<Map_AGV>();
  useEffect(() => {
    const fetchMapData = async (currnetMap_name: Map_AGV) => {
      const Map_png = await GetMappingBagPngData(currnetMap_name);

      setMap_png(Map_png.data);
    };

    fetchMapData(currnetMap_name);
  }, []);
  return (
    <DialogContent className="aspect-video">
      <Image
        src={`data:image/png;base64,${Map_png}`}
        alt="地图图片"
        width={2000}
        height={2000}
      />
    </DialogContent>
  );
};

export default ViewMap;
