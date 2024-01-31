"use client";
import ROSLIB from "roslib";
import { use, useEffect, useState } from "react";
import {
  icp_qualityAtom,
  slam_posAtom,
  loc_posAtom,
  ros_RunningAtom,
} from "../atoms";
import { useAtom } from "jotai";

export interface ICPQualityMessage extends ROSLIB.Message {
  data: number;
}

export interface SlamPosMessage extends ROSLIB.Message {
  pose: {
    pose: {
      position: {
        x: number;
        y: number;
        degree: number;
      };
    };
  };
}
export default function useROSLIB() {
  const [icp_quality, setIcp_quality] = useAtom(icp_qualityAtom);
  const [slam_pos, setSlam_pos] = useAtom(slam_posAtom);
  const [loc_pos, setLoc_pos] = useAtom(loc_posAtom);

  const [ros_Running, setRos_Running] = useAtom(ros_RunningAtom);
  useEffect(() => {
    let ros = new ROSLIB.Ros({ url: "ws://192.168.2.114:9090" });
    ros.on("connection", function () {
      console.log("连接ros成功✅");
      setRos_Running(true);
    });

    ros.on("error", function (error) {
      console.log("断开连接❌", error);
      setRos_Running(false);
    });
    ros.on("close", function () {
      console.log("系统关闭🔌");
      setRos_Running(false);
    });
    // 接收到icp 质量信号
    const listener_icp_quality = new ROSLIB.Topic({
      ros: ros,
      name: "/lidar_localization_node/icp_quality",
      messageType: "std_msgs/Float64",
    });

    listener_icp_quality.subscribe(function (message: ROSLIB.Message) {
      setIcp_quality((message as ICPQualityMessage).data);
    });

    // 接收到slam定位结果
    const listener_slam_pos = new ROSLIB.Topic({
      ros: ros,
      name: "/lidar_localization_node/map_matching_result/utm",
      messageType: "nav_msgs/Odometry",
    });

    listener_slam_pos.subscribe(function (message: ROSLIB.Message) {
      setSlam_pos((message as SlamPosMessage).pose.pose.position);
      // console.log((message as SlamPosMessage).pose.pose.position);
    });

    // 接收到loc定位结果
    const listener_loc_pos = new ROSLIB.Topic({
      ros: ros,
      name: "/localization/estimation",
      messageType: "cyber_msgs/LocalizationEstimate",
    });

    listener_loc_pos.subscribe(function (message: ROSLIB.Message) {
      setLoc_pos({
        x: (message as any).pose.position.x,
        y: (message as any).pose.position.y,
        degree: (message as any).acceleration.angular.x,
      });
    });
  }, []);
}
