import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-md border border-border bg-raised px-3 text-sm text-fg placeholder:text-subtle",
      "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
      "disabled:opacity-40",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-lg border border-border bg-raised px-3 py-2.5 text-sm text-fg placeholder:text-subtle",
      "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
      "disabled:opacity-40 resize-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
