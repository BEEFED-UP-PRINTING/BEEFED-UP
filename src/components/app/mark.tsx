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
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="10"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      <path
        d="M12 11.5h7.2c3.1 0 5.15 1.55 5.15 4.05 0 1.55-.85 2.75-2.25 3.35 1.7.5 2.75 1.85 2.75 3.7 0 2.7-2.2 4.4-5.55 4.4H12V11.5Zm3.05 2.4v3.7h3.85c1.55 0 2.4-.7 2.4-1.85s-.85-1.85-2.4-1.85H15.05Zm0 5.95v4.25h4.35c1.7 0 2.7-.8 2.7-2.15s-1-2.1-2.7-2.1H15.05Z"
        fill="currentColor"
      />
    </svg>
  );
}
