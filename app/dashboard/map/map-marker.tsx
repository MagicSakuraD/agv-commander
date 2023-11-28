import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import { useEffect, useState } from "react";
import L from "leaflet";

const icon = L.icon({
  iconSize: [20, 20],

  iconUrl: "/AGV.png",
});

interface MapMarkerProps {
  data: [number, number];
  angle: number; // Add this line
}

export default function MapMarker({ data }: MapMarkerProps, angle: number) {
  const [latitude, longitude] = data;
  const [prevPos, setPrevPos] = useState([latitude, longitude]);

  useEffect(() => {
    if (prevPos[1] !== longitude && prevPos[0] !== latitude)
      setPrevPos([latitude, longitude]);
  }, [latitude, longitude, prevPos]);

  return (
    <LeafletTrackingMarker
      icon={icon}
      position={[latitude, longitude]}
      previousPosition={prevPos as L.LatLngExpression}
      duration={1000}
      rotationAngle={angle}
    />
  );
}
