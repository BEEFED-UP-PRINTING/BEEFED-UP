import { cn } from "@/lib/utils";

export function VoiceOrb({
  state,
  className,
}: {
  state: "idle" | "listening" | "thinking" | "speaking";
  className?: string;
}) {
  return (
    <div
      className={cn("relative grid place-items-center", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute size-[72%] rounded-full border border-border",
          state === "listening" && "animate-pulse",
          state === "speaking" && "scale-110",
        )}
      />
      <div
        className={cn(
          "absolute size-[88%] rounded-full border border-fg/10",
          state === "speaking" && "animate-pulse",
        )}
      />
      <div
        className={cn(
          "orb-core relative size-[56%] rounded-full transition-transform duration-300",
          state === "listening" && "scale-105",
          state === "speaking" && "scale-110",
          state === "thinking" && "opacity-80",
        )}
      />
      <div className="absolute size-[18%] rounded-full bg-fg/80 mix-blend-overlay" />
    </div>
  );
}
