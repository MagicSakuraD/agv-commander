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
import MapMarker from "./map/map-marker";
import {
  icp_qualityAtom,
  slam_posAtom,
  loc_posAtom,
  ros_RunningAtom,
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
  const [dataMap, setDataMap] = useState<string | null>(null);
  const [rpi_temperature, setRpi_temperature] = useState<number>(0);
  const [icp_quality, setIcp_quality] = useAtom(icp_qualityAtom);
  const [slam_pos, setSlam_pos] = useAtom(slam_posAtom);
  const [loc_pos, setLoc_pos] = useAtom(loc_posAtom);
  const [ros_Running, setRos_Running] = useAtom(ros_RunningAtom);
  const [isRecord, setIsRecord] = useState(0);
  const [RecordContext, setRecordContext] = useState<string>("记录debug");
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
          "http://192.168.2.112:5000/api/info/CurrentMapUsePngData",
          {
            method: "GET",
          }
        );
        const image_data = await response.json();
        const imageUrl = `data:image/png;base64,${image_data.data}`;
        setDataMap(imageUrl);

        let response_Name = await fetch(
          "http://192.168.2.112:5000/api/info/CurrentMapUsePngInfo",
          {
            method: "GET",
          }
        );

        let data_Name = await response_Name.text();
        let data_png = JSON.parse(data_Name);
        setPng_x(data_png.data.x);
        setPng_y(data_png.data.y);
        setResolution(data_png.data.resolution);

        const socket = io("http://192.168.2.114:5001");
        socket.on("transmit_data", (data) => {
          // setRos_Running(data.location_record_is_running);
          setRpi_temperature(data.rpi_temperature);
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

  useROSLIB();
  // const message_AGV = useMqtt(mqttConfig, "/heart/5003");
  const message_AGV = slam_pos;
  const AGV_Object = JSON.parse(
    message_AGV ? JSON.stringify(message_AGV) : "{}"
  );

  const Local_Object = JSON.parse(loc_pos ? JSON.stringify(loc_pos) : "{}");
  let Local_point = [Local_Object.x, Local_Object.y];
  let AGV_point = [AGV_Object.x, AGV_Object.y];
  let angle = AGV_Object.yaw;

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

  const Simple = L.CRS.Simple;
  const w = img.naturalWidth; // 图片宽度
  const h = img.naturalHeight; // 图片高度

  const bounds: [[number, number], [number, number]] = [
    [png_x * 10 * resolution, png_y * 10 * resolution], // 左上角经纬度坐标
    [(png_x * 10 + w) * resolution, (png_y * 10 + h) * resolution], // 右下角经纬度坐标
  ];

  // 定义坐标点

  let points: Array<[number, number]> = [];
  if (message !== null) {
    let data = MapData(message);
    points = data ? data.map((value) => xyToLatLng(value)) : [];
    // setPoints(points);
  }
  const customIcon = L.icon({
    iconUrl: "/dot.png",
    iconSize: [20, 20],
  });

  const endIcon = L.icon({
    iconUrl: "/rounded-rectangle.png",
    iconSize: [30, 30],
  });
  // console.log(points);

  let startPoints = points ? points[0] : ([0, 0] as [number, number]);
  // console.log(startPoints);
  let endPoints =
    points && points.length >= 2
      ? points[points.length - 1]
      : ([0, 0] as [number, number]);

  function MyClick() {
    const map = useMapEvent("click", (e) => {
      const popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(`(${e.latlng.lng.toFixed(2)}, ${e.latlng.lat.toFixed(2)})`);
      popup.openOn(map);
    });

    return null;
  }

  async function handleRecord() {
    let bodyContent = new FormData();
    bodyContent.append("btn_value", `${isRecord}`);
    if (isRecord === 0) {
      setIsRecord(1);
      setRecordContext("停止记录");
      setRecordColor("destructive");
    } else {
      setIsRecord(0);
      setRecordContext("记录debug");
      setRecordColor("default");
    }
    let response_btn = await fetch(
      "http://192.168.2.114:5001/monitor/record_data",
      {
        method: "POST",
        body: bodyContent,
      }
    );
    let data_btn = await response_btn.text();
    console.log(data_btn, "👌");
  }
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
        <MapContainer
          center={{ lat: 0, lng: 0 }}
          zoom={5}
          minZoom={3}
          maxZoom={8}
          scrollWheelZoom={true}
          crs={Simple}
          className="rounded-lg w-full h-[30rem] z-0 "
        >
          <Grid />

          <ImageOverlay url={img.src} bounds={bounds} />
          <MyClick />
          {points.length > 1 && (
            <>
              <Polyline
                pathOptions={{
                  color: "#0c0a09",
                  weight: 8,
                }}
                positions={points}
              />
              <Marker
                // position={[startPoints[0] - 16, startPoints[1] + 15]}
                position={startPoints}
                icon={customIcon}
              >
                <Popup>起点</Popup>
              </Marker>
              <Marker
                // position={[endPoints[0] - 10, endPoints[1] + 10]}
                position={endPoints}
                icon={endIcon}
              >
                <Popup>终点</Popup>
              </Marker>
            </>
          )}

          {/* {currentTrack && <MapMarker data={currentTrack} />} */}
          {AGV_point_real && <MapMarker data={AGV_point_real} angle={angle} />}
          <ScaleControl position="bottomleft" metric={true} imperial={false} />
          {/* <CustomScaleControl /> */}
        </MapContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3 justify-between">
        <Card className="flex-1 h-36">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="opacity-75 text-sm">SLAM坐标</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="scroll-m-20 text-xl font-semibold tracking-tight">
              <ul>
                <li>
                  x:<b className="ml-1">{AGV_point[0]?.toFixed(2)}</b>
                </li>
                <li>
                  y:<b className="ml-1">{AGV_point[1]?.toFixed(2)}</b>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 h-36">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="opacity-75 text-sm">LOC坐标</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 text-muted-foreground"
            >
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="scroll-m-20 text-xl font-semibold tracking-tight">
              <ul>
                <li>
                  x:<b className="ml-1">{Local_point[0]?.toFixed(2)}</b>
                </li>
                <li>
                  y:<b className="ml-1">{Local_point[1]?.toFixed(2)}</b>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1   h-36 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="opacity-75 text-sm">匹配度</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-4 h-4 text-muted-foreground"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="scroll-m-20 text-xl font-semibold tracking-tight">
              {/* <CardDescription>评估AGV定位系统质量的重要指标</CardDescription> */}
              <div className="mt-4">{(icp_quality * 100).toFixed(2)}%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1   h-36 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="opacity-75 text-sm">温度</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-4 h-4 text-muted-foreground"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="scroll-m-20 text-xl font-semibold tracking-tight">
              {/* <CardDescription>评估AGV定位系统质量的重要指标</CardDescription> */}
              <div className="mt-4">{rpi_temperature}℃</div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1  h-36">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="opacity-75 text-sm">定位控制</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-4 h-4 text-muted-foreground"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="scroll-m-20 text-xl font-semibold tracking-tight">
              <CardDescription>重启定位程序和记录debug定位数据</CardDescription>
              <div className="flex justify-between mt-2">
                <Button variant={RecordColor} onClick={handleRecord}>
                  {RecordContext}
                </Button>
                <AlertDialogDemo />
              </div>
            </div>
          </CardContent>
        </Card>
      </CardFooter>
    </>
  );
};

export default MapPage;
