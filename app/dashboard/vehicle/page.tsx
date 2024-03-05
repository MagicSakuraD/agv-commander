"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameThree, RobotOne } from "@icon-park/react";
import { Home } from "@icon-park/react";

export default function VehiclePage() {
  return (
    <div className="md:container px-2 mx-auto pt-5">
      <Card>
        <CardHeader>
          <CardTitle>控制模式</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-10">
          <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem
                value="Manual"
                id="Manual"
                className="peer sr-only"
              />
              <Label
                htmlFor="Manual"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <GameThree
                  className="mb-3"
                  theme="two-tone"
                  size="40"
                  fill={["#333", "#22c55e"]}
                />
                手动模式
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="Automatic"
                id="Automatic"
                className="peer sr-only"
              />
              <Label
                htmlFor="Automatic"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <RobotOne
                  className="mb-3"
                  theme="two-tone"
                  size="40"
                  fill={["#333", "#22c55e"]}
                />
                自动模式
              </Label>
            </div>
          </RadioGroup>

          <div className="grid gap-2">
            <Label htmlFor="month">选择任务文件</Label>
            <Select>
              <SelectTrigger id="month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Continue</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
