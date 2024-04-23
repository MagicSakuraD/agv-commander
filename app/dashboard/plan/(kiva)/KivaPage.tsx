import React, { useEffect } from "react";
import useSWR from "swr";
import { kivaProp, columns_kiva } from "../columns";
import { DataTable } from "@/components/ui/data-table";

const KivaPage = () => {
  useEffect(() => {
    fetch("http://192.168.2.200:8888/api/planning/SetPlanningMode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 可以添加其他头部信息
      },
      body: JSON.stringify({
        content: "kiva",
        name: "setPlanningMode",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP 状态" + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.msg, "切换free模式成功");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://192.168.2.200:8888/api/planning/GetKivaPlanningTaskFile",
    fetcher
  );

  if (error) return <div>无法访问数据</div>;
  if (isLoading) return <div>加载中...</div>;

  const kiva_data = data.data;
  // 解析kiva_data数组，将每个字符串转换为kivaProp对象
  const parsedData: kivaProp[] = kiva_data.map((dataString: string) => {
    // 分割字符串，得到值数组
    const values = dataString.split(" ");
    // 创建kivaProp对象
    const dataObject: kivaProp = {
      name: values[0],
      y: values[1],
      angle: values[2],
      speed: values[3],
    };
    return dataObject;
  });

  // 渲染数据
  return (
    <div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns_kiva} data={parsedData} />
      </div>
    </div>
  );
};

export default KivaPage;
