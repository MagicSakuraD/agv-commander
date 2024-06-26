"use client";
import {
  UserGroupIcon,
  HomeIcon,
  PresentationChartBarIcon,
  DocumentDuplicateIcon,
  MapIcon,
  TruckIcon,
  FolderIcon,
  DocumentMagnifyingGlassIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import { MdMonitorHeart } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "系统监控", href: "/dashboard", icon: PresentationChartBarIcon },

  { name: "参数配置", href: "/dashboard/config", icon: FolderIcon },

  { name: "路线设置", href: "/dashboard/plan", icon: MapIcon },

  { name: "车辆控制", href: "/dashboard/vehicle", icon: TruckIcon },
  {
    name: "日志信息",
    href: "/dashboard/logs",
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    name: "节点状态",
    href: "/dashboard/node",
    icon: DocumentChartBarIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-10 grow items-center justify-start gap-2 rounded-md p-3 text-sm font-medium hover:bg-muted  md:flex-none  md:p-2 md:px-3",
              {
                "bg-muted/50 text-green-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
