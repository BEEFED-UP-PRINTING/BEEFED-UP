import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  active,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors duration-150",
        active
          ? "border-accent/40 bg-accent text-accent-fg"
          : "border-border bg-raised text-muted hover:text-fg",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
