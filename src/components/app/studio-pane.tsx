import { useState } from "react";
import { Heart, Loader2, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { buildBrandKit, generateLogo } from "@/lib/ai";
import { FORM_PRESETS, INDUSTRIES, STYLE_PRESETS } from "@/lib/prompts";
import { useBup } from "@/lib/store";
import { playSound } from "@/lib/utils";
import type { LogoForm, LogoWork } from "@/lib/types";

export function StudioPane() {
  const brief = useBup((s) => s.brief);
  const patchBrief = useBup((s) => s.patchBrief);
  const logos = useBup((s) => s.logos);
  const addLogo = useBup((s) => s.addLogo);
  const toggleLike = useBup((s) => s.toggleLike);
  const setLogoKit = useBup((s) => s.setLogoKit);
  const removeLogo = useBup((s) => s.removeLogo);
  const [busy, setBusy] = useState(false);
  const [kitId, setKitId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  async function generate() {
    if (!brief.name.trim()) {
      toast.error("Give the brand a name first.");
      return;
    }
    setBusy(true);
    try {
      const result = await generateLogo({ data: { brief } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const id = addLogo({
        imageUrl: result.url,
        prompt: brief.notes,
        brief: { ...brief },
      });
      setSelected(id);
      playSound("/audio/intro.mp3", 0.35);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Studio failed.");
    } finally {
      setBusy(false);
    }
  }

  async function kit(work: LogoWork) {
    setKitId(work.id);
    try {
      const result = await buildBrandKit({ data: { brief: work.brief } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setLogoKit(work.id, result.kit);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kit failed.");
    } finally {
      setKitId(null);
    }
  }

  const selectedWork = logos.find((l) => l.id === selected) ?? logos[0];

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <section className="border-b border-border lg:w-[22rem] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 scrollbar-thin">
        <div className="px-4 py-5 sm:px-5">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Logo Studio
          </p>
          <h2 className="font-display mt-2 text-2xl tracking-[-0.03em]">Cut a mark</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            BUP renders one direction at a time. Like what you keep — that trains taste.
          </p>

          <label className="mt-6 block text-xs font-medium text-muted">Brand name</label>
          <Input
            className="mt-1.5"
            placeholder="e.g. Night Atelier"
            value={brief.name}
            onChange={(e) => patchBrief({ name: e.target.value })}
          />

          <label className="mt-4 block text-xs font-medium text-muted">Industry</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {INDUSTRIES.map((ind) => (
              <Badge
                key={ind}
                active={brief.industry === ind}
                onClick={() => patchBrief({ industry: ind })}
              >
                {ind}
              </Badge>
            ))}
          </div>

          <label className="mt-4 block text-xs font-medium text-muted">Form</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {FORM_PRESETS.map((f) => (
              <Badge
                key={f.id}
                active={brief.form === f.id}
                onClick={() => patchBrief({ form: f.id as LogoForm })}
              >
                {f.label}
              </Badge>
            ))}
          </div>

          <label className="mt-4 block text-xs font-medium text-muted">Style</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STYLE_PRESETS.map((s) => (
              <Badge
                key={s.id}
                active={brief.style === s.id}
                onClick={() => patchBrief({ style: s.id })}
              >
                {s.label}
              </Badge>
            ))}
          </div>

          <label className="mt-4 block text-xs font-medium text-muted">Color direction</label>
          <Input
            className="mt-1.5"
            placeholder="bone and ink, one accent"
            value={brief.colors}
            onChange={(e) => patchBrief({ colors: e.target.value })}
          />

          <label className="mt-4 block text-xs font-medium text-muted">Ground</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(
              [
                ["ink", "Ink"],
                ["paper", "Paper"],
                ["transparent-look", "Isolated"],
              ] as const
            ).map(([id, label]) => (
              <Badge
                key={id}
                active={brief.background === id}
                onClick={() => patchBrief({ background: id })}
              >
                {label}
              </Badge>
            ))}
          </div>

          <label className="mt-4 block text-xs font-medium text-muted">Notes</label>
          <Textarea
            className="mt-1.5 min-h-20"
            placeholder="No music notes. Tight wordspacing. Slightly brutal."
            value={brief.notes}
            onChange={(e) => patchBrief({ notes: e.target.value })}
          />

          <Button className="mt-5 w-full" size="lg" disabled={busy} onClick={() => void generate()}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Rendering
              </>
            ) : (
              <>
                <Wand2 className="size-4" /> Generate mark
              </>
            )}
          </Button>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-thin px-4 py-5 sm:px-6">
        {logos.length === 0 ? (
          <div className="m-auto flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="font-display text-2xl tracking-[-0.03em]">The board is empty.</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Name the brand, pick a form, generate. Each like teaches BUP what you keep.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              {selectedWork && (
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <img
                    src={selectedWork.imageUrl}
                    alt={selectedWork.brief.name}
                    className="aspect-square w-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
                    <div className="mr-auto">
                      <div className="text-sm font-medium">{selectedWork.brief.name}</div>
                      <div className="text-xs text-muted">
                        {selectedWork.brief.form} · {selectedWork.brief.style}
                      </div>
                    </div>
                    <Button
                      variant={selectedWork.liked ? "default" : "secondary"}
                      size="sm"
                      onClick={() => toggleLike(selectedWork.id)}
                    >
                      <Heart className={`size-3.5 ${selectedWork.liked ? "fill-current" : ""}`} />
                      {selectedWork.liked ? "Kept" : "Keep"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={kitId === selectedWork.id}
                      onClick={() => void kit(selectedWork)}
                    >
                      {kitId === selectedWork.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        "Brand kit"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      onClick={() => removeLogo(selectedWork.id)}
                      aria-label="Remove"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  {selectedWork.kit && (
                    <div className="border-t border-border px-4 py-4">
                      <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
                        Kit
                      </p>
                      {selectedWork.kit.tagline && (
                        <p className="font-display mt-2 text-xl tracking-[-0.03em]">
                          {selectedWork.kit.tagline}
                        </p>
                      )}
                      <div className="mt-3 flex gap-2">
                        {selectedWork.kit.palette.map((c) => (
                          <div key={c.hex} className="flex-1">
                            <div
                              className="h-10 rounded-md border border-border"
                              style={{ background: c.hex }}
                            />
                            <div className="mt-1 text-[10px] text-muted">{c.name}</div>
                            <div className="font-mono text-[10px] text-subtle">{c.hex}</div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-fg">
                        {selectedWork.kit.typePairing.display} / {selectedWork.kit.typePairing.body}
                      </p>
                      <p className="mt-1 text-xs text-muted">{selectedWork.kit.typePairing.why}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{selectedWork.kit.usage}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 xl:grid-cols-2">
              {logos.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelected(l.id)}
                  className={`overflow-hidden rounded-lg border ${
                    selectedWork?.id === l.id ? "border-accent/60" : "border-border"
                  }`}
                >
                  <img
                    src={l.imageUrl}
                    alt={l.brief.name}
                    className="aspect-square w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
