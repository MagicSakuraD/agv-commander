"use client";
import React, { useEffect, useState } from "react";
import { Map_AGV, columns, Map_bag, columns_bag } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Bag_form from "./bag-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast, useToast } from "@/components/ui/use-toast";
import handleAck from "mqtt/lib/handlers/ack";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  checkAtom,
  successAtom,
  bagnameAtom,
} from "@/app/dashboard/(monitor)/atoms";
import { useAtom } from "jotai";
import CheckMapping from "./CheckMapping";
import LoadingMapping from "./LoadingMapping";
import DisplayCompletedMap from "./DisplayCompletedMap";
import useSWR from "swr";

interface AlertDialogBtnProps {
  status: number; // 或者你的状态的类型
  setStatus: React.Dispatch<React.SetStateAction<number>>;
}

const AlertDialogBtn: React.FC<AlertDialogBtnProps> = ({
  status,
  setStatus,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [formValues, setFormValues] = useState("");
  // const [check, setCheck] = useAtom(checkAtom);
  // const [success, setSuccess] = useAtom(successAtom);

  const [check, setCheck] = useState(true);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    if (status === 0) {
      const intervalId = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);

      return () => clearInterval(intervalId); // 清除计时器
    }
  }, [status]);

  function handleOver() {
    setStatus(1);
    setSeconds(0);
    toast({
      description: "建图数据包录制结束",
    });
    // 发送 fetch 请求
    fetch("http://192.168.2.112:8888/api/config/StartRecordMappingData", {
      method: "POST", // 或 'GET'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cmd: "force_stop", name: formValues }), // 将表单值转换为 JSON
    })
      .then((response) => {
        // 检查响应是否成功
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // 解析响应主体
        return response.json();
      })
      .then((data) => {
        // 处理解析后的数据
        console.log(data);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-auto mx-auto">
          记录建图数据
        </Button>
      </DialogTrigger>
      {status ? (
        <div>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex flex-row gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#dc2626"
                  className="bi bi-exclamation-circle-fill w-6 h-6"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                <p className="text-red-500">注意事项</p>
              </DialogTitle>

              <div className="text-sm text-muted-foreground">
                <p className="py-2">
                  1.建图操作时尽量在初始阶段不要出现太大的晃动与转向，且全程速度不宜过快，录制开始后可在初始点停留
                  5 秒左右再进行运动。
                </p>
                <p className="py-2 ">
                  2.需记下建图时的起始点，本套定位程序采用固定点初始化，建图时的起始点即为定位时的初始化点。
                </p>
                <p className="py-2 ">
                  3.准备完毕后,点击开始录制按钮即可开始记录数据。
                </p>
              </div>
            </DialogHeader>
            <Bag_form
              status={status}
              setStatus={setStatus}
              setFormValues={setFormValues}
              setCheck={setCheck}
              setSuccess={setSuccess}
            />
          </DialogContent>
        </div>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          {check ? (
            <div>
              <CheckMapping setCheck={setCheck} setSuccess={setSuccess} />
            </div>
          ) : (
            <div>
              {success ? (
                <div className="flex justify-center flex-col">
                  <DialogHeader>
                    <div className="text-lg text-muted-foreground flex gap-2 items-center">
                      <p className="text-center">相关ROS节点未启动,无法录制</p>
                    </div>
                  </DialogHeader>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleOver}
                      className="w-1/2"
                    >
                      结束录制
                    </Button>
                  </DialogClose>
                </div>
              ) : (
                <div>
                  <DialogHeader>
                    <DialogTitle className="flex flex-row gap-2 items-center">
                      <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 text-gray-200 animate-spin  fill-green-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <p className="text-green-600">录制中</p>
                    </DialogTitle>

                    <div className="text-lg text-muted-foreground">
                      录制时长: {seconds} 秒
                    </div>
                  </DialogHeader>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleOver}
                    >
                      结束录制
                    </Button>
                  </DialogClose>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

const FormSchema = z.object({
  mapping_name: z.string({
    required_error: "请选择一个建图数据包来建图.",
  }),
});

interface SelectFormProps {
  bags: Map_bag[];
  setDialogStatus: React.Dispatch<React.SetStateAction<number>>;
}

const SelectForm: React.FC<SelectFormProps> = ({ bags, setDialogStatus }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [bagname, setBagname] = useAtom(bagnameAtom);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setBagname(data.mapping_name);
    let bodyContent = JSON.stringify({
      bag_name: data.mapping_name,
    });

    let headersList = {
      "Content-Type": "application/json",
    };
    fetch("http://192.168.2.112:8888/api/work/StartMappingTaskByBag", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    })
      .then((response) => {
        // 检查响应的状态码
        if (!response.ok) {
          throw new Error("HTTP 状态" + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // 处理响应数据
        let Mapping_data = data.data;
        console.log(Mapping_data);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
    console.log(data.mapping_name);
    toast({
      title: "成功提交如下数据包:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{data.mapping_name}</code>
        </pre>
      ),
    });
    setDialogStatus(2);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-auto space-y-6">
        <FormField
          control={form.control}
          name="mapping_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                建图数据包
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择..." />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="h-auto">
                  {bags.map((bag, index) => (
                    <SelectItem key={index} value={bag.name}>
                      {bag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>请选择你的建图数据包</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
};

interface ItemProps {
  bags: Map_bag[];
}

const Item: React.FC<ItemProps> = ({ bags }) => {
  const [DialogStatus, setDialogStatus] = useState(0);
  function handlefalse() {
    setDialogStatus(1);
  }

  function handletrue() {
    fetch("http://192.168.2.112:8888/api/work/ClearMappingCache", {
      method: "POST",
    })
      .then((response) => {
        // 检查响应的状态码
        if (!response.ok) {
          throw new Error("HTTP 状态" + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // 处理响应数据
        let Clear_data = data.data;
        console.log(Clear_data);
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
    setDialogStatus(1);
  }

  function handleCancel() {
    setDialogStatus(0);
  }

  switch (DialogStatus) {
    case 0:
      return (
        <div>
          <AlertDialogCancel
            onClick={handleCancel}
            className="absolute border-none	right-4 top-4 rounded-sm opacity-70  transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            ❌
          </AlertDialogCancel>
          <AlertDialogHeader>
            <AlertDialogTitle>清空缓存</AlertDialogTitle>

            <AlertDialogDescription>
              是否需要清理缓存建图文件夹?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-wrap gap-3 mt-5">
            <Button onClick={handletrue} className="w-auto">
              是
            </Button>
            <Button onClick={handlefalse} className="w-auto">
              否
            </Button>
          </AlertDialogFooter>
        </div>
      );
    case 1:
      return (
        <div>
          <SelectForm bags={bags} setDialogStatus={setDialogStatus} />
        </div>
      );
    case 2:
      return (
        <div>
          <LoadingMapping setDialogStatus={setDialogStatus} />
        </div>
      );
    case 3:
      return (
        <div>
          <DisplayCompletedMap setDialogStatus={setDialogStatus} />
        </div>
      );

    default:
      return <div></div>;
  }
};

interface MappingBtnProps {
  bags: Map_bag[];
}

const MappingBtn: React.FC<MappingBtnProps> = ({ bags }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="w-auto mx-auto">
          开始建图
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Item bags={bags} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Map_Manager = () => {
  const [status, setStatus] = useState(1);
  const [maps, setMaps] = React.useState<Map_AGV[]>([]);
  let map_list: Map_AGV[] = [];

  const [bags, setBags] = React.useState<Map_bag[]>([]);
  let bags_list: Map_bag[] = [];

  // 使用 useSWR，传入一个 URL，一个获取数据的函数，和一些选项
  const fetcher = (...args: [string, RequestInit?]) =>
    fetch(...args).then((res) => res.json());
  // 定义一个常量，用于存储 API 的 URL
  const {
    data: mapsData,
    error: mapsError,
    isLoading: mapsLoading,
  } = useSWR("http://192.168.2.112:8888/api/info/GetAllMapsName", fetcher, {
    refreshInterval: 1000,
    refreshWhenHidden: false,
  });

  const {
    data: bagsData,
    error: bagsError,
    isLoading: bagsLoading,
  } = useSWR(
    "http://192.168.2.112:8888/api/info/GetAllMappingBagsName",
    fetcher,
    {
      refreshInterval: 1000,
      refreshWhenHidden: false,
    }
  );

  useEffect(() => {
    if (mapsData && mapsData.data.maps) {
      // 处理地图数据
      let map_data = mapsData.data.maps;
      for (const name of map_data) {
        map_list.push({
          name: name,
        });
      }
      setMaps(map_list);
    }

    if (bagsData && bagsData.data.bags) {
      // 处理建图数据包数据
      let bag_data = bagsData.data.bags;
      const bags_list = bag_data.map((item: string) => ({
        name: item,
      }));
      setBags(bags_list);
    }
  }, [mapsData, bagsData]);
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-5">
        <Card className="flex-1  flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>建图数据</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns_bag} data={bags} />
            </CardContent>
          </div>

          <CardFooter>
            <AlertDialogBtn status={status} setStatus={setStatus} />
          </CardFooter>
        </Card>

        <Card className="flex-1 flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>地图数据</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={maps} />
            </CardContent>
          </div>

          <CardFooter>
            <MappingBtn bags={bags} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Map_Manager;
