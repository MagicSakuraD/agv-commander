import { db } from "@/lib/db";

export const getName = async (email: string): Promise<string | null> => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { name: true }, // 只选择name字段
    });
    return user?.name ?? email; // 如果找到用户则返回名字，否则返回null
  } catch (error) {
    console.error("Failed to fetch user name:", error);
    throw new Error("Failed to fetch user name.");
  }
};
