import { cn } from "@/lib/utils";

export function BupMark({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="36" height="36" rx="8" fill="currentColor" />
      <path
        d="M11.2 9.6h8.1c3.35 0 5.55 1.7 5.55 4.4 0 1.65-.9 2.95-2.4 3.6 1.85.55 2.95 2 2.95 4 0 2.9-2.4 4.8-6 4.8H11.2V9.6Zm3.3 2.55v4.05h4.15c1.65 0 2.55-.75 2.55-2.05s-.9-2-2.55-2H14.5Zm0 6.4v4.6h4.7c1.85 0 2.9-.85 2.9-2.3s-1.05-2.3-2.9-2.3H14.5Z"
        className="fill-accent-fg"
      />
    </svg>
  );
}
