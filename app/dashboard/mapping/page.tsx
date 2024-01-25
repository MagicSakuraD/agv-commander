import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

const MappingPage = () => {
  return (
    <div className="container mx-auto pt-5 flex flex-wrap gap-5 justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>采集数据</CardTitle>
          <CardDescription>AGV建图数据包</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>{/* <AlertDialogBtn /> */}</CardFooter>
      </Card>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>处理数据</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>参数配置</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      {/* <div>
        <AlertDialogHeader>
          <AlertDialogTitle>是否保存地图❓</AlertDialogTitle>
          <div ref={screenRef} className="w-3/5">
            <Image
              src={`data:image/png;base64,${imgdata}`}
              layout="fill"
              objectFit="cover" // 保持图片的宽高比
              alt="地图图片"
            />
            <FullscreenButton />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleGiveUp}>不保存</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>保存</AlertDialogAction>
        </AlertDialogFooter>
      </div> */}
    </div>
  );
};

export default MappingPage;
