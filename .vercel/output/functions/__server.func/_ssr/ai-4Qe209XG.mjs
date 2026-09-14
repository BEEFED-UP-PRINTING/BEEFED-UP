import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { c as kitPrompt, l as logoImagePrompt } from "./prompts-YWPouyXZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-4Qe209XG.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function xaiKey() {
	return process.env.XAI_API_KEY?.trim() || void 0;
}
async function chatCompletion(messages, maxTokens = 1200) {
	const apiKey = xaiKey();
	if (!apiKey) return {
		ok: false,
		error: "BUP is offline here — AI is not available in this environment."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages,
			max_tokens: maxTokens,
			temperature: .7
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `BUP could not reach the model (${res.status}).`
	};
	const content = (await res.json()).choices?.[0]?.message?.content;
	let text = "";
	if (typeof content === "string") text = content;
	else if (Array.isArray(content)) text = content.map((part) => typeof part === "string" ? part : part.text ?? "").join("\n").trim();
	return {
		ok: true,
		text: text.trim()
	};
}
var chatWithBup_createServerFn_handler = createServerRpc({
	id: "bf70c4959d0be5f77efb1297f804c11fbcf14d12dd78eb1e4fc93f86479416bf",
	name: "chatWithBup",
	filename: "src/lib/ai.ts"
}, (opts) => chatWithBup.__executeServer(opts));
var chatWithBup = createServerFn({ method: "POST" }).validator((input) => input).handler(chatWithBup_createServerFn_handler, async ({ data }) => {
	const history = data.messages.slice(-16).map((m) => {
		if (m.images && m.images.length > 0) return {
			role: m.role,
			content: [...m.images.slice(0, 3).map((img) => ({
				type: "image_url",
				image_url: { url: img.url }
			})), {
				type: "text",
				text: m.content || "Look at this."
			}]
		};
		return {
			role: m.role,
			content: m.content
		};
	});
	return chatCompletion([{
		role: "system",
		content: data.system
	}, ...history], 1400);
});
var generateLogo_createServerFn_handler = createServerRpc({
	id: "e7b7368ab1d3a1015c6d03105670c7bf3c3e92adb7fc1619b0ad9a9665d348a0",
	name: "generateLogo",
	filename: "src/lib/ai.ts"
}, (opts) => generateLogo.__executeServer(opts));
var generateLogo = createServerFn({ method: "POST" }).validator((input) => input).handler(generateLogo_createServerFn_handler, async ({ data }) => {
	const apiKey = xaiKey();
	if (!apiKey) return {
		ok: false,
		error: "Image generation is not available here."
	};
	const prompt = logoImagePrompt(data.brief);
	const res = await fetch("https://api.x.ai/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-imagine-image-2.0",
			prompt,
			n: 1,
			resolution: "1k",
			aspect_ratio: "1:1",
			quality: "low",
			response_format: "url"
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Studio could not render (${res.status}).`
	};
	const url = (await res.json()).data?.[0]?.url;
	if (!url) return {
		ok: false,
		error: "Studio returned an empty frame."
	};
	return {
		ok: true,
		url
	};
});
var buildBrandKit_createServerFn_handler = createServerRpc({
	id: "257eeb794f8f1f05501739aa6f39032c59cce2c5043cf5b2732af40cc39d410f",
	name: "buildBrandKit",
	filename: "src/lib/ai.ts"
}, (opts) => buildBrandKit.__executeServer(opts));
var buildBrandKit = createServerFn({ method: "POST" }).validator((input) => input).handler(buildBrandKit_createServerFn_handler, async ({ data }) => {
	const result = await chatCompletion([{
		role: "system",
		content: "You write brand kits as strict JSON. No markdown fences. No commentary."
	}, {
		role: "user",
		content: kitPrompt(data.brief)
	}], 700);
	if (!result.ok) return result;
	try {
		const jsonText = result.text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
		const parsed = JSON.parse(jsonText);
		if (!Array.isArray(parsed.palette) || !parsed.typePairing) return {
			ok: false,
			error: "Brand kit came back incomplete."
		};
		return {
			ok: true,
			kit: parsed
		};
	} catch {
		return {
			ok: false,
			error: "Brand kit could not be parsed."
		};
	}
});
var speakText_createServerFn_handler = createServerRpc({
	id: "407ee3be710dfbc3f2165d6afb2dde20e9b7d960c8a5e849229e0e321d8ba18c",
	name: "speakText",
	filename: "src/lib/ai.ts"
}, (opts) => speakText.__executeServer(opts));
var speakText = createServerFn({ method: "POST" }).validator((input) => input).handler(speakText_createServerFn_handler, async ({ data }) => {
	const apiKey = xaiKey();
	if (!apiKey) return {
		ok: false,
		error: "Voice is not available here."
	};
	const text = data.text.replace(/\s+/g, " ").trim().slice(0, 900);
	if (!text) return {
		ok: false,
		error: "Nothing to say."
	};
	const res = await fetch("https://api.x.ai/v1/tts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			text,
			voice_id: data.voiceId || "rex",
			language: "en",
			speed: .98,
			output_format: {
				codec: "mp3",
				sample_rate: 24e3,
				bit_rate: 128e3
			}
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Voice failed (${res.status}).`
	};
	return {
		ok: true,
		audio: Buffer.from(await res.arrayBuffer()).toString("base64"),
		mime: res.headers.get("content-type") || "audio/mpeg"
	};
});
var transcribeAudio_createServerFn_handler = createServerRpc({
	id: "3a5282c1eae0c4909cde29115096c75617aacfbe4b7bd240b51121b80d82fa6b",
	name: "transcribeAudio",
	filename: "src/lib/ai.ts"
}, (opts) => transcribeAudio.__executeServer(opts));
var transcribeAudio = createServerFn({ method: "POST" }).validator((input) => input).handler(transcribeAudio_createServerFn_handler, async ({ data }) => {
	const apiKey = xaiKey();
	if (!apiKey) return {
		ok: false,
		error: "Listening is not available here."
	};
	const bytes = Buffer.from(data.audioBase64, "base64");
	const ext = data.mimeType.includes("mp4") ? "mp4" : data.mimeType.includes("mpeg") ? "mp3" : data.mimeType.includes("wav") ? "wav" : "webm";
	const form = new FormData();
	form.append("language", "en");
	form.append("file", new Blob([bytes], { type: data.mimeType || "audio/webm" }), `speech.${ext}`);
	const res = await fetch("https://api.x.ai/v1/stt", {
		method: "POST",
		headers: { Authorization: `Bearer ${apiKey}` },
		body: form
	});
	if (!res.ok) return {
		ok: false,
		error: `Could not hear that (${res.status}).`
	};
	const text = ((await res.json()).text ?? "").trim();
	if (!text) return {
		ok: false,
		error: "I didn't catch that."
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { buildBrandKit_createServerFn_handler, chatWithBup_createServerFn_handler, generateLogo_createServerFn_handler, speakText_createServerFn_handler, transcribeAudio_createServerFn_handler };
