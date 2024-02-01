import { atom } from "jotai";

export const icp_qualityAtom = atom(0); // 创建一个初始值为 0 的原子状态
export const slam_posAtom = atom<{ x: number; y: number }>({
  x: 0,
  y: 0,
});
export const loc_posAtom = atom<{ x: number; y: number; degree: number }>({
  x: 0,
  y: 0,
  degree: 0,
});

export const ros_RunningAtom = atom(true);
export const temperatureAtom = atom(0);

export const checkAtom = atom(true);
export const successAtom = atom(true);

export const bagnameAtom = atom("");
export const MapNameAtom = atom("");
export const startAtom = atom(-1);
export const markerlistAtom = atom([{ x: 0, y: 0, yaw: 0 }]);
