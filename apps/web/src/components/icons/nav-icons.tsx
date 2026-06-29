type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a2 2 0 0 1 4 0v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function QuestionsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5.5A2 2 0 0 1 6 3.5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7.5L7 19v-3.5H6a2 2 0 0 1-2-2Z" />
      <path d="M9.5 8.5v-1a1 1 0 0 1 2 0c0 .9-1 1-1 2" />
      <path d="M14.5 8.5v-1a1 1 0 0 1 2 0c0 .9-1 1-1 2" />
    </svg>
  );
}

export function TagsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11.5 3H6a2 2 0 0 0-2 2v5.5a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l5.5-5.5a2 2 0 0 0 0-2.82l-9-9A2 2 0 0 0 11.5 3Z" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
      <path d="M15.5 5.6a3.25 3.25 0 0 1 0 6.3" />
      <path d="M16.5 14.2c2.6.4 4.5 2.6 4.5 5.3" />
    </svg>
  );
}

export function CompaniesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="9" width="9" height="11" rx="1" />
      <rect x="13" y="4" width="7" height="16" rx="1" />
      <path d="M7 13h2M7 16h2M16 7.5h1M16 10.5h1M16 13.5h1M16 16.5h1" />
    </svg>
  );
}

export function ReviewIcon({ className }: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" className={className}>
      <path d="M12 2 22 12 12 22 2 12Z" />
    </svg>
  );
}

export function InboxIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 13h4.5l1.5 3h6l1.5-3H21" />
      <path d="M5.5 5h13a2 2 0 0 1 1.94 1.52L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5l1.56-6.48A2 2 0 0 1 5.5 5Z" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 17V11a6 6 0 1 1 12 0v6" />
      <path d="M4.5 17h15" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
