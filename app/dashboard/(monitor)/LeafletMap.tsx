"use client";
import L from "leaflet";
import dynamic from "next/dynamic";
import { Children, ReactNode } from "react";

// 动态导入 MapContainer 组件，禁用 SSR
const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

// 在你的组件中使用 DynamicMapContainer 替代 MapContainer
function MyComponent({ children }: { children: ReactNode }) {
  const Simple = L.CRS.Simple;
  return (
    <DynamicMapContainer
      center={{ lat: 0, lng: 0 }}
      zoom={5}
      minZoom={3}
      maxZoom={8}
      scrollWheelZoom={true}
      crs={Simple}
      className="rounded-lg w-full h-[30rem] z-0 "
    >
      {children}
    </DynamicMapContainer>
  );
}

export default MyComponent;
