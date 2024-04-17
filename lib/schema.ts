import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "请输入有效的电子邮件地址",
  }),
  password: z.string().min(6, {
    message: "密码至少为6个字符",
  }),
  name: z.string().min(1, { message: "请输入您的名字" }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "请输入有效的电子邮件地址",
  }),
  password: z.string().min(1, {
    message: "请输入正确密码",
  }),
});
