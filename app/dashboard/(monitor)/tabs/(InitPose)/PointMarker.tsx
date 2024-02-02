"use client";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import { useEffect, useState } from "react";
import L from "leaflet";
import React from "react";
import { useAtom } from "jotai";
import { markerlistAtom } from "@/lib/atoms";

const icon = L.icon({
  iconSize: [20, 20],

  iconUrl: "/compass.png",
});

interface MapMarkerProps {
  //   data: [number, number];
  x: number;
  y: number;
  yaw: number; // Add this line
}

export function MapMarker({ x, y, yaw }: MapMarkerProps) {
  const [latitude, longitude] = [x, y];
  //   const [prevPos, setPrevPos] = useState([latitude, longitude]);
  //   const [prevAngle, setPrevAngle] = useState(angle);

  //   useEffect(() => {
  //     if (prevPos[1] !== longitude || prevPos[0] !== latitude)
  //       setPrevPos([latitude, longitude]);
  //   }, [latitude, longitude, prevPos]);

  //   useEffect(() => {
  //     if (prevAngle !== angle) setPrevAngle(angle);
  //   }, [angle, prevAngle]);

  return (
    <LeafletTrackingMarker
      icon={icon}
      position={[latitude, longitude]}
      //   previousPosition={prevPos as L.LatLngExpression}
      duration={1000}
      rotationAngle={yaw}
    />
  );
}

const PointMarker = () => {
  const [markerlist, setMarkerlist] = useAtom(markerlistAtom);
  return (
    <div>
      {markerlist.map((marker) => (
        <MapMarker key={marker.id} x={marker.x} y={marker.y} yaw={marker.yaw} />
      ))}
    </div>
  );
};

export default PointMarker;