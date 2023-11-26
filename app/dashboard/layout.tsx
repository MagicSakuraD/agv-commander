"use client";
import Navbar from "@/components/dashboard/navbar";
import SideNav from "@/components/dashboard/sidenav";
import clsx from "clsx";
import { useState } from "react";

export type NavbarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="h-screen">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 w-48 mt-16 h-full transition-transform border-r md:translate-x-0 backdrop-blur-lg",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
        aria-label="Sidebar"
      >
        <div className="">
          <SideNav />
        </div>
      </aside>
      <div className="p-4 mt-14 md:ml-48">{children}</div>
    </main>
  );
}
