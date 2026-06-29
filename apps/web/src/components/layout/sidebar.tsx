"use client";

import { usePathname } from "next/navigation";
import {
  CompaniesIcon,
  HomeIcon,
  QuestionsIcon,
  TagsIcon,
  UsersIcon,
} from "../icons/nav-icons";
import { NavItem } from "./nav-item";

const menu = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Questions", href: "/questions", icon: QuestionsIcon },
  { label: "Tags", href: "/tags", icon: TagsIcon },
  { label: "Users", href: "/users", icon: UsersIcon },
  { label: "Companies", href: "/companies", icon: CompaniesIcon },
];

type Props = {
  authenticated?: boolean;
};

export function Sidebar({ authenticated }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-[180px] border-r bg-[#F8F9F9] min-h-screen">
      <div className="pt-3">
        {menu.map(({ label, href, icon: Icon }) => (
          <NavItem
            key={label}
            label={label}
            href={href}
            active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
            icon={<Icon className="h-5 w-5" />}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-5 space-y-2 text-sm">
        <div>Help</div>
        <div>Documentation</div>
        {authenticated && <div>Leaderboard</div>}
      </div>
    </aside>
  );
}
