import { useEffect, useRef, useState } from "react";
import { ArrowUp, ImagePlus, Loader2, Mic, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEmbed } from "@/lib/embed";
import { SUGGESTIONS } from "@/lib/prompts";
import { sendToBup } from "@/lib/send";
import { useActiveThread, useBup } from "@/lib/store";
import { fileToDataUrl, formatRelative } from "@/lib/utils";
import { BupMark } from "./mark";

export function ChatPane() {
  const embed = useEmbed();
  const thread = useActiveThread();
  const profile = useBup((s) => s.profile);
  const applyStudioHint = useBup((s) => s.applyStudioHint);
  const newChat = useBup((s) => s.newChat);
  const threads = useBup((s) => s.threads);
  const setActiveThread = useBup((s) => s.setActiveThread);
  const setView = useBup((s) => s.setView);

  const [draft, setDraft] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const messages = thread?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, busy]);

  async function onSend(text = draft) {
    if (busy) return;
    const trimmed = text.trim();
    if (!trimmed && !pendingImage) return;
    setDraft("");
    const images = pendingImage ? [{ url: pendingImage }] : undefined;
    setPendingImage(null);
    setBusy(true);
    try {
      await sendToBup({ text: trimmed, images });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "BUP could not reply.");
    } finally {
      setBusy(false);
      areaRef.current?.focus();
    }
  }

  async function onFile(file?: File) {
    if (!file) return;
    try {
      const url = await fileToDataUrl(file);
      setPendingImage(url);
    } catch {
      toast.error("Could not read that image.");
    }
  }

  return (
    <div className="flex h-full min-h-0">
      {!embed && (
        <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
          <div className="flex items-center justify-between px-3 py-3">
            <span className="font-display text-xs font-medium tracking-[0.2em] text-muted">
              Sessions
            </span>
            <Button variant="ghost" size="icon" className="size-8" onClick={newChat} aria-label="New session">
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-3">
            {threads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveThread(t.id)}
                className={`mb-1 w-full rounded-md px-2.5 py-2 text-left transition-colors duration-150 ${
                  t.id === thread?.id ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg"
                }`}
              >
                <div className="truncate text-sm">{t.title}</div>
                <div className="mt-0.5 text-[11px] text-subtle">{formatRelative(t.updatedAt)}</div>
              </button>
            ))}
          </div>
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {embed && (
          <div className="border-b border-accent/20 bg-accent/10 px-4 py-2">
            <p className="text-[11px] leading-relaxed text-accent">
              Paste a Design DNA brief for personalised merch concepts. Studio is in the full app.
            </p>
          </div>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 sm:px-8">
          {messages.length === 0 && !busy ? (
            <EmptyChat
              name={profile.name}
              embed={embed}
              onSuggest={(t) => void onSend(t)}
            />
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
              {messages.map((m) => (
                <article
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-md border border-border bg-raised px-3.5 py-2.5 text-sm leading-relaxed"
                      : "max-w-[92%] text-sm leading-relaxed text-fg"
                  }
                >
                  {m.images?.map((img) => (
                    <img
                      key={img.url}
                      src={img.url}
                      alt=""
                      className="mb-2 max-h-48 rounded-md border border-border object-cover"
                    />
                  ))}
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.studioHint && m.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => {
                        applyStudioHint(m.studioHint!);
                        setView("studio");
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/20"
                    >
                      <Sparkles className="size-3.5" />
                      Open in Studio
                    </button>
                  )}
                </article>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="size-4 animate-spin text-accent" />
                  Working…
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border bg-bg/90 px-3 py-3 backdrop-blur-sm sm:px-6">
          <div className="mx-auto max-w-2xl">
            {pendingImage && (
              <div className="mb-2 flex items-center gap-2">
                <img
                  src={pendingImage}
                  alt="Attached"
                  className="h-12 w-12 rounded-md border border-border object-cover"
                />
                <Button variant="ghost" size="sm" onClick={() => setPendingImage(null)}>
                  Remove
                </Button>
              </div>
            )}
            <div className="flex items-end gap-2 rounded-md border border-border bg-surface p-2 focus-within:border-accent">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-10 shrink-0"
                onClick={() => fileRef.current?.click()}
                aria-label="Attach image"
              >
                <ImagePlus className="size-4" />
              </Button>
              <textarea
                ref={areaRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void onSend();
                  }
                }}
                placeholder={embed ? "Paste a brief or Design DNA…" : "Brief BUP…"}
                className="max-h-36 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-sm text-fg placeholder:text-subtle focus:outline-none"
              />
              {!embed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0"
                  onClick={() => setView("voice")}
                  aria-label="Voice"
                >
                  <Mic className="size-4" />
                </Button>
              )}
              <Button
                size="icon"
                className="size-10 shrink-0"
                disabled={busy || (!draft.trim() && !pendingImage)}
                onClick={() => void onSend()}
                aria-label="Send"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] tracking-[0.18em] text-subtle uppercase">
              {embed ? "Powered by BUP AI · Gets smarter with every order" : "Enter to send · Shift+Enter for a new line"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChat({
  name,
  embed,
  onSuggest,
}: {
  name: string;
  embed: boolean;
  onSuggest: (text: string) => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-2 pt-8 text-center sm:pt-14">
      <BupMark size={44} className="text-accent box-glow rounded-lg" />
      <h2 className="font-display mt-6 text-3xl font-bold sm:text-4xl">
        {name ? `${name.split(" ")[0]}.` : embed ? "Maggie." : "BUP."}
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        {embed
          ? "Custom merch, logos, print calls. Paste a Design DNA brief and I will run with it."
          : "I learn how you see. Marks, merch, type, color — built for Beefed Up Printing."}
      </p>
      <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onSuggest(s.text)}
            className="rounded-md border border-border bg-surface px-4 py-3 text-left hover:border-accent"
          >
            <span className="block font-display text-xs font-semibold tracking-[0.16em] text-fg">
              {s.label}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted">
              {s.text.length > 72 ? `${s.text.slice(0, 72)}…` : s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
