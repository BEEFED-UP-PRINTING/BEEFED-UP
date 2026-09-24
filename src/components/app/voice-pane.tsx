import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendToBup } from "@/lib/send";
import { useBup } from "@/lib/store";
import { playSound } from "@/lib/utils";
import { listenOnce } from "@/lib/voice";
import { VoiceOrb } from "./orb";

type Phase = "idle" | "listening" | "thinking" | "speaking";

export function VoicePane() {
  const playSting = useBup((s) => s.profile.playSting);
  const autoSpeak = useBup((s) => s.profile.autoSpeak);
  const name = useBup((s) => s.profile.name);
  const [phase, setPhase] = useState<Phase>("idle");
  const [caption, setCaption] = useState("From nothing to something.");
  const [sub, setSub] = useState("They slept, we built.");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!playSting) return;
    const audio = playSound("/audio/sting.mp3", 0.62);
    setCaption("From nothing to something.");
    setSub("You know the name now.");
    const t = window.setTimeout(() => setSub("They slept, we built."), 5200);
    const onEnd = () => {
      setCaption(name ? `${name.split(" ")[0]}. I'm listening.` : "I'm listening.");
      setSub("Hold the mic and talk.");
      setPhase("idle");
    };
    audio.addEventListener("ended", onEnd);
    return () => {
      window.clearTimeout(t);
      audio.pause();
      audio.removeEventListener("ended", onEnd);
    };
  }, [playSting, name]);

  async function cycle() {
    if (phase === "listening" || phase === "thinking" || phase === "speaking") return;
    setPhase("listening");
    setCaption("Listening");
    setSub("Speak naturally.");
    try {
      const heard = await listenOnce();
      if (!heard) {
        setPhase("idle");
        setCaption("I didn't catch that.");
        setSub("Tap the mic and try again.");
        return;
      }
      setCaption(heard);
      setSub("Thinking");
      setPhase("thinking");
      const reply = await sendToBup({
        text: heard,
        speakReply: autoSpeak,
      });
      setCaption(reply || "Noted.");
      setSub("Tap to talk again.");
      setPhase(autoSpeak ? "speaking" : "idle");
      if (autoSpeak) {
        window.setTimeout(() => setPhase("idle"), Math.min(12000, 80 * (reply?.length ?? 20)));
      }
    } catch (err) {
      setPhase("idle");
      const msg = err instanceof Error ? err.message : "Voice failed.";
      setCaption("Hold up.");
      setSub(msg === "empty" ? "Nothing came through. Try again." : msg);
      if (msg !== "empty") toast.error(msg);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center px-6">
      <VoiceOrb
        state={phase}
        className="h-56 w-56 sm:h-64 sm:w-64"
      />
      <p className="font-display mt-10 max-w-md text-center text-2xl leading-snug tracking-[-0.03em] sm:text-3xl">
        {caption}
      </p>
      <p className="mt-3 max-w-sm text-center text-sm text-muted">{sub}</p>
      <Button
        className="mt-10 size-16 rounded-full"
        size="icon"
        variant={phase === "listening" ? "live" : "default"}
        onClick={() => void cycle()}
        aria-label={phase === "listening" ? "Listening" : "Talk to BUP"}
      >
        {phase === "listening" ? <Square className="size-5" /> : <Mic className="size-6" />}
      </Button>
      <p className="mt-4 text-xs text-subtle">
        {phase === "listening" ? "Hearing you" : "Tap to talk"}
      </p>
    </div>
  );
}
