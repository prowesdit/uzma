"use client";
import {
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
  ShareIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Offices", href: "/dashboard/offices", icon: ShareIcon },
  { name: "Bookings", href: "/dashboard/bookings", icon: ArrowRightStartOnRectangleIcon },
  { name: "Users", href: "/dashboard/users", icon: UsersIcon },
];

export default function NavLinks({userRole}: {userRole: string | null}) {
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
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-teal-100 text-teal-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
