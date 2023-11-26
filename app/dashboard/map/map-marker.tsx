import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import { useEffect, useState } from "react";
import L from "leaflet";

const icon = L.icon({
  iconSize: [30, 30],

  iconUrl: "/compass.png",
});

interface MapMarkerProps {
  data: number[];
}

export default function MapMarker({ data }: MapMarkerProps) {
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
    />
  );
}
