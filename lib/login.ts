import * as z from "zod";

import { LoginSchema } from "@/app/page";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "出错了,请重试" };
  }
  return { success: "登录成功" };
};
