import React from "react";
import NavLinks from "@/components/dashboard/nav-links";
const SideNav = () => {
  return (
    <div className="flex gap-3 flex-col px-3 pb-4 overflow-y-auto space-y-2 font-medium">
      <NavLinks />
    </div>
  );
};

export default SideNav;
