import { createServerFn } from "@tanstack/react-start";
import { avatarImagePrompt, kitPrompt, logoImagePrompt } from "./prompts";
import type { AvatarLayout, LogoBrief, Message } from "./types";

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

async function editImage(
  apiKey: string,
  prompt: string,
  images: string[],
): Promise<ImageResult> {
  const bodies = [
    {
      model: "grok-imagine-image-2.0",
      prompt,
      images: images.map((url) => ({ url, type: "image_url" })),
      n: 1,
      aspect_ratio: "1:1",
      resolution: "1k",
      response_format: "url",
    },
    {
      model: "grok-imagine-image-2.0",
      prompt,
      image: { url: images[0], type: "image_url" },
      n: 1,
      response_format: "url",
    },
  ];

  let last = "Studio could not render.";
  for (const body of bodies) {
    const res = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 160);
      last = `Studio could not render (${res.status}). ${detail}`;
      continue;
    }
    const json = (await res.json()) as { data?: { url?: string; b64_json?: string }[] };
    const url = json.data?.[0]?.url;
    const b64 = json.data?.[0]?.b64_json;
    if (url) return { ok: true, url };
    if (b64) return { ok: true, url: `data:image/jpeg;base64,${b64}` };
    last = "Studio returned an empty frame.";
  }
  return { ok: false, error: last };
}

export const generateAvatar = createServerFn({ method: "POST" })
  .validator(
    (input: { photo: string; style: string; layout: AvatarLayout; oneOfOne: boolean }) => input,
  )
  .handler(async ({ data }): Promise<ImageResult> => {
    const apiKey = xaiKey();
    if (!apiKey) return { ok: false, error: "Image generation is not available here." };
    if (!data.photo.startsWith("data:image/") || data.photo.length > 2_400_000) {
      return { ok: false, error: "That photo is too large. Use a closer crop." };
    }
    const prompt = avatarImagePrompt(data.layout, data.oneOfOne);
    const images = data.style.startsWith("data:image/") ? [data.photo, data.style] : [data.photo];
    return editImage(apiKey, prompt, images);
  });

export type SunoRead = {
  prompt: string;
  mood: string;
  note: string;
};

export const writeSunoPrompt = createServerFn({ method: "POST" })
  .validator(
    (input: {
      bpm: number | null;
      durationSec: number;
      energy: number;
      spectrum: string;
      transcript: string;
      notes: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<{ ok: true; read: SunoRead } | ChatErr> => {
    const result = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You write Suno style prompts from measured audio only. Return JSON only. Never invent vocal gender, a language, or instruments that the transcript and measurements do not support. The BPM in the prompt must be the measured BPM.",
        },
        {
          role: "user",
          content: `Measured BPM: ${data.bpm ?? "unknown"}
Duration seconds: ${Math.round(data.durationSec)}
Energy 1-10: ${data.energy}
Spectrum: ${data.spectrum}
Transcript (empty means you must NOT claim vocals): ${data.transcript.slice(0, 700) || "(none)"}
User notes: ${data.notes.slice(0, 240) || "(none)"}

Return {"prompt":"one comma-separated Suno style line under 280 characters","mood":"two or three words","note":"one sentence on what you refused to guess"}`,
        },
      ],
      400,
    );
    if (!result.ok) return result;
    try {
      const jsonText = result.text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(jsonText) as SunoRead;
      if (!parsed.prompt) return { ok: false, error: "Suno line came back empty." };
      return {
        ok: true,
        read: {
          prompt: String(parsed.prompt).slice(0, 320),
          mood: String(parsed.mood ?? "").slice(0, 48),
          note: String(parsed.note ?? "").slice(0, 220),
        },
      };
    } catch {
      return { ok: false, error: "Suno line could not be parsed." };
    }
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
