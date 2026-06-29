type Props = {
  src?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ src, name, size = 32 }: Props) {
  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-blue-500 font-medium text-white"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {initial}
    </div>
  );
}
