import React from "react";
import { signOut } from "@/auth";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Logout } from "@icon-park/react";

const SignOut = () => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOut();
      }}
    >
      <Logout theme="two-tone" size="24" fill={["currentColor", "#22c55e"]} />
      注销
    </DropdownMenuItem>
  );
};

export default SignOut;
