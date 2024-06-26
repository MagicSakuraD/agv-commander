import { auth } from "@/auth";
import { Session } from "next-auth";
import { useState, useEffect } from "react";

export default function UserAvatar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const result = await auth();
      setSession(result);
    };

    fetchSession();
  }, []);

  if (!session?.user) return null;

  return (
    <div>
      <p>{session.user.name}</p>
      <p>{session.user.email}</p>
    </div>
  );
}
