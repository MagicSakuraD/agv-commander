"use client";
import React, { Children, ReactNode, useEffect, useState } from "react";
import L from "leaflet";
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
  LayerGroup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Grid from "./map/grid";
import MapMarker from "./map/map-marker";
import useROSLIB from "./mqtt/roslib";
import {
  icp_qualityAtom,
  slam_posAtom,
  loc_posAtom,
  ros_RunningAtom,
  temperatureAtom,
  MapNameAtom,
  markerlistAtom,
  carShowAtom,
} from "@/lib/atoms";
import { useAtom } from "jotai";
import useSocket from "./mqtt/socket";
import { io } from "socket.io-client";
import PointMarker from "./tabs/(InitPose)/PointMarker";

function MyClick() {
  const map = useMapEvent("click", (e) => {
    const popup = L.popup()
      .setLatLng(e.latlng)
      .setContent(`(${e.latlng.lng.toFixed(2)}, ${e.latlng.lat.toFixed(2)})`);
    popup.openOn(map);
  });

  return null;
}

interface MapMarkerProps {
  points: [number, number][];
  AGV_point_real: [number, number] | null;
  angle: any;
}

const LeafletMap: React.FC<MapMarkerProps> = ({
  points,
  AGV_point_real,
  angle,
}) => {
  const [png_x, setPng_x] = useState<number>(0);
  const [png_y, setPng_y] = useState<number>(0);
  const [resolution, setResolution] = useState<number>(0);
  const [rpi_temperature, setRpi_temperature] = useAtom(temperatureAtom);
  const [MapName, setMapName] = useAtom(MapNameAtom);
  const [markerlist, setMarkerlist] = useAtom(markerlistAtom);
  const [carShow, setCarShow] = useAtom(carShowAtom);

  // Create a new image object
  const img = new Image();
  // Set the source of the image to the PNG file
  img.src = MapName;

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
        if (image_data.code === 0) {
          const imageUrl = `data:image/png;base64,${image_data.data}`;
          setMapName(imageUrl);
        }

        let response_Name = await fetch(
          "http://192.168.2.112:8888/api/info/CurrentMapUsePngInfo",
          {
            method: "GET",
          }
        );

        let data_png = await response_Name.json();
        if (data_png.code === 0) {
          setPng_x(Number(data_png.data.x));
          setPng_y(Number(data_png.data.y));
          setResolution(Number(data_png.data.resolution));
        }

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
  }, [MapName]);

  const Simple = L.CRS.Simple;
  let startPoints = points ? points[0] : ([0, 0] as [number, number]);
  // console.log(startPoints);
  let endPoints =
    points && points.length >= 2
      ? points[points.length - 1]
      : ([0, 0] as [number, number]);

  const customIcon = L.icon({
    iconUrl: "/dot.png",
    iconSize: [20, 20],
  });

  const endIcon = L.icon({
    iconUrl: "/rounded-rectangle.png",
    iconSize: [30, 30],
  });
  useROSLIB();

  // Define a function to get the width and height
  const w = img?.naturalWidth; // 图片宽度
  const h = img?.naturalHeight; // 图片高度
  // console.log(png_x, w, resolution, png_x + w * resolution, "👌");
  const bounds: [[number, number], [number, number]] = [
    [png_x * 10 * resolution, png_y * 10 * resolution], // 左上角经纬度坐标
    [(png_x * 10 + w) * resolution, (png_y * 10 + h) * resolution], // 右下角经纬度坐标
    // [w * resolution + png_x, h * resolution + png_y], // 右上角经纬度坐标
    // [png_x, png_y], // 左下角经纬度坐标
  ];

  return (
    <div>
      <MapContainer
        center={[0, 0]}
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

        {/* {markerlist.length >= 2 && AGV_point_real && (
          <>
            <PointMarker /> <MapMarker data={AGV_point_real} angle={angle} />
          </>
        )}
        {AGV_point_real && carShow && (
          <MapMarker data={AGV_point_real} angle={angle} />
        )} */}
        {AGV_point_real && <MapMarker data={AGV_point_real} angle={angle} />}
        <LayersControl position="topright">
          <LayersControl.Overlay name="初始化点">
            <LayerGroup>
              <PointMarker />
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <ScaleControl position="bottomleft" metric={true} imperial={false} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
