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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ValuesTpye } from "./mqtt/mqttComponent";
import { useEffect, useState } from "react";
import CustomScaleControl from "./map/ScaleControl";
import Grid from "./map/grid";

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 第一个请求
        const response1 = await fetch("http://192.168.2.114:5001/map/manager", {
          method: "POST",
        });
        const data1 = await response1.json();
        const current_maps = data1.current_maps.split(" # ")[0];

        // 使用第一个请求的返回值作为第二个请求的参数
        const bodyContent = new FormData();
        bodyContent.append("mergemap_file_name", current_maps);

        // 第二个请求
        const response2 = await fetch(
          "http://192.168.2.114:5001/map/getmergemap",
          {
            method: "POST",
            body: bodyContent,
          }
        );
        const data2 = await response2.blob();
        const imageUrl = URL.createObjectURL(data2);
        setDataMap(imageUrl);
      } catch (error) {
        console.log(error, "😵");
      }
    };

    fetchData();
  }, []);

  const message = useMqtt(values, topicMqtt);

  const message_AGV = useMqtt(mqttConfig, "/heart/5003");
  const AGV_Object = JSON.parse(message_AGV ? message_AGV : "{}");

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

  const x0 = w / 2; // x0为图片中心点的x坐标
  const y0 = h / 2; // y0为图片中心点的y坐标

  const bounds: [[number, number], [number, number]] = [
    [-x0, -y0], // 左上角经纬度坐标
    [x0, y0], // 右下角经纬度坐标
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
        .setContent(`坐标${e.latlng.toString().substring(6)}`);
      popup.openOn(map);
    });

    return null;
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          系统监控
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MapContainer
          center={{ lat: x0 / 2, lng: y0 / 2 }}
          zoom={0}
          minZoom={0}
          maxZoom={5}
          scrollWheelZoom={true}
          crs={Simple}
          className="rounded-lg w-full h-[30rem] z-0"
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
          <ScaleControl position="bottomright" metric={true} imperial={false} />
          <CustomScaleControl />
        </MapContainer>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="opacity-75 text-sm">AGV坐标</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
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
        {/* <Card>
          <CardHeader>
            <CardTitle className="opacity-75 text-sm">AGV速度</CardTitle>
          </CardHeader>
          <CardContent>
            <div>0.15 m/s</div>
          </CardContent>
        </Card> */}
      </CardFooter>
    </>
  );
};

export default MapPage;
