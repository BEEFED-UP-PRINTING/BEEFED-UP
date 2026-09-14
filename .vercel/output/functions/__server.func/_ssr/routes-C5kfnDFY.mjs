import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as SUGGESTIONS, i as STYLE_PRESETS, n as INDUSTRIES, o as VOICE_PRESETS, r as ROLE_PRESETS, s as buildSystemPrompt, t as FORM_PRESETS } from "./prompts-YWPouyXZ.mjs";
import { a as Square, c as Play, d as LoaderCircle, f as ImagePlus, h as ArrowUp, i as Trash2, l as Mic, m as Download, n as UserRound, o as Sparkles, p as Heart, s as Plus, t as WandSparkles, u as MessageSquare } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C5kfnDFY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
function formatRelative(ts) {
	const diff = Date.now() - ts;
	const m = Math.round(diff / 6e4);
	if (m < 1) return "Just now";
	if (m < 60) return `${m}m`;
	const h = Math.round(m / 60);
	if (h < 24) return `${h}h`;
	const d = Math.round(h / 24);
	if (d < 7) return `${d}d`;
	return new Date(ts).toLocaleDateString();
}
async function fileToDataUrl(file, max = 1280, quality = .82) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
	const w = Math.max(1, Math.round(bitmap.width * scale));
	const h = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	ctx.drawImage(bitmap, 0, 0, w, h);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", quality);
}
async function blobToBase64(blob) {
	const buf = await blob.arrayBuffer();
	const bytes = new Uint8Array(buf);
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
function playSound(src, volume = .7) {
	const audio = new Audio(src);
	audio.volume = volume;
	audio.play().catch(() => {});
	return audio;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[opacity,transform,background-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-raised text-fg border border-border hover:border-fg/25",
			ghost: "text-muted hover:text-fg hover:bg-raised",
			live: "bg-live text-fg",
			outline: "border border-border text-fg hover:bg-raised"
		},
		size: {
			default: "h-11 px-4 rounded-md text-sm",
			sm: "h-9 px-3 rounded-sm text-sm",
			lg: "h-12 px-5 rounded-lg text-sm",
			icon: "size-11 rounded-md",
			pill: "h-11 px-5 rounded-full text-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var emptyBrief = () => ({
	name: "",
	industry: "Studio / agency",
	style: "minimal",
	form: "wordmark",
	colors: "bone and ink",
	notes: "",
	background: "ink"
});
var emptyProfile = () => ({
	name: "",
	role: "",
	styles: [],
	onboarded: false,
	voiceId: "rex",
	autoSpeak: true,
	playSting: true
});
function newThread(seed) {
	const now = Date.now();
	return {
		id: uid("th"),
		title: "New session",
		messages: [],
		createdAt: now,
		updatedAt: now,
		...seed
	};
}
var useBup = create()(persist((set, get) => {
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
			const memories = [];
			const now = Date.now();
			if (name.trim()) memories.push({
				id: uid("mem"),
				kind: "name",
				text: `Call them ${name.trim()}.`,
				weight: 5,
				createdAt: now
			});
			if (role.trim()) memories.push({
				id: uid("mem"),
				kind: "fact",
				text: `They work as a ${role.trim()}.`,
				weight: 4,
				createdAt: now
			});
			if (styles.length) memories.push({
				id: uid("mem"),
				kind: "style",
				text: `Visual taste: ${styles.join(", ")}.`,
				weight: 5,
				createdAt: now
			});
			set((s) => ({
				profile: {
					...s.profile,
					name: name.trim(),
					role,
					styles,
					onboarded: true
				},
				memories: [...memories, ...s.memories],
				view: "chat"
			}));
		},
		setProfile: (patch) => set((s) => ({ profile: {
			...s.profile,
			...patch
		} })),
		setVoice: (voiceId) => set((s) => ({ profile: {
			...s.profile,
			voiceId
		} })),
		newChat: () => {
			const thread = newThread();
			set((s) => ({
				threads: [thread, ...s.threads],
				activeThreadId: thread.id,
				view: "chat"
			}));
		},
		setActiveThread: (id) => set({
			activeThreadId: id,
			view: "chat"
		}),
		renameThread: (id, title) => set((s) => ({ threads: s.threads.map((t) => t.id === id ? {
			...t,
			title
		} : t) })),
		deleteThread: (id) => set((s) => {
			const remaining = s.threads.filter((t) => t.id !== id);
			const threads = remaining.length ? remaining : [newThread()];
			return {
				threads,
				activeThreadId: s.activeThreadId === id ? threads[0].id : s.activeThreadId
			};
		}),
		appendMessage: (threadId, message) => set((s) => ({ threads: s.threads.map((t) => {
			if (t.id !== threadId) return t;
			const title = t.messages.length === 0 && message.role === "user" ? message.content.replace(/\s+/g, " ").trim().slice(0, 42) || t.title : t.title;
			return {
				...t,
				title,
				messages: [...t.messages, message],
				updatedAt: message.createdAt
			};
		}) })),
		addMemories: (items) => set((s) => {
			const existing = new Set(s.memories.map((m) => m.text.toLowerCase()));
			const next = items.map((item) => ({
				id: uid("mem"),
				kind: item.kind,
				text: item.text.trim(),
				weight: item.kind === "style" ? 4 : 3,
				createdAt: Date.now()
			})).filter((m) => m.text && !existing.has(m.text.toLowerCase()));
			if (!next.length) return s;
			return { memories: [...next, ...s.memories].slice(0, 80) };
		}),
		removeMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),
		patchBrief: (patch) => set((s) => ({ brief: {
			...s.brief,
			...patch
		} })),
		applyStudioHint: (hint) => set((s) => ({
			brief: {
				...s.brief,
				name: hint.name || s.brief.name,
				industry: hint.industry || s.brief.industry,
				style: hint.style || s.brief.style,
				form: hint.form || s.brief.form,
				colors: hint.colors || s.brief.colors,
				notes: hint.notes || s.brief.notes
			},
			view: "studio"
		})),
		addLogo: (work) => {
			const id = uid("lg");
			set((s) => ({ logos: [{
				...work,
				id,
				liked: false,
				createdAt: Date.now()
			}, ...s.logos].slice(0, 40) }));
			return id;
		},
		toggleLike: (id) => {
			const { logos, addMemories } = get();
			const logo = logos.find((l) => l.id === id);
			set((s) => ({ logos: s.logos.map((l) => l.id === id ? {
				...l,
				liked: !l.liked
			} : l) }));
			if (logo && !logo.liked) addMemories([{
				kind: "style",
				text: `Liked a ${logo.brief.form} for ${logo.brief.name} (${logo.brief.industry}): ${logo.brief.style}, ${logo.brief.colors}.`
			}]);
		},
		setLogoKit: (id, kit) => set((s) => ({ logos: s.logos.map((l) => l.id === id ? {
			...l,
			kit
		} : l) })),
		removeLogo: (id) => set((s) => ({ logos: s.logos.filter((l) => l.id !== id) })),
		resetAll: () => {
			const thread = newThread();
			set({
				profile: emptyProfile(),
				view: "chat",
				threads: [thread],
				activeThreadId: thread.id,
				memories: [],
				logos: [],
				brief: emptyBrief()
			});
		}
	};
}, {
	name: "bup-ai-v1",
	partialize: (s) => ({
		profile: s.profile,
		view: s.view === "voice" ? "chat" : s.view,
		threads: s.threads.slice(0, 24).map((t) => ({
			...t,
			messages: t.messages.slice(-40)
		})),
		activeThreadId: s.activeThreadId,
		memories: s.memories,
		logos: s.logos.slice(0, 24),
		brief: s.brief
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated(true);
	}
}));
function useActiveThread() {
	return useBup((s) => s.threads.find((t) => t.id === s.activeThreadId) ?? s.threads[0]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var chatWithBup = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bf70c4959d0be5f77efb1297f804c11fbcf14d12dd78eb1e4fc93f86479416bf"));
var generateLogo = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e7b7368ab1d3a1015c6d03105670c7bf3c3e92adb7fc1619b0ad9a9665d348a0"));
var buildBrandKit = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("257eeb794f8f1f05501739aa6f39032c59cce2c5043cf5b2732af40cc39d410f"));
var speakText = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("407ee3be710dfbc3f2165d6afb2dde20e9b7d960c8a5e849229e0e321d8ba18c"));
var transcribeAudio = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3a5282c1eae0c4909cde29115096c75617aacfbe4b7bd240b51121b80d82fa6b"));
var FORMS = [
	"wordmark",
	"monogram",
	"emblem",
	"pictorial",
	"abstract",
	"lettermark"
];
function attr(tag, name) {
	const re = new RegExp(`${name}="([^"]*)"`, "i");
	return tag.match(re)?.[1]?.trim() ?? "";
}
function parseAssistantText(raw) {
	const memories = [];
	let studioHint;
	let text = raw.replace(/<memory\s+kind="(fact|style|goal|name)">([\s\S]*?)<\/memory>/gi, (_m, kind, body) => {
		const t = body.replace(/\s+/g, " ").trim();
		if (t) memories.push({
			kind,
			text: t
		});
		return "";
	});
	text = text.replace(/<studio\b([^>]*)\/>/gi, (_m, attrs) => {
		const formRaw = attr(attrs, "form").toLowerCase();
		studioHint = {
			name: attr(attrs, "name") || "Untitled",
			industry: attr(attrs, "industry"),
			style: attr(attrs, "style"),
			form: FORMS.includes(formRaw) ? formRaw : "wordmark",
			colors: attr(attrs, "colors"),
			notes: attr(attrs, "notes")
		};
		return "";
	});
	text = text.replace(/<studio\b([^>]*)>([\s\S]*?)<\/studio>/gi, (_m, attrs, body) => {
		const formRaw = attr(attrs, "form").toLowerCase();
		studioHint = {
			name: attr(attrs, "name") || "Untitled",
			industry: attr(attrs, "industry"),
			style: attr(attrs, "style"),
			form: FORMS.includes(formRaw) ? formRaw : "wordmark",
			colors: attr(attrs, "colors"),
			notes: attr(attrs, "notes") || body.trim()
		};
		return "";
	});
	return {
		content: text.replace(/\n{3,}/g, "\n\n").trim(),
		memories,
		studioHint
	};
}
function playBase64Audio(audio, mime) {
	const binary = atob(audio);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	const url = URL.createObjectURL(new Blob([bytes], { type: mime || "audio/mpeg" }));
	const el = new Audio(url);
	el.addEventListener("ended", () => {
		URL.revokeObjectURL(url);
	}, { once: true });
	el.play().catch(() => {});
	return el;
}
async function speak(text, voiceId) {
	const result = await speakText({ data: {
		text,
		voiceId
	} });
	if (!result.ok) throw new Error(result.error);
	return playBase64Audio(result.audio, result.mime);
}
function getSpeechRecognition() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function listenBrowser() {
	const Ctor = getSpeechRecognition();
	if (!Ctor) return Promise.reject(/* @__PURE__ */ new Error("no-speech-api"));
	return new Promise((resolve, reject) => {
		const rec = new Ctor();
		rec.lang = "en-US";
		rec.interimResults = false;
		rec.continuous = false;
		let done = false;
		rec.onresult = (ev) => {
			const transcript = ev.results[ev.results.length - 1]?.[0]?.transcript?.trim() ?? "";
			done = true;
			resolve(transcript);
		};
		rec.onerror = (ev) => {
			if (done) return;
			done = true;
			reject(new Error(ev.error || "listen-failed"));
		};
		rec.onend = () => {
			if (done) return;
			done = true;
			reject(/* @__PURE__ */ new Error("empty"));
		};
		rec.start();
	});
}
async function recordAndTranscribe(ms = 8e3) {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
	const rec = new MediaRecorder(stream, { mimeType: mime });
	const chunks = [];
	rec.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	const stopped = new Promise((resolve) => {
		rec.onstop = () => resolve();
	});
	rec.start();
	await new Promise((r) => setTimeout(r, ms));
	if (rec.state === "recording") rec.stop();
	await stopped;
	stream.getTracks().forEach((t) => t.stop());
	const blob = new Blob(chunks, { type: rec.mimeType || mime });
	if (blob.size < 800) throw new Error("empty");
	const result = await transcribeAudio({ data: {
		audioBase64: await blobToBase64(blob),
		mimeType: blob.type || mime
	} });
	if (!result.ok) throw new Error(result.error);
	return result.text;
}
async function listenOnce() {
	try {
		const text = await listenBrowser();
		if (text) return text;
	} catch {}
	return recordAndTranscribe(7e3);
}
async function sendToBup(opts) {
	const text = opts.text.trim();
	if (!text && !opts.images?.length) return "";
	const state = useBup.getState();
	const threadId = state.activeThreadId;
	const userMsg = {
		id: uid("m"),
		role: "user",
		content: text || "Look at this.",
		createdAt: Date.now(),
		images: opts.images
	};
	state.appendMessage(threadId, userMsg);
	const next = useBup.getState();
	const thread = next.threads.find((t) => t.id === threadId);
	const result = await chatWithBup({ data: {
		system: buildSystemPrompt(next.profile, next.memories),
		messages: (thread?.messages ?? []).map((m) => ({
			role: m.role,
			content: m.content,
			images: m.images
		}))
	} });
	if (!result.ok) {
		next.appendMessage(threadId, {
			id: uid("m"),
			role: "assistant",
			content: result.error,
			createdAt: Date.now()
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
		studioHint: parsed.studioHint
	});
	if (opts.speakReply && parsed.content) try {
		await speak(parsed.content, next.profile.voiceId);
	} catch {}
	return parsed.content;
}
function BupMark({ className, size = 36 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 36 36",
		fill: "none",
		"aria-hidden": "true",
		className: cn("shrink-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "1",
			y: "1",
			width: "34",
			height: "34",
			rx: "10",
			stroke: "currentColor",
			strokeOpacity: "0.35",
			strokeWidth: "1.2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 11.5h7.2c3.1 0 5.15 1.55 5.15 4.05 0 1.55-.85 2.75-2.25 3.35 1.7.5 2.75 1.85 2.75 3.7 0 2.7-2.2 4.4-5.55 4.4H12V11.5Zm3.05 2.4v3.7h3.85c1.55 0 2.4-.7 2.4-1.85s-.85-1.85-2.4-1.85H15.05Zm0 5.95v4.25h4.35c1.7 0 2.7-.8 2.7-2.15s-1-2.1-2.7-2.1H15.05Z",
			fill: "currentColor"
		})]
	});
}
function ChatPane() {
	const thread = useActiveThread();
	const profile = useBup((s) => s.profile);
	const applyStudioHint = useBup((s) => s.applyStudioHint);
	const newChat = useBup((s) => s.newChat);
	const threads = useBup((s) => s.threads);
	const setActiveThread = useBup((s) => s.setActiveThread);
	const setView = useBup((s) => s.setView);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [pendingImage, setPendingImage] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const bottomRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const areaRef = (0, import_react.useRef)(null);
	const messages = thread?.messages ?? [];
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, busy]);
	async function onSend(text = draft) {
		if (busy) return;
		const trimmed = text.trim();
		if (!trimmed && !pendingImage) return;
		setDraft("");
		const images = pendingImage ? [{ url: pendingImage }] : void 0;
		setPendingImage(null);
		setBusy(true);
		try {
			await sendToBup({
				text: trimmed,
				images
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "BUP could not reply.");
		} finally {
			setBusy(false);
			areaRef.current?.focus();
		}
	}
	async function onFile(file) {
		if (!file) return;
		try {
			const url = await fileToDataUrl(file);
			setPendingImage(url);
		} catch {
			toast.error("Could not read that image.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium tracking-[0.16em] text-muted uppercase",
					children: "Sessions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "size-8",
					onClick: newChat,
					"aria-label": "New session",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto scrollbar-thin px-2 pb-3",
				children: threads.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setActiveThread(t.id),
					className: `mb-1 w-full rounded-md px-2.5 py-2 text-left transition-colors duration-150 ${t.id === thread?.id ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-sm",
						children: t.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[11px] text-subtle",
						children: formatRelative(t.updatedAt)
					})]
				}, t.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto scrollbar-thin px-4 py-6 sm:px-8",
				children: messages.length === 0 && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChat, {
					name: profile.name,
					onSuggest: (t) => void onSend(t)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-2xl flex-col gap-5",
					children: [
						messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`,
							children: [m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BupMark, {
								size: 28,
								className: "mt-0.5 text-accent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `max-w-[min(100%,36rem)] ${m.role === "user" ? "rounded-2xl rounded-br-md bg-raised px-4 py-3" : "pt-0.5"}`,
								children: [
									m.images?.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img.url,
										alt: img.alt ?? "Reference",
										className: "mb-3 max-h-56 rounded-lg border border-border object-cover"
									}, img.url.slice(0, 24))),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "whitespace-pre-wrap text-[15px] leading-relaxed text-fg",
										children: m.content
									}),
									m.studioHint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => applyStudioHint(m.studioHint),
										className: "mt-3 flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5 text-left hover:border-fg/25",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted",
											children: "Ready in Studio"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: m.studioHint.name
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-accent" })]
									})
								]
							})]
						}, m.id)),
						busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BupMark, {
								size: 28,
								className: "text-accent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Thinking…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border bg-bg/90 px-3 py-3 backdrop-blur-sm sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl",
					children: [
						pendingImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: pendingImage,
								alt: "Attached",
								className: "h-12 w-12 rounded-md border border-border object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setPendingImage(null),
								children: "Remove"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-2 rounded-2xl border border-border bg-surface p-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => {
										onFile(e.target.files?.[0]);
										e.target.value = "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-10 shrink-0",
									onClick: () => fileRef.current?.click(),
									"aria-label": "Attach image",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									ref: areaRef,
									rows: 1,
									value: draft,
									onChange: (e) => setDraft(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											onSend();
										}
									},
									placeholder: "Brief BUP…",
									className: "max-h-36 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-sm text-fg placeholder:text-subtle focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-10 shrink-0",
									onClick: () => setView("voice"),
									"aria-label": "Voice",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									className: "size-10 shrink-0",
									disabled: busy || !draft.trim() && !pendingImage,
									onClick: () => void onSend(),
									"aria-label": "Send",
									children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 hidden text-center text-[11px] text-subtle sm:block",
							children: "Enter to send · Shift+Enter for a new line"
						})
					]
				})
			})]
		})]
	});
}
function EmptyChat({ name, onSuggest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-lg flex-col items-center px-2 pt-10 text-center sm:pt-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BupMark, {
				size: 44,
				className: "text-accent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-6 text-3xl tracking-[-0.03em] sm:text-4xl",
				children: name ? `${name.split(" ")[0]}.` : "BUP."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-sm leading-relaxed text-muted",
				children: "I learn how you see. Marks, type, color — and whatever else you put in front of me."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2",
				children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSuggest(s.text),
					className: "rounded-xl border border-border bg-surface px-4 py-3 text-left hover:border-fg/25",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium text-fg",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-xs leading-relaxed text-muted",
						children: s.text.length > 72 ? `${s.text.slice(0, 72)}…` : s.text
					})]
				}, s.label))
			})
		]
	});
}
function Badge({ className, children, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(onClick ? "button" : "span", {
		type: onClick ? "button" : void 0,
		onClick,
		className: cn("inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors duration-150", active ? "border-accent/40 bg-accent text-accent-fg" : "border-border bg-raised text-muted hover:text-fg", onClick && "cursor-pointer", className),
		children
	});
}
var Input = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("flex h-11 w-full rounded-md border border-border bg-raised px-3 text-sm text-fg placeholder:text-subtle", "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70", "disabled:opacity-40", className),
	...props
}));
Input.displayName = "Input";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-24 w-full rounded-lg border border-border bg-raised px-3 py-2.5 text-sm text-fg placeholder:text-subtle", "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70", "disabled:opacity-40 resize-none", className),
	...props
}));
Textarea.displayName = "Textarea";
function MemoryPane() {
	const profile = useBup((s) => s.profile);
	const setProfile = useBup((s) => s.setProfile);
	const setVoice = useBup((s) => s.setVoice);
	const memories = useBup((s) => s.memories);
	const removeMemory = useBup((s) => s.removeMemory);
	const addMemories = useBup((s) => s.addMemories);
	const logos = useBup((s) => s.logos);
	const resetAll = useBup((s) => s.resetAll);
	const styles = useBup((s) => s.profile.styles);
	function toggleStyle(id) {
		const next = styles.includes(id) ? styles.filter((s) => s !== id) : [...styles, id].slice(-4);
		setProfile({ styles: next });
		addMemories([{
			kind: "style",
			text: `Visual taste: ${next.join(", ") || "open"}.`
		}]);
	}
	function exportBrain() {
		const blob = new Blob([JSON.stringify({
			profile,
			memories,
			logos: logos.map((l) => ({
				name: l.brief.name,
				liked: l.liked,
				brief: l.brief,
				kit: l.kit
			}))
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "bup-ai-memory.json";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Memory exported.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full overflow-y-auto scrollbar-thin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl px-4 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
					children: "Memory"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-3xl tracking-[-0.03em]",
					children: "What BUP knows"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: "Learning lives on this device. Edit it. BUP gets sharper the more you keep."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 rounded-2xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: "You"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-xs text-muted",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1.5",
							value: profile.name,
							onChange: (e) => setProfile({ name: e.target.value })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-xs text-muted",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1.5",
							value: profile.role,
							onChange: (e) => setProfile({ role: e.target.value })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted",
							children: "Taste flags"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: STYLE_PRESETS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								active: styles.includes(s.id),
								onClick: () => toggleStyle(s.id),
								children: s.label
							}, s.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5 rounded-2xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: "Voice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "The anthem is your 4OUR record. Spoken replies use a matching studio voice."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap gap-1.5",
							children: VOICE_PRESETS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								active: profile.voiceId === v.id,
								onClick: () => setVoice(v.id),
								children: v.label
							}, v.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-subtle",
							children: VOICE_PRESETS.find((v) => v.id === profile.voiceId)?.hint
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => playSound("/audio/sting.mp3", .6),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), " Play sting"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => playSound("/audio/theme.mp3", .5),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), " Play anthem"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: profile.autoSpeak ? "default" : "secondary",
									size: "sm",
									onClick: () => setProfile({ autoSpeak: !profile.autoSpeak }),
									children: profile.autoSpeak ? "Auto-speak on" : "Auto-speak off"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: profile.playSting ? "default" : "secondary",
									size: "sm",
									onClick: () => setProfile({ playSting: !profile.playSting }),
									children: profile.playSting ? "Sting on" : "Sting off"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5 rounded-2xl border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: "Kept marks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-subtle",
							children: [logos.filter((l) => l.liked).length, " liked"]
						})]
					}), logos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Nothing on the board yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6",
						children: logos.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: l.imageUrl,
							alt: l.brief.name,
							className: `aspect-square rounded-md border object-cover ${l.liked ? "border-accent/50" : "border-border opacity-70"}`,
							crossOrigin: "anonymous"
						}, l.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5 rounded-2xl border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: "Durable notes"
					}), memories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "BUP writes here when you teach it. You can also say “remember this” in chat."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: memories.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 w-12 shrink-0 text-[10px] font-medium tracking-wider text-subtle uppercase",
									children: m.kind
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "flex-1 text-sm leading-relaxed text-fg",
									children: m.text
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeMemory(m.id),
									className: "text-subtle hover:text-fg",
									"aria-label": "Forget",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							]
						}, m.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5 rounded-2xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium",
							children: "Install BUP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: "Add BUP AI to your home screen. It runs like a native app — chat, studio, and voice, with your memory on device. Play Store listing needs a Google Play developer account; this build is the complete installable app."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "secondary",
									size: "sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/?install=1",
										children: "Install guide"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: exportBrain,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export memory"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										if (confirm("Wipe onboarding, chats, and memory on this device?")) resetAll();
									},
									children: "Reset BUP"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-subtle",
							children: "Built by BUP AI. From nothing to something."
						})
					]
				})
			]
		})
	});
}
function Onboarding() {
	const complete = useBup((s) => s.completeOnboarding);
	const playSting = useBup((s) => s.profile.playSting);
	const [step, setStep] = (0, import_react.useState)(0);
	const [name, setName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("Founder");
	const [styles, setStyles] = (0, import_react.useState)(["minimal", "luxury"]);
	function toggleStyle(id) {
		setStyles((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= 3 ? [...prev.slice(1), id] : [...prev, id]);
	}
	function enter() {
		if (playSting) playSound("/audio/sting.mp3", .55);
		setStep(1);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BupMark, {
							size: 52,
							className: "text-accent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 text-xs font-medium tracking-[0.22em] text-muted uppercase",
							children: "BUP AI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display mt-4 text-4xl leading-tight tracking-[-0.03em] text-fg sm:text-5xl",
							children: [
								"From nothing",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"to something."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-sm text-sm leading-relaxed text-muted",
							children: "Personal creative intelligence. Learns how you see — especially marks, type, and color. Built by BUP AI."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-10 w-full",
							size: "lg",
							onClick: enter,
							children: "Enter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-subtle",
							children: "They slept, we built."
						})
					]
				}),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "01 — Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-3xl tracking-[-0.03em]",
						children: "What should I call you?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-8",
						autoFocus: true,
						placeholder: "Your name",
						value: name,
						onChange: (e) => setName(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && name.trim()) setStep(2);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !name.trim(),
							onClick: () => setStep(2),
							children: "Continue"
						})
					})
				] }),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "02 — Work"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-3xl tracking-[-0.03em]",
						children: "What do you make?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-wrap gap-2",
						children: ROLE_PRESETS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							active: role === r,
							onClick: () => setRole(r),
							children: r
						}, r))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setStep(1),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setStep(3),
							children: "Continue"
						})]
					})
				] }),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "03 — Taste"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-3xl tracking-[-0.03em]",
						children: "How should the work feel?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Pick up to three. BUP will learn from here."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid grid-cols-2 gap-2",
						children: STYLE_PRESETS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggleStyle(s.id),
							className: `rounded-xl border p-3 text-left transition-colors duration-150 ${styles.includes(s.id) ? "border-accent/50 bg-raised" : "border-border bg-surface hover:border-fg/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium text-fg",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted",
								children: s.hint
							})]
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setStep(2),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => complete({
								name,
								role,
								styles
							}),
							children: "Start working"
						})]
					})
				] })
			]
		})
	});
}
function StudioPane() {
	const brief = useBup((s) => s.brief);
	const patchBrief = useBup((s) => s.patchBrief);
	const logos = useBup((s) => s.logos);
	const addLogo = useBup((s) => s.addLogo);
	const toggleLike = useBup((s) => s.toggleLike);
	const setLogoKit = useBup((s) => s.setLogoKit);
	const removeLogo = useBup((s) => s.removeLogo);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [kitId, setKitId] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	async function generate() {
		if (!brief.name.trim()) {
			toast.error("Give the brand a name first.");
			return;
		}
		setBusy(true);
		try {
			const result = await generateLogo({ data: { brief } });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			const id = addLogo({
				imageUrl: result.url,
				prompt: brief.notes,
				brief: { ...brief }
			});
			setSelected(id);
			playSound("/audio/intro.mp3", .35);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Studio failed.");
		} finally {
			setBusy(false);
		}
	}
	async function kit(work) {
		setKitId(work.id);
		try {
			const result = await buildBrandKit({ data: { brief: work.brief } });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			setLogoKit(work.id, result.kit);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Kit failed.");
		} finally {
			setKitId(null);
		}
	}
	const selectedWork = logos.find((l) => l.id === selected) ?? logos[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col lg:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border lg:w-[22rem] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 scrollbar-thin",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-5 sm:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "Logo Studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-2xl tracking-[-0.03em]",
						children: "Cut a mark"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "BUP renders one direction at a time. Like what you keep — that trains taste."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-6 block text-xs font-medium text-muted",
						children: "Brand name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						placeholder: "e.g. Night Atelier",
						value: brief.name,
						onChange: (e) => patchBrief({ name: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-xs font-medium text-muted",
						children: "Industry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: INDUSTRIES.map((ind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							active: brief.industry === ind,
							onClick: () => patchBrief({ industry: ind }),
							children: ind
						}, ind))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-xs font-medium text-muted",
						children: "Form"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: FORM_PRESETS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							active: brief.form === f.id,
							onClick: () => patchBrief({ form: f.id }),
							children: f.label
						}, f.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-xs font-medium text-muted",
						children: "Style"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: STYLE_PRESETS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							active: brief.style === s.id,
							onClick: () => patchBrief({ style: s.id }),
							children: s.label
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-xs font-medium text-muted",
						children: "Color direction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						placeholder: "bone and ink, one accent",
						value: brief.colors,
						onChange: (e) => patchBrief({ colors: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-xs font-medium text-muted",
						children: "Ground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: [
							["ink", "Ink"],
							["paper", "Paper"],
							["transparent-look", "Isolated"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							active: brief.background === id,
							onClick: () => patchBrief({ background: id }),
							children: label
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-xs font-medium text-muted",
						children: "Notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-1.5 min-h-20",
						placeholder: "No music notes. Tight wordspacing. Slightly brutal.",
						value: brief.notes,
						onChange: (e) => patchBrief({ notes: e.target.value })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-5 w-full",
						size: "lg",
						disabled: busy,
						onClick: () => void generate(),
						children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Rendering"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), " Generate mark"] })
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "min-h-0 flex-1 overflow-y-auto scrollbar-thin px-4 py-5 sm:px-6",
			children: logos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full min-h-64 flex-col items-center justify-center text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl tracking-[-0.03em]",
					children: "The board is empty."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-sm text-sm text-muted",
					children: "Name the brand, pick a form, generate. Each like teaches BUP what you keep."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: selectedWork && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-2xl border border-border bg-surface",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: selectedWork.imageUrl,
							alt: selectedWork.brief.name,
							className: "aspect-square w-full object-cover",
							crossOrigin: "anonymous"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 border-t border-border px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mr-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: selectedWork.brief.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted",
										children: [
											selectedWork.brief.form,
											" · ",
											selectedWork.brief.style
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: selectedWork.liked ? "default" : "secondary",
									size: "sm",
									onClick: () => toggleLike(selectedWork.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-3.5 ${selectedWork.liked ? "fill-current" : ""}` }), selectedWork.liked ? "Kept" : "Keep"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "sm",
									disabled: kitId === selectedWork.id,
									onClick: () => void kit(selectedWork),
									children: kitId === selectedWork.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : "Brand kit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-9",
									onClick: () => removeLogo(selectedWork.id),
									"aria-label": "Remove",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							]
						}),
						selectedWork.kit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border px-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-[0.16em] text-muted uppercase",
									children: "Kit"
								}),
								selectedWork.kit.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display mt-2 text-xl tracking-[-0.03em]",
									children: selectedWork.kit.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex gap-2",
									children: selectedWork.kit.palette.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-10 rounded-md border border-border",
												style: { background: c.hex }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-[10px] text-muted",
												children: c.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-[10px] text-subtle",
												children: c.hex
											})
										]
									}, c.hex))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm text-fg",
									children: [
										selectedWork.kit.typePairing.display,
										" / ",
										selectedWork.kit.typePairing.body
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: selectedWork.kit.typePairing.why
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted",
									children: selectedWork.kit.usage
								})
							]
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2 xl:grid-cols-2",
					children: logos.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelected(l.id),
						className: `overflow-hidden rounded-lg border ${selectedWork?.id === l.id ? "border-accent/60" : "border-border"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: l.imageUrl,
							alt: l.brief.name,
							className: "aspect-square w-full object-cover",
							crossOrigin: "anonymous"
						})
					}, l.id))
				})]
			})
		})]
	});
}
function VoiceOrb({ state, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative grid place-items-center", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute size-[72%] rounded-full border border-border", state === "listening" && "animate-pulse", state === "speaking" && "scale-110") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute size-[88%] rounded-full border border-fg/10", state === "speaking" && "animate-pulse") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("orb-core relative size-[56%] rounded-full transition-transform duration-300", state === "listening" && "scale-105", state === "speaking" && "scale-110", state === "thinking" && "opacity-80") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute size-[18%] rounded-full bg-fg/80 mix-blend-overlay" })
		]
	});
}
function VoicePane() {
	const playSting = useBup((s) => s.profile.playSting);
	const autoSpeak = useBup((s) => s.profile.autoSpeak);
	const name = useBup((s) => s.profile.name);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [caption, setCaption] = (0, import_react.useState)("From nothing to something.");
	const [sub, setSub] = (0, import_react.useState)("They slept, we built.");
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (started.current) return;
		started.current = true;
		if (!playSting) return;
		const audio = playSound("/audio/sting.mp3", .62);
		setCaption("From nothing to something.");
		setSub("You know the name now.");
		const t = window.setTimeout(() => setSub("They slept, we built."), 5200);
		const onEnd = () => {
			setCaption(name ? `${name.split(" ")[0]}. I'm listening.` : "I'm listening.");
			setSub("Hold the mic and talk.");
			setPhase("idle");
		};
		audio.addEventListener("ended", onEnd);
		return () => {
			window.clearTimeout(t);
			audio.pause();
			audio.removeEventListener("ended", onEnd);
		};
	}, [playSting, name]);
	async function cycle() {
		if (phase === "listening" || phase === "thinking" || phase === "speaking") return;
		setPhase("listening");
		setCaption("Listening");
		setSub("Speak naturally.");
		try {
			const heard = await listenOnce();
			if (!heard) {
				setPhase("idle");
				setCaption("I didn't catch that.");
				setSub("Tap the mic and try again.");
				return;
			}
			setCaption(heard);
			setSub("Thinking");
			setPhase("thinking");
			const reply = await sendToBup({
				text: heard,
				speakReply: autoSpeak
			});
			setCaption(reply || "Noted.");
			setSub("Tap to talk again.");
			setPhase(autoSpeak ? "speaking" : "idle");
			if (autoSpeak) window.setTimeout(() => setPhase("idle"), Math.min(12e3, 80 * (reply?.length ?? 20)));
		} catch (err) {
			setPhase("idle");
			const msg = err instanceof Error ? err.message : "Voice failed.";
			setCaption("Hold up.");
			setSub(msg === "empty" ? "Nothing came through. Try again." : msg);
			if (msg !== "empty") toast.error(msg);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col items-center justify-center px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOrb, {
				state: phase,
				className: "h-56 w-56 sm:h-64 sm:w-64"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-10 max-w-md text-center text-2xl leading-snug tracking-[-0.03em] sm:text-3xl",
				children: caption
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-center text-sm text-muted",
				children: sub
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-10 size-16 rounded-full",
				size: "icon",
				variant: phase === "listening" ? "live" : "default",
				onClick: () => void cycle(),
				"aria-label": phase === "listening" ? "Listening" : "Talk to BUP",
				children: phase === "listening" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-subtle",
				children: phase === "listening" ? "Hearing you" : "Tap to talk"
			})
		]
	});
}
var NAV = [
	{
		id: "chat",
		label: "Chat",
		icon: MessageSquare
	},
	{
		id: "studio",
		label: "Studio",
		icon: Sparkles
	},
	{
		id: "voice",
		label: "Voice",
		icon: Mic
	},
	{
		id: "memory",
		label: "Memory",
		icon: UserRound
	}
];
function AppShell() {
	const hydrated = useBup((s) => s.hydrated);
	const setHydrated = useBup((s) => s.setHydrated);
	const onboarded = useBup((s) => s.profile.onboarded);
	const view = useBup((s) => s.view);
	const setView = useBup((s) => s.setView);
	const newChat = useBup((s) => s.newChat);
	const [installEvent, setInstallEvent] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const unsub = useBup.persist.onFinishHydration(() => setHydrated(true));
		if (useBup.persist.hasHydrated()) setHydrated(true);
		const t = window.setTimeout(() => setHydrated(true), 800);
		return () => {
			unsub();
			window.clearTimeout(t);
		};
	}, [setHydrated]);
	(0, import_react.useEffect)(() => {
		const onPrompt = (e) => {
			e.preventDefault();
			setInstallEvent(e);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		return () => window.removeEventListener("beforeinstallprompt", onPrompt);
	}, []);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BupMark, {
				size: 48,
				className: "text-accent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs font-medium tracking-[0.22em] text-muted uppercase",
				children: "BUP AI"
			})]
		})
	});
	if (!onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BupMark, {
						size: 28,
						className: "text-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium leading-none",
							children: "BUP AI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 hidden text-[11px] text-subtle sm:block",
							children: "From nothing to something."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "ml-4 hidden items-center gap-1 md:flex",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: view === item.id ? "secondary" : "ghost",
							size: "sm",
							onClick: () => setView(item.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-3.5" }), item.label]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1",
						children: [installEvent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "sm",
							className: "hidden sm:inline-flex",
							onClick: () => {
								installEvent.prompt();
								setInstallEvent(null);
							},
							children: "Install"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-10 md:size-9",
							onClick: newChat,
							"aria-label": "New chat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-h-0 flex-1 overflow-hidden pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0",
				children: [
					view === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPane, {}),
					view === "studio" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioPane, {}),
					view === "voice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoicePane, {}),
					view === "memory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryPane, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4",
					children: NAV.map((item) => {
						const active = view === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setView(item.id),
							className: `flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] ${active ? "text-fg" : "text-subtle"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), item.label]
						}, item.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { classNames: { toast: "bg-raised text-fg border border-border" } }
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
