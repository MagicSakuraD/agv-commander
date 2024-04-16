import * as z from "zod";

import { RegisterSchema } from "@/app/auth/register/page";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "出错了,请重试" };
  }
  return { success: "登录成功" };
};
