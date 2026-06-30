import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, disabled, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "w-full rounded-xl bg-[#2F6BFF] py-2.5 font-medium text-white hover:opacity-90",
        disabled && "cursor-not-allowed opacity-60 hover:opacity-60",
        className,
      )}
    >
      {props.children}
    </button>
  );
}
