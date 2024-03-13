"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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

import React, { useEffect } from "react";
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

const formSchema = z.object({
  taskName: z.string().array().nonempty({
    message: "不能为空!",
  }),
});

const TaskEditor = (task_name: PlanningTaskFile) => {
  let filename = task_name.name.split("/").pop();

  type ProfileFormValues = z.infer<typeof formSchema>;

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    taskName: [""], // replace "defaultTaskName" with your actual default task name
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "taskName",
  // });

  useEffect(() => {
    // Call the function that updates Router's state here
    const subtask_data = GetPlanningTaskFile(task_name);
    console.log(subtask_data);
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
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
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>决策动作</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
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
