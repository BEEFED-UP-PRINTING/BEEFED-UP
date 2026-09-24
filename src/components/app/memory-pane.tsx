import { Download, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STYLE_PRESETS, VOICE_PRESETS } from "@/lib/prompts";
import { useBup } from "@/lib/store";
import { playSound } from "@/lib/utils";
import type { VoiceId } from "@/lib/types";

export function MemoryPane() {
  const profile = useBup((s) => s.profile);
  const setProfile = useBup((s) => s.setProfile);
  const setVoice = useBup((s) => s.setVoice);
  const memories = useBup((s) => s.memories);
  const removeMemory = useBup((s) => s.removeMemory);
  const addMemories = useBup((s) => s.addMemories);
  const logos = useBup((s) => s.logos);
  const resetAll = useBup((s) => s.resetAll);
  const styles = useBup((s) => s.profile.styles);

  function toggleStyle(id: string) {
    const next = styles.includes(id)
      ? styles.filter((s) => s !== id)
      : [...styles, id].slice(-4);
    setProfile({ styles: next });
    addMemories([{ kind: "style", text: `Visual taste: ${next.join(", ") || "open"}.` }]);
  }

  function exportBrain() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            profile,
            memories,
            logos: logos.map((l) => ({
              name: l.brief.name,
              liked: l.liked,
              brief: l.brief,
              kit: l.kit,
            })),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bup-ai-memory.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Memory exported.");
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Memory</p>
        <h2 className="font-display mt-2 text-3xl tracking-[-0.03em]">What BUP knows</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Learning lives on this device. Edit it. BUP gets sharper the more you keep.
        </p>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium">You</h3>
          <label className="mt-4 block text-xs text-muted">Name</label>
          <Input
            className="mt-1.5"
            value={profile.name}
            onChange={(e) => setProfile({ name: e.target.value })}
          />
          <label className="mt-4 block text-xs text-muted">Role</label>
          <Input
            className="mt-1.5"
            value={profile.role}
            onChange={(e) => setProfile({ role: e.target.value })}
          />
          <p className="mt-4 text-xs text-muted">Taste flags</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STYLE_PRESETS.map((s) => (
              <Badge
                key={s.id}
                active={styles.includes(s.id)}
                onClick={() => toggleStyle(s.id)}
              >
                {s.label}
              </Badge>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium">Voice</h3>
          <p className="mt-1 text-sm text-muted">
            The anthem is your 4OUR record. Spoken replies use a matching studio voice.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {VOICE_PRESETS.map((v) => (
              <Badge
                key={v.id}
                active={profile.voiceId === v.id}
                onClick={() => setVoice(v.id as VoiceId)}
              >
                {v.label}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">
            {VOICE_PRESETS.find((v) => v.id === profile.voiceId)?.hint}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => playSound("/audio/sting.mp3", 0.6)}
            >
              <Play className="size-3.5" /> Play sting
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => playSound("/audio/theme.mp3", 0.5)}
            >
              <Play className="size-3.5" /> Play anthem
            </Button>
            <Button
              variant={profile.autoSpeak ? "default" : "secondary"}
              size="sm"
              onClick={() => setProfile({ autoSpeak: !profile.autoSpeak })}
            >
              {profile.autoSpeak ? "Auto-speak on" : "Auto-speak off"}
            </Button>
            <Button
              variant={profile.playSting ? "default" : "secondary"}
              size="sm"
              onClick={() => setProfile({ playSting: !profile.playSting })}
            >
              {profile.playSting ? "Sting on" : "Sting off"}
            </Button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Kept marks</h3>
            <span className="text-xs text-subtle">{logos.filter((l) => l.liked).length} liked</span>
          </div>
          {logos.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing on the board yet.</p>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {logos.map((l) => (
                <img
                  key={l.id}
                  src={l.imageUrl}
                  alt={l.brief.name}
                  className={`aspect-square rounded-md border object-cover ${
                    l.liked ? "border-accent/50" : "border-border opacity-70"
                  }`}
                  crossOrigin="anonymous"
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium">Durable notes</h3>
          {memories.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              BUP writes here when you teach it. You can also say “remember this” in chat.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {memories.map((m) => (
                <li key={m.id} className="flex items-start gap-3 py-3">
                  <span className="mt-0.5 w-12 shrink-0 text-[10px] font-medium tracking-wider text-subtle uppercase">
                    {m.kind}
                  </span>
                  <p className="flex-1 text-sm leading-relaxed text-fg">{m.text}</p>
                  <button
                    type="button"
                    onClick={() => removeMemory(m.id)}
                    className="text-subtle hover:text-fg"
                    aria-label="Forget"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium">Install BUP</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Add BUP AI to your home screen. It runs like a native app — chat, studio,
            and voice, with your memory on device. Play Store listing needs a Google
            Play developer account; this build is the complete installable app.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <a href="/?install=1">Install guide</a>
            </Button>
            <Button variant="secondary" size="sm" onClick={exportBrain}>
              <Download className="size-3.5" /> Export memory
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Wipe onboarding, chats, and memory on this device?")) resetAll();
              }}
            >
              Reset BUP
            </Button>
          </div>
          <p className="mt-4 text-xs text-subtle">Built by BUP AI. From nothing to something.</p>
        </section>
      </div>
    </div>
  );
}
