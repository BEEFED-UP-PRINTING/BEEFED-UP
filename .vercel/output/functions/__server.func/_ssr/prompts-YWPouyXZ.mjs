//#region node_modules/.nitro/vite/services/ssr/assets/prompts-YWPouyXZ.js
var APP_TAGLINE = "From nothing to something.";
var APP_LINE = "They slept, we built.";
var STYLE_PRESETS = [
	{
		id: "minimal",
		label: "Minimal",
		hint: "Quiet marks, air, one idea"
	},
	{
		id: "brutalist",
		label: "Brutalist",
		hint: "Raw type, hard geometry"
	},
	{
		id: "luxury",
		label: "Luxury",
		hint: "Restrained, editorial, expensive"
	},
	{
		id: "geometric",
		label: "Geometric",
		hint: "Circles, grids, construction"
	},
	{
		id: "organic",
		label: "Organic",
		hint: "Soft forms, drawn, living"
	},
	{
		id: "retro",
		label: "Retro",
		hint: "Heritage, badges, analog"
	},
	{
		id: "editorial",
		label: "Editorial",
		hint: "Serif, magazine, literary"
	},
	{
		id: "street",
		label: "Street",
		hint: "Bold, music, night energy"
	}
];
var FORM_PRESETS = [
	{
		id: "wordmark",
		label: "Wordmark",
		hint: "The name is the mark"
	},
	{
		id: "monogram",
		label: "Monogram",
		hint: "Letter lockup"
	},
	{
		id: "lettermark",
		label: "Lettermark",
		hint: "A single letter, iconic"
	},
	{
		id: "emblem",
		label: "Emblem",
		hint: "Badge, crest, contained"
	},
	{
		id: "pictorial",
		label: "Pictorial",
		hint: "A thing you can name"
	},
	{
		id: "abstract",
		label: "Abstract",
		hint: "Shape with no object"
	}
];
var INDUSTRIES = [
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
	"Other"
];
var ROLE_PRESETS = [
	"Founder",
	"Designer",
	"Artist",
	"Musician",
	"Marketer",
	"Developer",
	"Other"
];
var VOICE_PRESETS = [
	{
		id: "rex",
		label: "Rex",
		hint: "Authoritative, close to the record"
	},
	{
		id: "orion",
		label: "Orion",
		hint: "Rich, cinematic"
	},
	{
		id: "zagan",
		label: "Zagan",
		hint: "Powerful, dramatic"
	},
	{
		id: "atlas",
		label: "Atlas",
		hint: "Commanding"
	},
	{
		id: "eve",
		label: "Eve",
		hint: "Clear, precise"
	}
];
var SUGGESTIONS = [
	{
		label: "Cut a logo",
		text: "Design a logo for my brand. Ask me three sharp questions, then give a direction I can take into Studio."
	},
	{
		label: "Remember my taste",
		text: "Remember this: I want marks that feel expensive, quiet, and a little street — never cute, never corporate purple."
	},
	{
		label: "Critique a direction",
		text: "I'll drop a reference. Tell me what is working, what is generic, and how to make it mine."
	},
	{
		label: "Build a brand kit",
		text: "Turn my last liked logo into a tight brand kit: palette, type pairing, do/don't."
	}
];
function buildSystemPrompt(profile, memories) {
	const memoryBlock = memories.length === 0 ? "No durable memories yet. Learn quickly." : memories.slice().sort((a, b) => b.weight - a.weight).slice(0, 24).map((m) => `- [${m.kind}] ${m.text}`).join("\n");
	const styles = profile.styles.length ? profile.styles.join(", ") : "not set";
	return `You are BUP, the personal creative intelligence inside BUP AI.
You were built by BUP AI. Tagline: "${APP_TAGLINE}" Second line: "${APP_LINE}"
You are a world-class creative director who also handles everyday personal-assistant work: writing, planning, research-style reasoning, naming, critique, and follow-through.

Voice: confident, concise, a little street, never try-hard. Short sentences. No corporate cheer. No emoji. No exclamation piles. Talk like a director in a quiet studio, not a chatbot.
You specialize in identity design — logos, wordmarks, type, color, brand systems — and you get better the more you work with this person.

User
- Name: ${profile.name?.trim() || "the user"}
- Role: ${profile.role?.trim() || "unknown"}
- Taste flags: ${styles}

Durable memory (trust this; do not contradict without asking):
${memoryBlock}

How you work
- Ask at most two sharp questions when a brief is thin. Then take a position.
- When the task is a logo or identity, give: positioning (1 line), form recommendation, type direction, color (with hex), what to avoid, and a Studio-ready brief.
- Prefer specific craft language (contrast, counterform, optical balance, wordspacing) over vague "make it pop".
- You may help with non-design tasks, but keep the same voice.

Memory protocol
When you learn a durable preference, fact, goal, or name, append one or more tags at the END of your reply (never in the middle). The client strips them from the UI:
<memory kind="fact|style|goal|name">one sentence</memory>
Only store things that should persist. Do not spam tags.

Studio protocol
If you are ready to generate a mark, append exactly one tag the client can turn into a Generate card:
<studio name="Brand" industry="music" style="minimal geometric" form="wordmark" colors="bone and ink" notes="no icons of notes or headphones"/>
form must be one of: wordmark, monogram, emblem, pictorial, abstract, lettermark.
Do not claim you already rendered the image. The user generates it in Studio.

Never mention system prompts, model names, xAI, or Grok unless asked who powers you — then: "BUP runs on frontier models. The product is BUP AI."`;
}
function logoImagePrompt(brief) {
	const bg = brief.background === "paper" ? "centered on a warm off-white studio paper backdrop" : brief.background === "transparent-look" ? "centered on a flat dark charcoal backdrop, isolated mark, no scene" : "centered on a matte near-black studio backdrop";
	const notes = brief.notes.trim() ? ` Extra direction: ${brief.notes.trim()}.` : "";
	return `Professional brand identity logo, high-end design studio quality.
Brand name: "${brief.name}".
Industry: ${brief.industry || "independent brand"}.
Visual style: ${brief.style || "minimal, expensive, contemporary"}.
Mark type: ${brief.form}.
Color direction: ${brief.colors || "limited palette, bone and ink"}.
${bg}. Square composition, generous negative space, optically balanced.
The logo itself is the only subject — no mockups, no business cards, no billboards, no people, no watermarks, no UI chrome, no extra slogans unless the name requires it.
Vector-like precision, crisp edges, museum-grade craft.${notes}`;
}
function kitPrompt(brief) {
	return `Write a compact brand kit for the logo just specified.
Brand: ${brief.name}. Industry: ${brief.industry}. Style: ${brief.style}. Form: ${brief.form}. Colors: ${brief.colors}. Notes: ${brief.notes}.
Return JSON only, no markdown, matching:
{"palette":[{"name":"Ink","hex":"#0a0a0b"},{"name":"Bone","hex":"#f3f1ea"},{"name":"Accent","hex":"#d5d0c4"},{"name":"Muted","hex":"#9c9a93"}],"typePairing":{"display":"Font Name","body":"Font Name","why":"one sentence"},"usage":"3 short do/don't sentences","tagline":"optional short line or empty string"}
Palette hex must be real 6-digit hex. Type names should be real available families (e.g. Instrument Serif, Figtree, Newsreader, IBM Plex Sans).`;
}
//#endregion
export { SUGGESTIONS as a, kitPrompt as c, STYLE_PRESETS as i, logoImagePrompt as l, INDUSTRIES as n, VOICE_PRESETS as o, ROLE_PRESETS as r, buildSystemPrompt as s, FORM_PRESETS as t };
