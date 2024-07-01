import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import useSWR from "swr";
import { DataTable } from "@/components/ui/data-table";
import { columnsKiva, KivaMode } from "../columns";
import { Data } from "@icon-park/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function BreadcrumbWithCustomSeparator() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/components">Components</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function convertKivaDataToKivaMode(kivaData: {
  [key: string]: string;
}): KivaMode[] {
  const kivaModes: KivaMode[] = [];

  for (const key in kivaData) {
    if (kivaData.hasOwnProperty(key)) {
      const kivaMode: KivaMode = {
        name: key,
        path: kivaData[key],
      };
      kivaModes.push(kivaMode);
    }
  }

  return kivaModes;
}

const KivaTask = () => {
  const [kivaData, setKivaData] = useState<{ [key: string]: string }>({});

  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://192.168.2.200:8888/api/planning/GetAllKivaPlanningTaskFilesName",
    fetcher,
    {
      refreshWhenHidden: false, // 当页面不可见时，停止重新获取数据
    }
  );

  useEffect(() => {
    if (data && data.data) {
      setKivaData(data.data);
      console.log(kivaData);
    }
  }, [data]); // <--- Update the dependency array to [data]

  if (error) return <div>无法访问数据</div>;
  if (isLoading) return <div>加载中...</div>;

  return (
    <Card className="w-full overflow-x-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">任务文件</h2>
          <Link href="/dashboard/plan/create">
            <Button size="sm">创建</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columnsKiva}
          data={convertKivaDataToKivaMode(kivaData)}
        />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default KivaTask;
