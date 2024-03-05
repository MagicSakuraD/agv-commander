import React from "react";

const page = () => {
  return (
    <main className="flex h-96 flex-col items-center justify-center container mt-28">
      <h2 className="text-center">出了点问题😵</h2>

      <button className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-400">
        再试一下
      </button>
    </main>
  );
};

export default page;
