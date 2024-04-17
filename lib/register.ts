"use server";
import * as z from "zod";
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/lib/schema";
import { db } from "@/lib/db";
import { get } from "http";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "出错了,请重试" };
  }
  const { email, password, name } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "邮箱已存在" };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  // TODO: Send verification token email
  return { success: "注册成功" };
};
