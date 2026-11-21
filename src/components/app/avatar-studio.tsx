import { useState } from "react";
import { Download, Heart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateAvatar } from "@/lib/ai";
import { useBup } from "@/lib/store";
import type { AvatarLayout } from "@/lib/types";
import { playSound } from "@/lib/utils";

const LAYOUTS: { id: AvatarLayout; label: string; ref: string; note: string }[] = [
  {
    id: "badge",
    label: "Badge",
    ref: "/avatar-refs/badge.jpg",
    note: "Script on the chest, MET LYN bar",
  },
  {
    id: "stack",
    label: "Stack",
    ref: "/avatar-refs/stack.jpg",
    note: "Bushie on top, MET LYN under",
  },
  {
    id: "crest",
    label: "Crest",
    ref: "/avatar-refs/crest.jpg",
    note: "Name on the ring",
  },
];

function drawDown(bmp: ImageBitmap): string {
  const max = 768;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bmp.width * scale));
  canvas.height = Math.max(1, Math.round(bmp.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

async function fileToDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  return drawDown(bmp);
}

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  const bmp = await createImageBitmap(blob);
  return drawDown(bmp);
}

function saveBlob(blob: Blob, name: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
  URL.revokeObjectURL(href);
}

export function AvatarStudio() {
  const avatars = useBup((s) => s.avatars ?? []);
  const addAvatar = useBup((s) => s.addAvatar);
  const toggleAvatarLike = useBup((s) => s.toggleAvatarLike);
  const removeAvatar = useBup((s) => s.removeAvatar);
  const addMemories = useBup((s) => s.addMemories);
  const [layout, setLayout] = useState<AvatarLayout>("badge");
  const [oneOfOne, setOneOfOne] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const active = LAYOUTS.find((l) => l.id === layout) ?? LAYOUTS[0];
  const shown = avatars.find((a) => a.id === selected) ?? avatars[0];

  async function generate() {
    if (!photo) {
      toast.error("Upload a face first.");
      return;
    }
    setBusy(true);
    try {
      const style = await urlToDataUrl(active.ref);
      const result = await generateAvatar({
        data: { photo, style, layout, oneOfOne: layout === "crest" ? oneOfOne : false },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const id = addAvatar({
        imageUrl: result.url,
        layout,
        oneOfOne: layout === "crest" && oneOfOne,
      });
      setSelected(id);
      addMemories([
        {
          kind: "style",
          text: `Made a Bushie MET LYN ${layout} avatar from their photo. Lockup stays Bushie / MET LYN, orange on black. Likeness matters more than a new name.`,
        },
      ]);
      playSound("/audio/intro.mp3", 0.35);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Avatar failed.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadPng(url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("fetch");
      saveBlob(await res.blob(), "bushie-met-lyn.png");
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  async function downloadHtml(url: string) {
    let src = url;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        src = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("read"));
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      /* remote image stays as a link */
    }
    const html = `<!doctype html>
<meta charset="utf-8">
<title>Bushie MET LYN</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<body style="margin:0;background:#000;color:#f97015;font-family:Impact,Oswald,sans-serif;display:grid;min-height:100vh;place-items:center">
<figure style="margin:0;text-align:center">
<img alt="Bushie MET LYN" src="${src}" style="width:min(100vw,900px);height:auto;display:block">
</figure>
</body>`;
    saveBlob(new Blob([html], { type: "text/html" }), "bushie-met-lyn.html");
  }

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <section className="border-b border-border lg:w-[22rem] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 scrollbar-thin">
        <div className="px-4 py-5 sm:px-5">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Bushie MET LYN
          </p>
          <h2 className="font-display mt-2 text-2xl tracking-[-0.03em]">Your face. Their lockup.</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The words stay Bushie and MET LYN. Orange on black, same badge system as the
            finished art. Only the face changes.
          </p>

          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface">
            <img src={active.ref} alt="Bushie MET LYN reference" className="aspect-square w-full object-cover" />
          </div>

          <label className="mt-5 block text-xs font-medium text-muted">Lockup</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {LAYOUTS.map((item) => (
              <Badge key={item.id} active={layout === item.id} onClick={() => setLayout(item.id)}>
                {item.label}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">{active.note}</p>

          {layout === "crest" && (
            <div className="mt-4">
              <Badge active={oneOfOne} onClick={() => setOneOfOne((v) => !v)}>
                1of1 on the ring
              </Badge>
            </div>
          )}

          <label className="mt-5 block text-xs font-medium text-muted">Face photo</label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-fg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void fileToDataUrl(file).then(setPhoto).catch(() => toast.error("Could not read that photo."));
            }}
          />
          {photo && (
            <img src={photo} alt="Uploaded face" className="mt-3 aspect-square w-28 rounded-lg object-cover" />
          )}

          <Button className="mt-5 w-full" size="lg" disabled={busy} onClick={() => void generate()}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Cutting the badge
              </>
            ) : (
              "Make Bushie MET LYN"
            )}
          </Button>
          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Maggie keeps the lockup and the face you used. Download the result as a picture
            or a single HTML file you can send.
          </p>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-thin px-4 py-5 sm:px-6">
        {avatars.length === 0 ? (
          <div className="m-auto flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="font-display text-2xl tracking-[-0.03em]">No badge yet.</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Upload a clear face, pick Badge, Stack, or Crest, then cut it. The type does not change.
            </p>
          </div>
        ) : (
          shown && (
            <div className="mx-auto w-full max-w-xl">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                <img src={shown.imageUrl} alt="Bushie MET LYN avatar" className="aspect-square w-full object-cover" />
                <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
                  <div className="mr-auto text-sm font-medium">Bushie MET LYN</div>
                  <Button variant={shown.liked ? "default" : "secondary"} size="sm" onClick={() => toggleAvatarLike(shown.id)}>
                    <Heart className={`size-3.5 ${shown.liked ? "fill-current" : ""}`} />
                    {shown.liked ? "Kept" : "Keep"}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => void downloadPng(shown.imageUrl)}>
                    <Download className="size-3.5" /> PNG
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => void downloadHtml(shown.imageUrl)}>
                    HTML
                  </Button>
                  <Button variant="ghost" size="icon" className="size-9" aria-label="Remove" onClick={() => removeAvatar(shown.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              {avatars.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {avatars.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelected(a.id)}
                      className={`overflow-hidden rounded-lg border ${shown.id === a.id ? "border-accent/60" : "border-border"}`}
                    >
                      <img src={a.imageUrl} alt="" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </section>
    </div>
  );
}
