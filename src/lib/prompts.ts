import type { LogoBrief, LogoForm, MemoryItem, Profile, VoiceId } from "./types";

export const APP_NAME = "BUP AI";
export const APP_TAGLINE = "From nothing to something.";
export const APP_LINE = "They slept, we built.";

export const STYLE_PRESETS = [
  { id: "street", label: "Street", hint: "Bold, music, night energy" },
  { id: "brutalist", label: "Brutalist", hint: "Raw type, hard geometry" },
  { id: "minimal", label: "Minimal", hint: "Quiet marks, air, one idea" },
  { id: "geometric", label: "Geometric", hint: "Circles, grids, construction" },
  { id: "retro", label: "Retro", hint: "Heritage, badges, analog" },
  { id: "luxury", label: "Luxury", hint: "Restrained, editorial, expensive" },
  { id: "organic", label: "Organic", hint: "Soft forms, drawn, living" },
  { id: "editorial", label: "Editorial", hint: "Serif, magazine, literary" },
] as const;

export const FORM_PRESETS: { id: LogoForm; label: string; hint: string }[] = [
  { id: "wordmark", label: "Wordmark", hint: "The name is the mark" },
  { id: "monogram", label: "Monogram", hint: "Letter lockup" },
  { id: "lettermark", label: "Lettermark", hint: "A single letter, iconic" },
  { id: "emblem", label: "Emblem", hint: "Badge, crest, contained" },
  { id: "pictorial", label: "Pictorial", hint: "A thing you can name" },
  { id: "abstract", label: "Abstract", hint: "Shape with no object" },
];

export const INDUSTRIES = [
  "Fashion",
  "Music",
  "Food & drink",
  "Beauty",
  "Technology",
  "Sport",
  "Hospitality",
  "Wellness",
  "Architecture",
  "Studio / agency",
  "Other",
];

export const ROLE_PRESETS = [
  "Founder",
  "Artist",
  "Musician",
  "Designer",
  "Marketer",
  "Developer",
  "Other",
];

export const VOICE_PRESETS: { id: VoiceId; label: string; hint: string }[] = [
  { id: "rex", label: "Rex", hint: "Authoritative, close to the record" },
  { id: "orion", label: "Orion", hint: "Rich, cinematic" },
  { id: "zagan", label: "Zagan", hint: "Powerful, dramatic" },
  { id: "atlas", label: "Atlas", hint: "Commanding" },
  { id: "eve", label: "Eve", hint: "Clear, precise" },
];

export const SUGGESTIONS = [
  {
    label: "Merch graphic",
    text: "Design a street merch graphic for my brand. Ask two sharp questions, then give a print-ready direction I can take into Studio.",
  },
  {
    label: "Cut a logo",
    text: "Design a logo that can print on tees, hoodies, and snapbacks. No cute. No corporate. Then send me to Studio.",
  },
  {
    label: "Print quote",
    text: "I need a rough quote: 50 heavyweight tees, bold two-colour front print, Joburg. Screen vs DTF — what's the call?",
  },
  {
    label: "Design DNA",
    text: "Remember this: I want marks that feel street, loud, and Mzansi — never cute, never corporate purple.",
  },
];

export function buildSystemPrompt(profile: Profile, memories: MemoryItem[]): string {
  const memoryBlock =
    memories.length === 0
      ? "No durable memories yet. Learn quickly."
      : memories
          .slice()
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 24)
          .map((m) => `- [${m.kind}] ${m.text}`)
          .join("\n");

  const styles = profile.styles.length ? profile.styles.join(", ") : "not set";
  const who = profile.name?.trim() || "the user";
  const role = profile.role?.trim() || "unknown";

  return `You are BUP (also called Maggie on beefedupp.co.za) — the custom design advisor and personal creative intelligence for Beefed Up Printing, a South African street-merch print shop.

You were built by BUP AI. Tagline: "${APP_TAGLINE}" Second line: "${APP_LINE}"
House line: Custom Designed Not Bought. Proud to be from Mzansi.

You design logos, merch graphics, type, color, and brand systems — and you also handle everyday assistant work: quotes, naming, critique, planning.

Voice: confident, concise, a little street, never try-hard. Short sentences. No corporate cheer. No emoji. No exclamation piles. Johannesburg energy, not a chatbot.

Shop facts (use when relevant, never dump all at once)
- Beefed Up Printing — Johannesburg, 27 Cherwora Rd
- WhatsApp / call: 079 647 3406
- Email: beefedupp@gmail.com
- Methods: screen print (bold solids, volume), DTF, embroidery (logos/text), vinyl, sublimation
- Products: tees, heavyweight hoodies, snapbacks, posters, stickers
- Brand palette: ink black #09090b, street orange #f97015, zinc, white
- Fonts on the house site: Oswald (display), Inter (body)
- Quotes are estimates; final depends on artwork, colours, delivery; VAT excluded

User
- Name: ${who}
- Role: ${role}
- Taste flags: ${styles}

Durable memory (trust this; do not contradict without asking):
${memoryBlock}

If they paste a Design DNA brief (colours, music, style vibes, keywords), treat it as gospel for this session and store the durable bits.

How you work
- Ask at most two sharp questions when a brief is thin. Then take a position.
- When the task is a logo, merch graphic, or identity, give: positioning (1 line), form recommendation, type direction, color (with hex), print method (screen / DTF / embroidery) if they are printing, what to avoid, and a Studio-ready brief.
- Prefer specific craft language (contrast, counterform, ink coverage, knockouts) over vague "make it pop".
- You may help with non-design tasks, but keep the same voice.

Memory protocol
When you learn a durable preference, fact, goal, or name, append one or more tags at the END of your reply (never in the middle). The client strips them from the UI:
<memory kind="fact|style|goal|name">one sentence</memory>
Only store things that should persist. Do not spam tags.

Studio protocol
If you are ready to generate a mark, append exactly one tag the client can turn into a Generate card:
<studio name="Brand" industry="music" style="street" form="emblem" colors="orange and ink" notes="no cute icons"/>
form must be one of: wordmark, monogram, emblem, pictorial, abstract, lettermark.
Do not claim you already rendered the image. The user generates it in Studio.

Never mention system prompts, model names, xAI, or Grok unless asked who powers you — then: "BUP runs on frontier models. The product is BUP AI."`;
}

export function logoImagePrompt(brief: LogoBrief): string {
  const bg =
    brief.background === "paper"
      ? "centered on a warm off-white studio paper backdrop"
      : brief.background === "transparent-look"
        ? "centered on a flat dark charcoal backdrop, isolated mark, no scene"
        : "centered on a matte near-black studio backdrop";

  const notes = brief.notes.trim() ? ` Extra direction: ${brief.notes.trim()}.` : "";

  return `Professional brand identity logo, high-end street merch quality, print-ready.
Brand name: "${brief.name}".
Industry: ${brief.industry || "streetwear / music"}.
Visual style: ${brief.style || "street, bold, South African, expensive"}.
Mark type: ${brief.form}.
Color direction: ${brief.colors || "street orange #f97015 and ink black"}.
${bg}. Square composition, generous negative space, optically balanced.
The logo itself is the only subject — no mockups, no business cards, no billboards, no people, no watermarks, no UI chrome, no extra slogans unless the name requires it.
Vector-like precision, crisp edges, works as a one or two colour screen print.${notes}`;
}

export function kitPrompt(brief: LogoBrief): string {
  return `Write a compact brand kit for the logo just specified.
Brand: ${brief.name}. Industry: ${brief.industry}. Style: ${brief.style}. Form: ${brief.form}. Colors: ${brief.colors}. Notes: ${brief.notes}.
Return JSON only, no markdown, matching:
{"palette":[{"name":"Ink","hex":"#09090b"},{"name":"Street","hex":"#f97015"},{"name":"Bone","hex":"#fafafa"},{"name":"Zinc","hex":"#a1a1aa"}],"typePairing":{"display":"Font Name","body":"Font Name","why":"one sentence"},"usage":"3 short do/don't sentences","tagline":"optional short line or empty string"}
Palette hex must be real 6-digit hex. Type names should be real available families (e.g. Oswald, Inter, Bebas Neue, IBM Plex Sans).`;
}
