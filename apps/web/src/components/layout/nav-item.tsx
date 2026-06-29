"use client";

import Link from "next/link";

type Props = {
  label: string;
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
};

export function NavItem({ label, href, active, icon }: Props) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 px-5 py-3 text-sm transition ${
        active
          ? "bg-[#E6F0FF] text-blue-600 border-r-4 border-blue-500"
          : "hover:bg-white text-zinc-700"
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}
