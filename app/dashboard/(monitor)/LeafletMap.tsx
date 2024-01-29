"use client";
import React, { Children, ReactNode } from "react";
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
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Grid from "./map/grid";
import MapMarker from "./map/map-marker";
import useROSLIB from "./mqtt/roslib";

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
  img: HTMLImageElement;
  bounds: [[number, number], [number, number]];
  points: [number, number][];
  AGV_point_real: [number, number] | null;
  angle: any;
}

const LeafletMap: React.FC<MapMarkerProps> = ({
  img,
  bounds,
  points,
  AGV_point_real,
  angle,
}) => {
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

        {AGV_point_real && <MapMarker data={AGV_point_real} angle={angle} />}
        <ScaleControl position="bottomleft" metric={true} imperial={false} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
