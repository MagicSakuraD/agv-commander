"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import React, { useEffect, useState } from "react";
import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EditTwo } from "@icon-park/react";
import { PlanningTaskFile } from "./columns";
import { GetPlanningTaskFile } from "@/lib/actions";
import { cn } from "@/lib/utils";

const profileFormSchema = z.object({
  taskName: z.array(
    z.object({
      value: z.string(),
    })
  ),
});

const TaskEditor = (task_name: PlanningTaskFile) => {
  const [taskArry, setTaskArry] = useState([]); // [task_name, setTaskName] = useState("defaultTaskName" as string);
  let filename = task_name.name.split("/").pop();
  type ProfileFormValues = z.infer<typeof profileFormSchema>;
  let transformedData: { value: string }[] = [];
  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    taskName: transformedData, // replace "defaultTaskName" with your actual default task name
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "taskName", // 注意这里
    control: form.control,
  });

  useEffect(() => {
    // Call the function that updates Router's state here
    GetPlanningTaskFile(task_name).then((subtask_data) => {
      console.log(subtask_data);
      transformedData = subtask_data.data.map((item: string) => ({
        value: item,
      }));
      // setTaskArry(transformedData);
      console.log(transformedData);
    });
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {/* <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm hover:text-green-600"> */}
          <EditTwo theme="two-tone" size="16" fill={["#333", "#22c55e"]} />
          修改
          {/* </span> */}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>任务：{filename}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`taskName.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      决策动作
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add links to your website, blog, or social media profiles.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Submit</Button>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditor;
