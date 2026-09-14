import { useEffect, useState } from "react";
import { MessageSquare, Mic, Plus, Sparkles, UserRound } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { useBup } from "@/lib/store";
import type { ViewId } from "@/lib/types";
import { ChatPane } from "./chat-pane";
import { MemoryPane } from "./memory-pane";
import { BupMark } from "./mark";
import { Onboarding } from "./onboarding";
import { StudioPane } from "./studio-pane";
import { VoicePane } from "./voice-pane";

const NAV: { id: ViewId; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "studio", label: "Studio", icon: Sparkles },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "memory", label: "Memory", icon: UserRound },
];

export function AppShell() {
  const hydrated = useBup((s) => s.hydrated);
  const setHydrated = useBup((s) => s.setHydrated);
  const onboarded = useBup((s) => s.profile.onboarded);
  const view = useBup((s) => s.view);
  const setView = useBup((s) => s.setView);
  const newChat = useBup((s) => s.newChat);
  const [installEvent, setInstallEvent] = useState<{ prompt: () => Promise<unknown> } | null>(
    null,
  );

  useEffect(() => {
    const unsub = useBup.persist.onFinishHydration(() => setHydrated(true));
    if (useBup.persist.hasHydrated()) setHydrated(true);
    const t = window.setTimeout(() => setHydrated(true), 800);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, [setHydrated]);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      const ev = e as Event & { prompt: () => Promise<unknown> };
      setInstallEvent(ev);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg text-fg">
        <div className="flex flex-col items-center">
          <BupMark size={48} className="text-accent" />
          <p className="mt-5 text-xs font-medium tracking-[0.22em] text-muted uppercase">
            BUP AI
          </p>
        </div>
      </div>
    );
  }

  if (!onboarded) return <Onboarding />;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-4">
        <BupMark size={28} className="text-accent" />
        <div className="min-w-0">
          <div className="text-sm font-medium leading-none">BUP AI</div>
          <div className="mt-1 hidden text-[11px] text-subtle sm:block">
            From nothing to something.
          </div>
        </div>
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Button
              key={item.id}
              variant={view === item.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView(item.id)}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {installEvent && (
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => {
                void installEvent.prompt();
                setInstallEvent(null);
              }}
            >
              Install
            </Button>
          )}
          <Button variant="ghost" size="icon" className="size-10 md:size-9" onClick={newChat} aria-label="New chat">
            <Plus className="size-4" />
          </Button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        {view === "chat" && <ChatPane />}
        {view === "studio" && <StudioPane />}
        {view === "voice" && <VoicePane />}
        {view === "memory" && <MemoryPane />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        <div className="grid grid-cols-4">
          {NAV.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] ${
                  active ? "text-fg" : "text-subtle"
                }`}
              >
                <item.icon className="size-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "bg-raised text-fg border border-border",
          },
        }}
      />
    </div>
  );
}
