"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-[32rem] flex-col items-center justify-center">
      <h2 className="text-center inline">
        出了点问题
        <img
          src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Crossed-Out%20Eyes.png"
          alt="Face with Crossed-Out Eyes"
          width="30"
          height="30"
          className="inline pl-1"
        />
      </h2>
      <div className="flex flex-row gap-3">
        <button
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          onClick={
            // Attempt to recover by trying to re-render the invoices route
            () => reset()
          }
        >
          再试一下
        </button>
        <Link
          href="/dashboard"
          className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-400"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
