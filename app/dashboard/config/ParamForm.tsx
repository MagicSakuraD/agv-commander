"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "@/components/ui/use-toast";
import { FileNameAtom, fileDataAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { GetConfigContent, changeFileContent } from "@/lib/actions";
import { parseArray } from "./page";

export type form_params = {
  file_name: string;
  line_number: string;
  new_content: string;
};

const formSchema = z.object({
  id: z.string(),
  param_name: z.string(),
  param_value: z.string(),
  param_comment: z.string(),
});

interface ParamFormProps {
  id: string;
  param_name: string;
  param_value: string;
  param_comment: string;
}

const ParamForm: React.FC<ParamFormProps> = ({
  id,
  param_name,
  param_value,
  param_comment,
}) => {
  const [fileName, setFileName] = useAtom(FileNameAtom);
  const [fileData, setFileData] = useAtom(fileDataAtom);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id,
      param_name: param_name,
      param_value: param_value,
      param_comment: param_comment,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const form_body: form_params = {
      file_name: "", // replace with actual value
      line_number: "",
      new_content: "",
    };
    form_body.line_number = values.id;
    form_body.new_content =
      values.param_name +
      ":" +
      values.param_value +
      (values.param_comment ? "#" + values.param_comment : "");
    form_body.file_name = fileName;
    console.log(form_body);
    const res = await changeFileContent(form_body);
    if (res) {
      const response = await GetConfigContent(fileName);
      let parsed = parseArray(response);
      console.log(parsed);
      setFileData(parsed);
      toast({
        title: "消息📢",
        description: res,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>序号</FormLabel>
              <FormControl>
                <Input placeholder="不可修改" {...field} disabled />
              </FormControl>
              <FormDescription>固定值,不可修改</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="param_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>参数名</FormLabel>
              <FormControl>
                <Input placeholder="不可修改" {...field} disabled />
              </FormControl>
              <FormDescription>固定值,不可修改</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="param_comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>注释</FormLabel>
              <FormControl>
                <Input placeholder="不可修改" {...field} disabled />
              </FormControl>
              <FormDescription>固定值,不可修改</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="param_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>参数值</FormLabel>
              <FormControl>
                <Input placeholder="请输入参数值" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit">Submit</Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default ParamForm;
