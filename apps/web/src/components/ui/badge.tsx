import Link from "next/link";

type Props = {
  label: string;
  href?: string;
};

export function Badge({ label, href }: Props) {
  const className =
    "inline-flex items-center rounded-md bg-[#E6F0FF] px-2 py-1 text-xs font-medium text-blue-700";

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
