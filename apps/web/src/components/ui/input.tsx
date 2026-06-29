import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-700 outline-none focus:border-[#2F6BFF]",
        className,
      )}
    />
  );
}
