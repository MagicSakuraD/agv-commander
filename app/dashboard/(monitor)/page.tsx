"use client";

import {
  ImageOverlay,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  ScaleControl,
  useMapEvent,
} from "react-leaflet";
import L, { LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapData } from "./map/data";
import useMqtt from "./mqtt/mqttComponent";

import {
  icp_qualityAtom,
  slam_posAtom,
  loc_posAtom,
  ros_RunningAtom,
  temperatureAtom,
} from "./atoms";
import { useAtom } from "jotai";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ValuesTpye } from "./mqtt/mqttComponent";
import { useEffect, useState } from "react";
import CustomScaleControl from "./map/ScaleControl";
import Grid from "./map/grid";
import useROSLIB from "./mqtt/roslib";
import { set } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import useSocket from "./mqtt/socket";
import { io } from "socket.io-client";
import AlertDialogDemo from "@/components/dashboard/alertDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Suspense } from "react";
import NodeSkeleton from "./NodeSkeleton";
import Nodelist from "./tabs/nodelist";
import Map_Manager from "./tabs/(map-manager)/map-manager";
import Localization from "./localizationBags/Localization";
import ActiveShapePieChart from "./ActiveShapePieChart";
import { columns_bag } from "./tabs/(map-manager)/columns";
import MyComponent from "./LeafletMap";

import dynamic from "next/dynamic";
import Roslib from "./mqtt/roslib";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false, // 禁用服务器端渲染
});

const values: ValuesTpye = {
  host: "h1ee611a.ala.cn-hangzhou.emqxsl.cn",
  port: 8084,
  clientId: "Next_js",
  username: "quinn",
  // password: process.env.MY_PASS,
  password: "emqx201227",
  protocol: "wss",
};

const topicMqtt: string = "testtopic/2";

const mqttConfig: ValuesTpye = {
  host: "192.168.2.114",
  port: 8083,
  clientId: "Next_js",
  protocol: "ws",
};

type AGV_point = {
  x: number;
  y: number;
};
// Create a new image object
const img = new Image();
//页面jsx
const MapPage = () => {
  const { toast } = useToast();
  const [dataMap, setDataMap] = useState<string | null>(null);
  const [rpi_temperature, setRpi_temperature] = useAtom(temperatureAtom);
  const [icp_quality, setIcp_quality] = useAtom(icp_qualityAtom);
  const [slam_pos, setSlam_pos] = useAtom(slam_posAtom);
  const [loc_pos, setLoc_pos] = useAtom(loc_posAtom);
  const [ros_Running, setRos_Running] = useAtom(ros_RunningAtom);
  const [isRecord, setIsRecord] = useState(0);
  const [Record_ok, setRecord_ok] = useState(0);
  const [RecordContext, setRecordContext] = useState<string>("记录定位数据");
  const [RecordColor, setRecordColor] = useState<
    "default" | "link" | "destructive" | "outline" | "secondary" | "ghost"
  >("default");
  const [png_x, setPng_x] = useState<number>(0);
  const [png_y, setPng_y] = useState<number>(0);
  const [resolution, setResolution] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "http://192.168.2.112:8888/api/info/CurrentMapUsePngData",
          {
            method: "GET",
          }
        );
        const image_data = await response.json();
        const imageUrl = `data:image/png;base64,${image_data.data}`;
        setDataMap(imageUrl);

        let response_Name = await fetch(
          "http://192.168.2.112:8888/api/info/CurrentMapUsePngInfo",
          {
            method: "GET",
          }
        );

        let data_Name = await response_Name.text();
        let data_png = JSON.parse(data_Name);
        setPng_x(Number(data_png.data.x));
        setPng_y(Number(data_png.data.y));
        setResolution(Number(data_png.data.resolution));

        const socket = io("http://192.168.2.114:5001");
        socket.on("transmit_data", (data) => {
          // setRos_Running(data.location_record_is_running);
          setRpi_temperature(data.rpi_temperature);
          // console.log(data.rpi_temperature, "👌");
        });
        socket.on("status", (data) => {
          socket.emit("start");
        });

        // useSocket();
      } catch (error) {
        console.log(error, "地图获取失败😵");
      }
    };

    fetchData();
  }, []);

  const message = useMqtt(values, topicMqtt);
  // const message = null;

  // const message_AGV = useMqtt(mqttConfig, "/heart/5003");
  const message_AGV = slam_pos;
  const AGV_Object = JSON.parse(
    message_AGV ? JSON.stringify(message_AGV) : "{}"
  );

  const Local_Object = JSON.parse(loc_pos ? JSON.stringify(loc_pos) : "{}");
  let Local_point = [Local_Object.x, Local_Object.y];
  let AGV_point = [AGV_Object.x, AGV_Object.y];
  let angle = Local_Object.degree.toFixed(2);

  // 创建一个函数来转换[x, y]坐标到[y, x]
  const xyToLatLng = (xy: [number, number]): [number, number] => [xy[1], xy[0]];

  // 实时车辆坐标
  let AGV_point_real: [number, number] | null = null;
  if (typeof AGV_Object.x === "number" && typeof AGV_Object.y === "number") {
    AGV_point_real = xyToLatLng(AGV_point as [number, number]);
    AGV_point_real = AGV_point_real.map((value) => Math.round(value)) as [
      number,
      number
    ];
  }

  // Set the source of the image to the PNG file
  img.src = dataMap ? dataMap : "/baidu.png";

  // Define a function to get the width and height
  const w = img.naturalWidth; // 图片宽度
  const h = img.naturalHeight; // 图片高度
  // console.log(png_x, w, resolution, png_x + w * resolution, "👌");
  const bounds: [[number, number], [number, number]] = [
    [png_x * 10 * resolution, png_y * 10 * resolution], // 左上角经纬度坐标
    [(png_x * 10 + w) * resolution, (png_y * 10 + h) * resolution], // 右下角经纬度坐标
    // [w * resolution + png_x, h * resolution + png_y], // 右上角经纬度坐标
    // [png_x, png_y], // 左下角经纬度坐标
  ];

  // 定义坐标点

  let points: Array<[number, number]> = [];
  if (message !== null) {
    let data = MapData(message);
    points = data ? data.map((value) => xyToLatLng(value)) : [];
    // setPoints(points);
  }

  // console.log(points);

  async function handleRecord() {
    // 获取当前日期并转换为字符串
    let currentDate = new Date();
    let dateString = currentDate.toISOString().slice(0, 10); // 格式为 "YYYY-MM-DD"

    // 获取当前的小时、分钟和秒数
    let timeString =
      currentDate.getHours().toString().padStart(2, "0") +
      ":" +
      currentDate.getMinutes().toString().padStart(2, "0") +
      ":" +
      currentDate.getSeconds().toString().padStart(2, "0"); // 格式为 "HH:MM:SS"

    // 将日期字符串和时间字符串添加到 "RecordDebugData" 后面
    let nameValue = "RecordDebugData-" + dateString + "_" + timeString;
    setRecord_ok(Record_ok + 1);
    let cmdValue;
    if (isRecord === 0) {
      cmdValue = "start";
      setIsRecord(1);
      setRecordContext("停止记录");
      setRecordColor("destructive");
    } else {
      cmdValue = "stop";
      setIsRecord(0);
      setRecordContext("记录定位数据");
      setRecordColor("default");
    }

    // 创建请求体对象
    let bodyContent = {
      cmd: cmdValue,
      name: nameValue,
    };

    let response_btn = await fetch(
      "http://192.168.2.112:8888/api/config/StartRecordDebugData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyContent),
      }
    );
    let data_Record = await response_btn.text();
    // 将响应文本转换为一个对象
    let responseObj = JSON.parse(data_Record);
    // 检查 'code' 的值
    if (responseObj.code === 0) {
      // 如果 'code' 的值为 0，那么打印 'data' 的值
      console.log(responseObj.data);
      toast({
        description: "✅: " + responseObj.data,
      });
    } else if (responseObj.code === -1) {
      // 如果 'code' 的值为 -1，那么打印一个错误消息
      console.log(responseObj.msg);
      toast({
        description: "❌: " + responseObj.data,
      });
    }
  }

  async function handleRestart() {
    // 创建请求体对象
    let bodyContent = {
      cmd: "start",
    };

    // 发送 POST 请求
    fetch("http://192.168.2.112:8888/api/config/StartLocalization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
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

        if (data.code === 0) {
          // 如果 'code' 的值为 0，那么打印 'data' 的值
          console.log(data.data);
          toast({
            description: "✅: " + data.data,
          });
        } else if (data.code === -1) {
          // 如果 'code' 的值为 -1，那么打印一个错误消息
          console.log(data.msg);
          toast({
            description: "❌: " + data.data,
          });
        }
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }

  async function handleStop() {
    // 创建请求体对象
    let bodyContent = {
      cmd: "stop",
    };

    // 发送 POST 请求
    fetch("http://192.168.2.112:8888/api/config/StartLocalization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
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

        if (data.code === 0) {
          // 如果 'code' 的值为 0，那么打印 'data' 的值
          console.log(data.data);
          toast({
            description: "✅: " + data.data,
          });
        } else if (data.code === -1) {
          // 如果 'code' 的值为 -1，那么打印一个错误消息
          console.log(data.msg);
          toast({
            description: "❌: " + data.data,
          });
        }
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });
  }
  if (typeof window !== "undefined") {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight flex flex-row justify-between">
            <p>系统监控</p>

            <div className="text-sm text-muted-foreground flex flex-row items-center gap-1">
              {ros_Running ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#22c55e"
                    className="bi bi-check-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  <p>运行中</p>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#e11d48"
                    className="bi bi-x-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                  </svg>
                  <p>异常</p>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeafletMap
            img={img}
            bounds={bounds}
            points={points}
            AGV_point_real={AGV_point_real}
            angle={angle}
          ></LeafletMap>
        </CardContent>
        <CardFooter className="">
          <Tabs defaultValue="AGV" className="w-full">
            <TabsList>
              <TabsTrigger value="AGV">AGV定位</TabsTrigger>
              <TabsTrigger value="Node">ROS节点</TabsTrigger>
              <TabsTrigger value="mapmanager">地图管理</TabsTrigger>
            </TabsList>
            <TabsContent value="AGV" className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3 justify-between w-full">
                <Card className="flex-1 h-auto grow ">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="opacity-75 text-sm">
                      SLAM坐标
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="bi bi-broadcast w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight">
                      <ul>
                        <li>
                          x:
                          <b className="ml-1  w-16">
                            {AGV_point[0]?.toFixed(2)} m
                          </b>
                        </li>
                        <li>
                          y:
                          <b className="ml-1  w-16">
                            {AGV_point[1]?.toFixed(2)} m
                          </b>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1 h-auto grow ">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                    <CardTitle className="opacity-75 text-sm">
                      LOC坐标
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="bi bi-geo-alt w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight">
                      <ul>
                        <li>
                          x:
                          <b className="ml-1 w-16">
                            {Local_point[0]?.toFixed(2)} m
                          </b>
                        </li>
                        <li>
                          y:
                          <b className="ml-1 w-16">
                            {Local_point[1]?.toFixed(2)} m
                          </b>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1 h-auto">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="opacity-75 text-sm">角度</CardTitle>
                    <svg
                      className="icon w-4 h-4"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path
                        d="M0 960h1024V1024H0z"
                        fill="currentColor"
                        p-id="2361"
                      ></path>
                      <path
                        d="M581.12 1021.44c-32.768 0-60.416-24.576-63.488-57.856-19.968-207.36-159.744-387.584-356.352-458.752-33.28-11.776-50.176-48.64-38.4-81.92 12.288-33.28 48.64-50.176 81.92-38.4 242.688 88.064 415.232 310.272 439.808 566.272 3.584 35.328-22.528 66.56-57.344 69.632-1.536 0.512-3.584 1.024-6.144 1.024zM628.736 229.376L377.344 83.456 593.92 0z"
                        fill="currentColor"
                        p-id="2362"
                      ></path>
                      <path
                        d="M0.0768 960.12288l512-886.784 55.424 32-512 886.784z"
                        fill="currentColor"
                        p-id="2363"
                      ></path>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight">
                      <div className="mt-4 w-14">{angle}°</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1  h-auto ">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="opacity-75 text-sm">匹配度</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="bi bi-percent w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0M4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight">
                      {/* <CardDescription>评估AGV定位系统质量的重要指标</CardDescription> */}
                      <div className="mt-4 w-14">
                        {(icp_quality * 100).toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1  h-auto ">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="opacity-75 text-sm">温度</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="bi bi-thermometer-low w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585a1.5 1.5 0 0 1 1 1.415" />
                      <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight">
                      <div className="mt-4 w-14">{rpi_temperature}℃</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1  h-auto">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="opacity-75 text-sm">
                      定位数据
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="bi bi-bug w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight">
                      <CardDescription>记录debug定位数据</CardDescription>
                      <div className="flex justify-center mt-2">
                        <Button
                          variant={RecordColor}
                          onClick={handleRecord}
                          className="w-full"
                        >
                          {RecordContext}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1  h-auto grow ">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="opacity-75 text-sm">
                      重启定位
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="bi bi-gear w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight">
                      <CardDescription>启动或关闭定位节点</CardDescription>
                      <div className="flex justify-between mt-2">
                        <Button onClick={handleRestart}>开启定位</Button>
                        <Button variant="secondary" onClick={handleStop}>
                          关闭定位
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>定位数据包</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Localization isRecord={Record_ok} />
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>硬盘空间</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center">
                    <ActiveShapePieChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="Node">
              <Suspense fallback={<NodeSkeleton />}>
                <div>
                  <Nodelist />
                </div>
              </Suspense>
            </TabsContent>

            <TabsContent value="mapmanager">
              <Suspense fallback={<NodeSkeleton />}>
                <div>
                  <Map_Manager />
                </div>
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardFooter>
      </>
    );
  }
};

export default MapPage;
