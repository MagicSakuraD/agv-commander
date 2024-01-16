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

const AlertDialogBtn = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full">
        <Button variant="default" className="w-full">
          记录建图数据
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#dc2626"
              className="bi bi-exclamation-circle-fill w-6 h-6"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
            </svg>
            <p className="text-red-500">注意事项</p>
          </AlertDialogTitle>
          <div className="text-sm text-muted-foreground">
            <p className="py-2">
              1.建图操作时尽量在初始阶段不要出现太大的晃动与转向，且全程速度不宜过快，录制开始后可在初始点停留
              5 秒左右再进行运动。
            </p>
            <p className="py-2 ">
              2.需记下建图时的起始点，本套定位程序采用固定点初始化，建图时的起始点即为定位时的初始化点。
            </p>
            <p className="py-2 ">
              3.准备完毕后,点击开始录制按钮即可开始记录数据。
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消录制</AlertDialogCancel>
          <AlertDialogAction>开始录制</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

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
        <CardFooter>
          <AlertDialogBtn />
        </CardFooter>
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
    </div>
  );
};

export default MappingPage;
