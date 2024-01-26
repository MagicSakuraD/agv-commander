"use server";
import { Loc_AGV } from "@/app/dashboard/(monitor)/localizationBags/columns";
import {
  Map_AGV,
  Map_bag,
} from "@/app/dashboard/(monitor)/tabs/(map-manager)/columns";
import { map } from "leaflet";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function handleDelete(loc: Loc_AGV) {
  try {
    const response = await fetch(
      "http://192.168.2.112:8888/api/config/deleteDebugDataBag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bag_name: loc.name,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error❌:", error);
  }
  // revalidatePath("/dashboard");

  // redirect("/dashboard");
}

export async function handleDeleteMappingBag(mapping_name: Map_bag) {
  try {
    const response = await fetch(
      "http://192.168.2.112:8888//api/config/deleteRecordMappingBag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bag_name: mapping_name.name,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error❌:", error);
  }
  // revalidateTag("Mapping");
}

export async function handleSetCurrentMap(map_name: Map_AGV) {
  try {
    const response = await fetch(
      "http://192.168.2.112:8888/api/config/SetCurrentMap",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bag_name: map_name.name,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    return data.data;
  } catch (error) {
    console.error("Error❌:", error);
    return error;
  }
}
