import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  disabled,
  variant = "default",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "rounded-xl font-medium transition",

        variant === "default" &&
          "bg-[#2F6BFF] text-white hover:opacity-90",

        variant === "outline" &&
          "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100",

        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-4 py-2.5 text-base",
        size === "lg" && "px-5 py-3 text-lg",

        disabled && "cursor-not-allowed opacity-60",

        className
      )}
    >
      {props.children}
    </button>
  );
}