import { chatWithBup } from "./ai";
import { parseAssistantText } from "./parse";
import { buildSystemPrompt } from "./prompts";
import { useBup } from "./store";
import { uid } from "./utils";
import { speak } from "./voice";
import type { ChatImage } from "./types";

export async function sendToBup(opts: {
  text: string;
  images?: ChatImage[];
  speakReply?: boolean;
}): Promise<string> {
  const text = opts.text.trim();
  if (!text && !opts.images?.length) return "";

  const state = useBup.getState();
  const threadId = state.activeThreadId;
  const userMsg = {
    id: uid("m"),
    role: "user" as const,
    content: text || "Look at this.",
    createdAt: Date.now(),
    images: opts.images,
  };
  state.appendMessage(threadId, userMsg);

  const next = useBup.getState();
  const thread = next.threads.find((t) => t.id === threadId);
  const system = buildSystemPrompt(next.profile, next.memories);

  const result = await chatWithBup({
    data: {
      system,
      messages: (thread?.messages ?? []).map((m) => ({
        role: m.role,
        content: m.content,
        images: m.images,
      })),
    },
  });

  if (!result.ok) {
    next.appendMessage(threadId, {
      id: uid("m"),
      role: "assistant",
      content: result.error,
      createdAt: Date.now(),
    });
    throw new Error(result.error);
  }

  const parsed = parseAssistantText(result.text);
  if (parsed.memories.length) next.addMemories(parsed.memories);

  next.appendMessage(threadId, {
    id: uid("m"),
    role: "assistant",
    content: parsed.content || "Noted.",
    createdAt: Date.now(),
    studioHint: parsed.studioHint,
  });

  if (opts.speakReply && parsed.content) {
    try {
      await speak(parsed.content, next.profile.voiceId);
    } catch {
      // voice is optional
    }
  }

  return parsed.content;
}
