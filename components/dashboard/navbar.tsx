"use client";
import React from "react";
import { ModeToggle } from "@/components/dark-mode/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import handleAck from "mqtt/lib/handlers/ack";
import { NavbarProps } from "@/app/dashboard/layout";
import { set } from "react-hook-form";

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <Button
                aria-controls="logo-sidebar"
                variant="outline"
                className="inline-flex items-center p-2 text-sm rounded-lg md:hidden"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </Button>

              <Link
                href="/dashboard"
                className="flex ms-2 md:me-24 brightness-125 contrast-75"
              >
                <img
                  src="/logo.png"
                  className="h-10 me-3"
                  alt="FlowBite Logo"
                />
              </Link>
            </div>

            <div className="flex items-center ms-3 gap-2">
              <ModeToggle />
              <div>
                <span className="sr-only">Open user menu</span>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
