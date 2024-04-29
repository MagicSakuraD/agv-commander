"use server";
import { Loc_AGV } from "@/app/dashboard/(monitor)/localizationBags/columns";
import { Pose } from "@/app/dashboard/(monitor)/tabs/(InitPose)/columns";
import {
  Map_AGV,
  Map_bag,
} from "@/app/dashboard/(monitor)/tabs/(map-manager)/columns";
import { form_params } from "@/app/dashboard/config/ParamForm";
import { PlanningTaskFile } from "@/app/dashboard/plan/columns";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function handleDelete(loc: Loc_AGV) {
  try {
    const response = await fetch(
      "http://192.168.2.200:8888/api/config/deleteDebugDataBag",
      {
        method: "POST",
        cache: "no-store",
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
      "http://192.168.2.200:8888/api/config/DeleteLidarMappingMap",
      {
        method: "POST",
        cache: "no-store",
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
      "http://192.168.2.200:8888/api/config/deleteInitPose",
      {
        method: "POST",
        cache: "no-store",
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
      "http://192.168.2.200:8888/api/config/deleteRecordMappingBag",
      {
        method: "POST",
        cache: "no-store",
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
      "http://192.168.2.200:8888/api/config/SetCurrentMap",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          map_name: map_name.name,
        }),
      }
    );
    const data = await response.json();
    if (data.code === 0) {
      console.log(data, "🗺️", map_name.name);
      return data.data;
    } else {
      console.log("请求失败❌:", data, "🗺️", map_name.name);
      return data.data;
    }
  } catch (error) {
    console.error("Error❌:", error);
    return error;
  }
}

export async function ClearLogFileContents(log_name: string) {
  console.log(log_name);
  try {
    const response = await fetch(
      `http://192.168.2.200:8888/api/info/ClearLogFileContents?name=${log_name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ name: log_name }),
      }
    );
    const data = await response.json();
    if (data.code === 0) {
      console.log(data);
      return data.data;
    } else {
      console.log("请求失败❌:", data);
      return data.data;
    }
  } catch (error) {
    console.error("Error❌:", error);
    return error;
  }
}

export async function GetAllMapsName() {
  try {
    const response = await fetch(
      "http://192.168.2.200:8888/api/info/GetAllMapsName",
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 1 },
      }
    );
    const data = await response.json();
    if (data.code === 0) {
      console.log(data.data);
      return data.data;
    } else {
      console.log("请求失败❌:", data.data);
      return data.data;
    }
  } catch (error) {
    console.error("Error❌:", error);
    return error;
  }
}

export async function GetConfigContent(path_name: string) {
  try {
    const response = await fetch(
      `http://192.168.2.200:8888/api/info/GetConfigContent/{path}?path=${path_name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (data.code === 0) {
      console.log(data.data);
      return data.data;
    } else {
      console.log("请求失败❌:", data.data, data);
      return data.data;
    }
  } catch (error) {
    console.log("Error❌:", error);
    return error;
  }
}

export async function GetLogFileContents(log_name: string) {
  try {
    const response = await fetch(
      `http://192.168.2.200:8888/api/info/GetLogFileContents/{name}?name=${log_name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (data.code === 0) {
      return data.data;
    } else {
      console.log("请求失败❌:", data.data, data);
      return data.data;
    }
  } catch (error) {
    console.log("Error❌:", error);
    return error;
  }
}

export async function changeFileContent(form: form_params) {
  try {
    const response = await fetch(
      "http://192.168.2.200:8888/api/config/changeFileContent",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_name: form.file_name,
          line_number: form.line_number,
          new_content: form.new_content,
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
      "http://192.168.2.200:8888/api/config/changeInitPose",
      {
        method: "POST",
        cache: "no-store",
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
    "http://192.168.2.200:8888/api/info/GetAllLocalizationBagsName",
    {
      cache: "no-store",
      method: "GET",
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }
  return res.json();
}

export async function GetCurrentMapUseName() {
  const res = await fetch(
    "http://192.168.2.200:8888/api/info/CurrentMapUseName",
    {
      cache: "no-store",
      method: "GET",
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }

  return res.json();
}

export async function GetMappingBagPngData(Map_name: Map_AGV) {
  const res = await fetch(
    `http://192.168.2.200:8888/api/info/GetMappingBagPngData/{name}?name=${Map_name.name}`,
    {
      cache: "no-store",
      method: "GET",
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }
  return res.json();
}

export async function DeletePlanningTaskFile(task_name: PlanningTaskFile) {
  const res = await fetch(
    `http://192.168.2.200:8888/api/planning/DeletePlanningTaskFile/{path}?path=${task_name.name}`,
    {
      cache: "no-store",
      method: "GET",
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }
  return res.json();
}

export async function SetControlNodeState(cmd_num: string) {
  const res = await fetch(
    "http://192.168.2.200:8888/api/control/SetControlNodeState",
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cmd: cmd_num,
      }),
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }

  return res.json();
}

export async function SetPlanningTaskFile(path: string) {
  const res = await fetch(
    "http://192.168.2.200:8888/api/planning/SetPlanningTaskFile",
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: path,
      }),
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }

  return res.json();
}

export async function SetPlanningNodeState(cmd: string) {
  const res = await fetch(
    "http://192.168.2.200:8888/api/control/SetPlanningNodeState",
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cmd: cmd,
      }),
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }

  return res.json();
}

export async function GetPlanningTaskFile(task_name: PlanningTaskFile) {
  const res = await fetch(
    `http://192.168.2.200:8888/api/planning/GetPlanningTaskFile/{path}?path=${task_name.name}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("获取数据失败");
  }
  return res.json();
}
