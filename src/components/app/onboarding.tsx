import { useState } from "react";
import { ROLE_PRESETS, STYLE_PRESETS } from "@/lib/prompts";
import { playSound } from "@/lib/utils";
import { useBup } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BupMark } from "./mark";

export function Onboarding() {
  const complete = useBup((s) => s.completeOnboarding);
  const playSting = useBup((s) => s.profile.playSting);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Founder");
  const [styles, setStyles] = useState<string[]>(["minimal", "luxury"]);

  function toggleStyle(id: string) {
    setStyles((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length >= 3
          ? [...prev.slice(1), id]
          : [...prev, id],
    );
  }

  function enter() {
    if (playSting) playSound("/audio/sting.mp3", 0.55);
    setStep(1);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        {step === 0 && (
          <div className="flex flex-col items-center text-center">
            <BupMark size={52} className="text-accent" />
            <p className="mt-8 text-xs font-medium tracking-[0.22em] text-muted uppercase">
              BUP AI
            </p>
            <h1 className="font-display mt-4 text-4xl leading-tight tracking-[-0.03em] text-fg sm:text-5xl">
              From nothing
              <br />
              to something.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Personal creative intelligence. Learns how you see — especially
              marks, type, and color. Built by BUP AI.
            </p>
            <Button className="mt-10 w-full" size="lg" onClick={enter}>
              Enter
            </Button>
            <p className="mt-4 text-xs text-subtle">
              They slept, we built.
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              01 — Name
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-[-0.03em]">
              What should I call you?
            </h2>
            <Input
              className="mt-8"
              autoFocus
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) setStep(2);
              }}
            />
            <div className="mt-8 flex justify-end">
              <Button disabled={!name.trim()} onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              02 — Work
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-[-0.03em]">
              What do you make?
            </h2>
            <div className="mt-8 flex flex-wrap gap-2">
              {ROLE_PRESETS.map((r) => (
                <Badge key={r} active={role === r} onClick={() => setRole(r)}>
                  {r}
                </Badge>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              03 — Taste
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-[-0.03em]">
              How should the work feel?
            </h2>
            <p className="mt-2 text-sm text-muted">Pick up to three. BUP will learn from here.</p>
            <div className="mt-8 grid grid-cols-2 gap-2">
              {STYLE_PRESETS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStyle(s.id)}
                  className={`rounded-xl border p-3 text-left transition-colors duration-150 ${
                    styles.includes(s.id)
                      ? "border-accent/50 bg-raised"
                      : "border-border bg-surface hover:border-fg/20"
                  }`}
                >
                  <div className="text-sm font-medium text-fg">{s.label}</div>
                  <div className="mt-1 text-xs text-muted">{s.hint}</div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={() =>
                  complete({ name, role, styles })
                }
              >
                Start working
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
