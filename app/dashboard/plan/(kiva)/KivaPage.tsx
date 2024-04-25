import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { kivaProp, columns_kiva } from "../columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gps } from "@icon-park/react";
import { useAtom } from "jotai";
import { parsedDataAtom } from "@/lib/atoms";
import KivaAdd from "./KivaAdd";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import { set } from "zod";

// 将fetchKivaData函数定义在useEffect外部
const fetchKivaData = (kivaData: string[]) => {
  // 解析kivaData数组，将每个字符串转换为kivaProp对象
  const parsedData: kivaProp[] = kivaData.map(
    (dataString: string, index: number) => {
      // 分割字符串，得到值数组
      const values = dataString.split(" ");
      // 创建kivaProp对象
      return {
        name: (index + 1).toString(),
        x: values[0],
        y: values[1],
        angle: values[2],
        speed: values[3],
      };
    }
  );
  return parsedData; // Add return statement to return parsed data
};

const KivaPage = () => {
  const [kivafile, setKivafile] = useAtom(parsedDataAtom);
  const [istrigger, setIstrigger] = useState(false);

  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

  useEffect(() => {}, []);

  const { data, error, isLoading } = useSWR(
    "http://192.168.2.200:8888/api/planning/GetKivaPlanningTaskFile",
    fetcher,
    {
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );

  useEffect(() => {
    if (data && data.data) {
      setKivafile(data.data);
    }
  }, [data]); // <--- Update the dependency array to [data]

  if (error) return <div>无法访问数据</div>;
  if (isLoading) return <div>加载中...</div>;

  const handleSaveKiva = () => {
    //将kivafie数组转换为字符串,每个元素之间用换行符
    const strKivafile = kivafile.join("\n");
    fetch("http://192.168.2.200:8888/api/planning/AddKivaTaskFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 可以添加其他头部信息
      },
      body: JSON.stringify({
        content: strKivafile,
        name: "setKivaMap",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP 状态" + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.msg, "保存成功");
        toast({
          title: "保存成功✅",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //触发 SWR 重新请求
    mutate("http://192.168.2.200:8888/api/planning/GetKivaPlanningTaskFile");
    setIstrigger(!istrigger);
  };

  // 渲染数据
  return (
    <div className="mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
            <div className="flex flex-row gap-1 items-center">
              <Gps theme="two-tone" size="24" fill={["#333", "#22c55e"]} />
              <p>kiva模式</p>
            </div>
            <div>
              <KivaAdd />
            </div>
          </CardTitle>
          <CardDescription>设置路径点</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns_kiva} data={fetchKivaData(kivafile)} />
        </CardContent>
        <CardFooter>
          <div className="w-full text-center">
            <Button className="w-full max-w-screen-sm" onClick={handleSaveKiva}>
              保存设置
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KivaPage;
