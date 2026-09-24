import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LogoBrief,
  LogoWork,
  MemoryItem,
  Message,
  Profile,
  Thread,
  ViewId,
  VoiceId,
} from "./types";
import { uid } from "./utils";

const emptyBrief = (): LogoBrief => ({
  name: "",
  industry: "Fashion",
  style: "street",
  form: "emblem",
  colors: "street orange and ink",
  notes: "",
  background: "ink",
});

const emptyProfile = (): Profile => ({
  name: "",
  role: "",
  styles: [],
  onboarded: false,
  voiceId: "rex",
  autoSpeak: true,
  playSting: true,
});

function newThread(seed?: Partial<Thread>): Thread {
  const now = Date.now();
  return {
    id: uid("th"),
    title: "New session",
    messages: [],
    createdAt: now,
    updatedAt: now,
    ...seed,
  };
}

interface BupState {
  profile: Profile;
  view: ViewId;
  threads: Thread[];
  activeThreadId: string;
  memories: MemoryItem[];
  logos: LogoWork[];
  brief: LogoBrief;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setView: (view: ViewId) => void;
  completeOnboarding: (input: {
    name: string;
    role: string;
    styles: string[];
  }) => void;
  setProfile: (patch: Partial<Profile>) => void;
  setVoice: (voiceId: VoiceId) => void;
  newChat: () => void;
  setActiveThread: (id: string) => void;
  renameThread: (id: string, title: string) => void;
  deleteThread: (id: string) => void;
  appendMessage: (threadId: string, message: Message) => void;
  addMemories: (items: { kind: MemoryItem["kind"]; text: string }[]) => void;
  removeMemory: (id: string) => void;
  patchBrief: (patch: Partial<LogoBrief>) => void;
  applyStudioHint: (hint: {
    name: string;
    industry: string;
    style: string;
    form: LogoBrief["form"];
    colors: string;
    notes: string;
  }) => void;
  addLogo: (work: Omit<LogoWork, "id" | "createdAt" | "liked">) => string;
  toggleLike: (id: string) => void;
  setLogoKit: (id: string, kit: LogoWork["kit"]) => void;
  removeLogo: (id: string) => void;
  resetAll: () => void;
}

export const useBup = create<BupState>()(
  persist(
    (set, get) => {
      const first = newThread();
      return {
        profile: emptyProfile(),
        view: "chat",
        threads: [first],
        activeThreadId: first.id,
        memories: [],
        logos: [],
        brief: emptyBrief(),
        hydrated: false,
        setHydrated: (v) => set({ hydrated: v }),
        setView: (view) => set({ view }),
        completeOnboarding: ({ name, role, styles }) => {
          const memories: MemoryItem[] = [];
          const now = Date.now();
          if (name.trim()) {
            memories.push({
              id: uid("mem"),
              kind: "name",
              text: `Call them ${name.trim()}.`,
              weight: 5,
              createdAt: now,
            });
          }
          if (role.trim()) {
            memories.push({
              id: uid("mem"),
              kind: "fact",
              text: `They work as a ${role.trim()}.`,
              weight: 4,
              createdAt: now,
            });
          }
          if (styles.length) {
            memories.push({
              id: uid("mem"),
              kind: "style",
              text: `Visual taste: ${styles.join(", ")}.`,
              weight: 5,
              createdAt: now,
            });
          }
          set((s) => ({
            profile: { ...s.profile, name: name.trim(), role, styles, onboarded: true },
            memories: [...memories, ...s.memories],
            view: "chat",
          }));
        },
        setProfile: (patch) =>
          set((s) => ({ profile: { ...s.profile, ...patch } })),
        setVoice: (voiceId) =>
          set((s) => ({ profile: { ...s.profile, voiceId } })),
        newChat: () => {
          const thread = newThread();
          set((s) => ({
            threads: [thread, ...s.threads],
            activeThreadId: thread.id,
            view: "chat",
          }));
        },
        setActiveThread: (id) => set({ activeThreadId: id, view: "chat" }),
        renameThread: (id, title) =>
          set((s) => ({
            threads: s.threads.map((t) => (t.id === id ? { ...t, title } : t)),
          })),
        deleteThread: (id) =>
          set((s) => {
            const remaining = s.threads.filter((t) => t.id !== id);
            const threads = remaining.length ? remaining : [newThread()];
            const activeThreadId =
              s.activeThreadId === id ? threads[0].id : s.activeThreadId;
            return { threads, activeThreadId };
          }),
        appendMessage: (threadId, message) =>
          set((s) => ({
            threads: s.threads.map((t) => {
              if (t.id !== threadId) return t;
              const title =
                t.messages.length === 0 && message.role === "user"
                  ? message.content.replace(/\s+/g, " ").trim().slice(0, 42) || t.title
                  : t.title;
              return {
                ...t,
                title,
                messages: [...t.messages, message],
                updatedAt: message.createdAt,
              };
            }),
          })),
        addMemories: (items) =>
          set((s) => {
            const existing = new Set(s.memories.map((m) => m.text.toLowerCase()));
            const next = items
              .map((item) => ({
                id: uid("mem"),
                kind: item.kind,
                text: item.text.trim(),
                weight: item.kind === "style" ? 4 : 3,
                createdAt: Date.now(),
              }))
              .filter((m) => m.text && !existing.has(m.text.toLowerCase()));
            if (!next.length) return s;
            return { memories: [...next, ...s.memories].slice(0, 80) };
          }),
        removeMemory: (id) =>
          set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),
        patchBrief: (patch) =>
          set((s) => ({ brief: { ...s.brief, ...patch } })),
        applyStudioHint: (hint) =>
          set((s) => ({
            brief: {
              ...s.brief,
              name: hint.name || s.brief.name,
              industry: hint.industry || s.brief.industry,
              style: hint.style || s.brief.style,
              form: hint.form || s.brief.form,
              colors: hint.colors || s.brief.colors,
              notes: hint.notes || s.brief.notes,
            },
            view: "studio",
          })),
        addLogo: (work) => {
          const id = uid("lg");
          set((s) => ({
            logos: [{ ...work, id, liked: false, createdAt: Date.now() }, ...s.logos].slice(
              0,
              40,
            ),
          }));
          return id;
        },
        toggleLike: (id) => {
          const { logos, addMemories } = get();
          const logo = logos.find((l) => l.id === id);
          set((s) => ({
            logos: s.logos.map((l) => (l.id === id ? { ...l, liked: !l.liked } : l)),
          }));
          if (logo && !logo.liked) {
            addMemories([
              {
                kind: "style",
                text: `Liked a ${logo.brief.form} for ${logo.brief.name} (${logo.brief.industry}): ${logo.brief.style}, ${logo.brief.colors}.`,
              },
            ]);
          }
        },
        setLogoKit: (id, kit) =>
          set((s) => ({
            logos: s.logos.map((l) => (l.id === id ? { ...l, kit } : l)),
          })),
        removeLogo: (id) =>
          set((s) => ({ logos: s.logos.filter((l) => l.id !== id) })),
        resetAll: () => {
          const thread = newThread();
          set({
            profile: emptyProfile(),
            view: "chat",
            threads: [thread],
            activeThreadId: thread.id,
            memories: [],
            logos: [],
            brief: emptyBrief(),
          });
        },
      };
    },
    {
      name: "bup-ai-v1",
      partialize: (s) => ({
        profile: s.profile,
        view: s.view === "voice" ? "chat" : s.view,
        threads: s.threads.slice(0, 24).map((t) => ({
          ...t,
          messages: t.messages.slice(-40),
        })),
        activeThreadId: s.activeThreadId,
        memories: s.memories,
        logos: s.logos.slice(0, 24),
        brief: s.brief,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function useActiveThread(): Thread | undefined {
  return useBup((s) => s.threads.find((t) => t.id === s.activeThreadId) ?? s.threads[0]);
}
