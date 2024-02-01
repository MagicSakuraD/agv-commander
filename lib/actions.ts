"use server";
import { Loc_AGV } from "@/app/dashboard/(monitor)/localizationBags/columns";
import { Pose } from "@/app/dashboard/(monitor)/tabs/(InitPose)/columns";
import {
  Map_AGV,
  Map_bag,
} from "@/app/dashboard/(monitor)/tabs/(map-manager)/columns";

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
  revalidateTag("Loc");
  // redirect("/dashboard");
}

export async function handleDeleteMap(map_name: Map_AGV) {
  try {
    const response = await fetch(
      "http://192.168.2.112:8888/api/config/DeleteLidarMappingMap",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          map_name: map_name.name,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error❌:", error);
  }
}

export async function DeleteInitPose(pose_id: Pose) {
  try {
    const response = await fetch(
      "http://192.168.2.112:8888/api/config/deleteInitPose",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          line_number: pose_id.id,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error❌:", error);
  }
}

export async function handleDeleteMappingBag(mapping_name: Map_bag) {
  try {
    const response = await fetch(
      "http://192.168.2.112:8888/api/config/deleteRecordMappingBag",
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
          map_name: map_name.name,
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

export async function changeInitPose(Pose_data: Pose) {
  try {
    const response = await fetch(
      "http://192.168.2.112:8888/api/config/changeInitPose",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          line_number: Pose_data.id,
          name: Pose_data.name,
          pitch: Pose_data.pitch,
          roll: Pose_data.roll,
          x: Pose_data.x,
          y: Pose_data.y,
          yaw: Pose_data.yaw,
          z: Pose_data.z,
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

export async function GetAllLocalizationBagsName() {
  const res = await fetch(
    "http://192.168.2.112:8888/api/info/GetAllLocalizationBagsName",
    {
      cache: "no-store",
      method: "GET",
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
