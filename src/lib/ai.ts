import { createServerFn } from "@tanstack/react-start";
import { kitPrompt, logoImagePrompt } from "./prompts";
import type { LogoBrief, Message } from "./types";

type ChatOk = { ok: true; text: string };
type ChatErr = { ok: false; error: string };
export type ChatResult = ChatOk | ChatErr;

type ImageOk = { ok: true; url: string };
export type ImageResult = ImageOk | ChatErr;

type KitOk = {
  ok: true;
  kit: {
    palette: { name: string; hex: string }[];
    typePairing: { display: string; body: string; why: string };
    usage: string;
    tagline: string;
  };
};
export type KitResult = KitOk | ChatErr;

type SpeakOk = { ok: true; audio: string; mime: string };
export type SpeakResult = SpeakOk | ChatErr;

type TranscribeOk = { ok: true; text: string };
export type TranscribeResult = TranscribeOk | ChatErr;

function xaiKey(): string | undefined {
  const key = process.env.XAI_API_KEY?.trim();
  return key || undefined;
}

async function chatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: unknown }[],
  maxTokens = 1200,
): Promise<ChatResult> {
  const apiKey = xaiKey();
  if (!apiKey) {
    return {
      ok: false,
      error: "BUP is offline here — AI is not available in this environment.",
    };
  }

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return {
      ok: false,
      error: `BUP could not reach the model (${res.status}).`,
    };
  }

  const body = (await res.json()) as {
    choices?: { message?: { content?: string | { type?: string; text?: string }[] } }[];
  };
  const content = body.choices?.[0]?.message?.content;
  let text = "";
  if (typeof content === "string") text = content;
  else if (Array.isArray(content)) {
    text = content
      .map((part) => (typeof part === "string" ? part : (part.text ?? "")))
      .join("\n")
      .trim();
  }
  return { ok: true, text: text.trim() };
}

type ChatPayload = {
  system: string;
  messages: Pick<Message, "role" | "content" | "images">[];
};

export const chatWithBup = createServerFn({ method: "POST" })
  .validator((input: ChatPayload) => input)
  .handler(async ({ data }): Promise<ChatResult> => {
    const history = data.messages.slice(-16).map((m) => {
      if (m.images && m.images.length > 0) {
        return {
          role: m.role,
          content: [
            ...m.images.slice(0, 3).map((img) => ({
              type: "image_url" as const,
              image_url: { url: img.url },
            })),
            { type: "text" as const, text: m.content || "Look at this." },
          ],
        };
      }
      return { role: m.role, content: m.content };
    });

    return chatCompletion(
      [{ role: "system", content: data.system }, ...history],
      1400,
    );
  });

export const generateLogo = createServerFn({ method: "POST" })
  .validator((input: { brief: LogoBrief }) => input)
  .handler(async ({ data }): Promise<ImageResult> => {
    const apiKey = xaiKey();
    if (!apiKey) {
      return { ok: false, error: "Image generation is not available here." };
    }

    const prompt = logoImagePrompt(data.brief);
    const res = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt,
        n: 1,
        resolution: "1k",
        aspect_ratio: "1:1",
        quality: "low",
        response_format: "url",
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Studio could not render (${res.status}).` };
    }
    const body = (await res.json()) as { data?: { url?: string }[] };
    const url = body.data?.[0]?.url;
    if (!url) return { ok: false, error: "Studio returned an empty frame." };
    return { ok: true, url };
  });

export const buildBrandKit = createServerFn({ method: "POST" })
  .validator((input: { brief: LogoBrief }) => input)
  .handler(async ({ data }): Promise<KitResult> => {
    const result = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You write brand kits as strict JSON. No markdown fences. No commentary.",
        },
        { role: "user", content: kitPrompt(data.brief) },
      ],
      700,
    );
    if (!result.ok) return result;

    try {
      const jsonText = result.text
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      const parsed = JSON.parse(jsonText) as KitOk["kit"];
      if (!Array.isArray(parsed.palette) || !parsed.typePairing) {
        return { ok: false, error: "Brand kit came back incomplete." };
      }
      return { ok: true, kit: parsed };
    } catch {
      return { ok: false, error: "Brand kit could not be parsed." };
    }
  });

export const speakText = createServerFn({ method: "POST" })
  .validator((input: { text: string; voiceId: string }) => input)
  .handler(async ({ data }): Promise<SpeakResult> => {
    const apiKey = xaiKey();
    if (!apiKey) return { ok: false, error: "Voice is not available here." };

    const text = data.text.replace(/\s+/g, " ").trim().slice(0, 900);
    if (!text) return { ok: false, error: "Nothing to say." };

    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text,
        voice_id: data.voiceId || "rex",
        language: "en",
        speed: 0.98,
        output_format: { codec: "mp3", sample_rate: 24000, bit_rate: 128000 },
      }),
    });

    if (!res.ok) return { ok: false, error: `Voice failed (${res.status}).` };

    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: true,
      audio: buf.toString("base64"),
      mime: res.headers.get("content-type") || "audio/mpeg",
    };
  });

export const transcribeAudio = createServerFn({ method: "POST" })
  .validator((input: { audioBase64: string; mimeType: string }) => input)
  .handler(async ({ data }): Promise<TranscribeResult> => {
    const apiKey = xaiKey();
    if (!apiKey) return { ok: false, error: "Listening is not available here." };

    const bytes = Buffer.from(data.audioBase64, "base64");
    const ext = data.mimeType.includes("mp4")
      ? "mp4"
      : data.mimeType.includes("mpeg")
        ? "mp3"
        : data.mimeType.includes("wav")
          ? "wav"
          : "webm";
    const form = new FormData();
    form.append("language", "en");
    form.append(
      "file",
      new Blob([bytes], { type: data.mimeType || "audio/webm" }),
      `speech.${ext}`,
    );

    const res = await fetch("https://api.x.ai/v1/stt", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!res.ok) return { ok: false, error: `Could not hear that (${res.status}).` };
    const body = (await res.json()) as { text?: string };
    const text = (body.text ?? "").trim();
    if (!text) return { ok: false, error: "I didn't catch that." };
    return { ok: true, text };
  });
