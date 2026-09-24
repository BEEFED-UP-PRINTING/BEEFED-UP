import type { MemoryKind, StudioHint, LogoForm } from "./types";

const FORMS: LogoForm[] = [
  "wordmark",
  "monogram",
  "emblem",
  "pictorial",
  "abstract",
  "lettermark",
];

function attr(tag: string, name: string): string {
  const re = new RegExp(`${name}="([^"]*)"`, "i");
  return tag.match(re)?.[1]?.trim() ?? "";
}

export function parseAssistantText(raw: string): {
  content: string;
  memories: { kind: MemoryKind; text: string }[];
  studioHint?: StudioHint;
} {
  const memories: { kind: MemoryKind; text: string }[] = [];
  let studioHint: StudioHint | undefined;

  let text = raw.replace(
    /<memory\s+kind="(fact|style|goal|name)">([\s\S]*?)<\/memory>/gi,
    (_m, kind: MemoryKind, body: string) => {
      const t = body.replace(/\s+/g, " ").trim();
      if (t) memories.push({ kind, text: t });
      return "";
    },
  );

  text = text.replace(/<studio\b([^>]*)\/>/gi, (_m, attrs: string) => {
    const formRaw = attr(attrs, "form").toLowerCase() as LogoForm;
    studioHint = {
      name: attr(attrs, "name") || "Untitled",
      industry: attr(attrs, "industry"),
      style: attr(attrs, "style"),
      form: FORMS.includes(formRaw) ? formRaw : "wordmark",
      colors: attr(attrs, "colors"),
      notes: attr(attrs, "notes"),
    };
    return "";
  });

  text = text.replace(/<studio\b([^>]*)>([\s\S]*?)<\/studio>/gi, (_m, attrs: string, body: string) => {
    const formRaw = attr(attrs, "form").toLowerCase() as LogoForm;
    studioHint = {
      name: attr(attrs, "name") || "Untitled",
      industry: attr(attrs, "industry"),
      style: attr(attrs, "style"),
      form: FORMS.includes(formRaw) ? formRaw : "wordmark",
      colors: attr(attrs, "colors"),
      notes: attr(attrs, "notes") || body.trim(),
    };
    return "";
  });

  return { content: text.replace(/\n{3,}/g, "\n\n").trim(), memories, studioHint };
}

export function titleFromText(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New session";
  return clean.length > 42 ? `${clean.slice(0, 42).trim()}…` : clean;
}
