import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { name: true },
    });

    res.json({ name: user?.name ?? null });
  } catch (error) {
    console.error("Failed to fetch user name:", error);
    res.status(500).json({ error: "Failed to fetch user name." });
  }
}
