import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Nodelist from "./nodelist";

const NodePage = () => {
  return (
    <div className="md:container px-2 mx-auto pt-5 flex flex-wrap gap-5 justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>ROS节点</CardTitle>
          <CardDescription>节点运行状态</CardDescription>
        </CardHeader>
        <CardContent>
          <Nodelist />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default NodePage;
