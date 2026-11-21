import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { transcribeAudio, writeSunoPrompt, type SunoRead } from "@/lib/ai";
import { useBup } from "@/lib/store";

function estimateBpm(samples: Float32Array, sampleRate: number): number | null {
  const maxSec = Math.min(samples.length / sampleRate, 24);
  const step = 256;
  const peaks: number[] = [];
  let last = 0;
  const minGap = Math.floor(sampleRate / step / 4);
  for (let i = 0; i < maxSec * sampleRate; i += step) {
    let sum = 0;
    const end = Math.min(samples.length, i + step);
    for (let j = i; j < end; j++) sum += samples[j] * samples[j];
    const rms = Math.sqrt(sum / step);
    const idx = Math.floor(i / step);
    if (rms > 0.18 && idx - last > minGap) {
      peaks.push(i / sampleRate);
      last = idx;
    }
  }
  if (peaks.length < 6) return null;
  const gaps: number[] = [];
  for (let i = 1; i < peaks.length; i++) {
    const g = peaks[i] - peaks[i - 1];
    if (g > 0.28 && g < 1.1) gaps.push(g);
  }
  if (gaps.length < 4) return null;
  gaps.sort((a, b) => a - b);
  const mid = gaps[Math.floor(gaps.length / 2)];
  const bpm = Math.round(60 / mid);
  return bpm >= 70 && bpm <= 200 ? bpm : null;
}

function spectrumLabel(samples: Float32Array): string {
  let low = 0;
  let high = 0;
  for (let i = 2; i < samples.length; i += 8) {
    const slow = (samples[i] + samples[i - 1] + samples[i - 2]) / 3;
    low += slow * slow;
    const fast = samples[i] - samples[i - 1];
    high += fast * fast;
  }
  if (low > high * 1.4) return "bass-heavy";
  if (high > low * 1.2) return "bright";
  return "balanced";
}

export function SunoPane() {
  const addMemories = useBup((s) => s.addMemories);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [read, setRead] = useState<SunoRead | null>(null);
  const [stats, setStats] = useState<{ bpm: number | null; energy: number; duration: number } | null>(
    null,
  );

  async function analyse(file: File) {
    setBusy(true);
    setRead(null);
    try {
      const ctx = new AudioContext();
      const buffer = await ctx.decodeAudioData(await file.arrayBuffer());
      await ctx.close();
      const channel = buffer.getChannelData(0);
      const bpm = estimateBpm(channel, buffer.sampleRate);
      let energySum = 0;
      const take = Math.min(channel.length, buffer.sampleRate * 20);
      for (let i = 0; i < take; i += 32) energySum += channel[i] * channel[i];
      const rms = Math.sqrt(energySum / (take / 32));
      const energy = Math.max(1, Math.min(10, Math.round(rms * 28)));
      const duration = buffer.duration;
      setStats({ bpm, energy, duration });

      let transcript = "";
      if (file.size < 1_600_000) {
        const audioBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const raw = String(reader.result ?? "");
            resolve(raw.slice(raw.indexOf(",") + 1));
          };
          reader.onerror = () => reject(new Error("read"));
          reader.readAsDataURL(file);
        });
        const heard = await transcribeAudio({
          data: { audioBase64, mimeType: file.type || "audio/mpeg" },
        });
        if (heard.ok) transcript = heard.text;
      }

      const result = await writeSunoPrompt({
        data: {
          bpm,
          durationSec: duration,
          energy,
          spectrum: spectrumLabel(channel),
          transcript,
          notes,
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setRead(result.read);
      addMemories([
        {
          kind: "fact",
          text: `Suno read of their track: ${bpm ? `${bpm} BPM` : "BPM unclear"}, energy ${energy}/10. Style line: ${result.read.prompt}`,
        },
      ]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that track.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-xl flex-col overflow-y-auto scrollbar-thin px-4 py-6">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Suno</p>
      <h2 className="font-display mt-2 text-2xl tracking-[-0.03em]">Style line from the file</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Tempo and energy come from the audio. Maggie will not invent a vocal or a genre the
        track did not give her.
      </p>
      <Textarea
        className="mt-4 min-h-16"
        placeholder="Optional note, e.g. this is the drill remix, not the original."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <label className="mt-4 block text-xs font-medium text-muted">Track</label>
      <input
        type="file"
        accept="audio/*"
        className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-fg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void analyse(file);
        }}
      />
      {busy && (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" /> Reading the track
        </p>
      )}
      {read && stats && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">Style prompt</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(read.prompt);
                toast.success("Copied.");
              }}
            >
              <Copy className="size-3.5" /> Copy
            </Button>
          </div>
          <p className="mt-3 text-base leading-relaxed">{read.prompt}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Tempo" value={stats.bpm ? `${stats.bpm} BPM` : "unclear"} />
            <Stat label="Energy" value={`${stats.energy}/10`} />
            <Stat
              label="Duration"
              value={`${Math.floor(stats.duration / 60)}:${String(Math.floor(stats.duration % 60)).padStart(2, "0")}`}
            />
          </div>
          <p className="mt-4 text-sm text-muted">{read.note}</p>
          <p className="mt-1 text-xs text-subtle">Mood: {read.mood}</p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border px-2 py-3 text-center">
      <div className="text-xs text-subtle">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
