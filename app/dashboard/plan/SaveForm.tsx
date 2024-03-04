"use client";

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
import { toast } from "@/components/ui/use-toast";
import { mutate } from "swr";

interface SaveFormProps {
  list: any[];
}

const FormSchema = z.object({
  formname: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const SaveForm: React.FC<SaveFormProps> = ({ list }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      formname: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let stringList = list.map(
      (item) => `${item.mainId}|${item.subId}|${item.aciton_value}`
    );

    let resultList = stringList.join(",");
    console.log("保存数据👩", resultList);
    // 创建请求体对象
    let bodyContent = {
      content: resultList,
      name: data.formname,
    };
    // 发送 POST 请求
    fetch("http://192.168.2.112:8888/api/planning/AddPlanningTaskFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    })
      .then((response) => {
        // 检查响应的状态码
        if (!response.ok) {
          throw new Error("HTTP 状态" + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // 处理响应数据

        if (data.code === 0) {
          // 如果 'code' 的值为 0，那么打印 'data' 的值
          console.log(data.data);
          toast({
            title: "消息📢:",
            description: "✅: " + data.msg,
          });
        } else if (data.code === -1) {
          // 如果 'code' 的值为 -1，那么打印一个错误消息
          console.log(data.msg);
          toast({
            title: "消息📢:",
            description: "❌: " + data.msg,
          });
        }
      })
      .catch((error) => {
        // 处理错误
        console.error("Error:", error);
      });

    // mutate("http://192.168.2.112:8888/api/planning/GetPlanningTaskFiles");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="formname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>任务文件名</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>至少2个字符</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">保存</Button>
      </form>
    </Form>
  );
};

export default SaveForm;
