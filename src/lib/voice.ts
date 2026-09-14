import { blobToBase64 } from "./utils";
import { speakText, transcribeAudio } from "./ai";

export function playBase64Audio(audio: string, mime: string): HTMLAudioElement {
  const binary = atob(audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: mime || "audio/mpeg" }));
  const el = new Audio(url);
  el.addEventListener(
    "ended",
    () => {
      URL.revokeObjectURL(url);
    },
    { once: true },
  );
  void el.play().catch(() => {});
  return el;
}

export async function speak(text: string, voiceId: string): Promise<HTMLAudioElement> {
  const result = await speakText({ data: { text, voiceId } });
  if (!result.ok) throw new Error(result.error);
  return playBase64Audio(result.audio, result.mime);
}

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }> }) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function listenBrowser(): Promise<string> {
  const Ctor = getSpeechRecognition();
  if (!Ctor) return Promise.reject(new Error("no-speech-api"));
  return new Promise((resolve, reject) => {
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    let done = false;
    rec.onresult = (ev) => {
      const last = ev.results[ev.results.length - 1];
      const transcript = last?.[0]?.transcript?.trim() ?? "";
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
      reject(new Error("empty"));
    };
    rec.start();
  });
}

export async function recordAndTranscribe(ms = 8000): Promise<string> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "audio/mp4";
  const rec = new MediaRecorder(stream, { mimeType: mime });
  const chunks: BlobPart[] = [];
  rec.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  const stopped = new Promise<void>((resolve) => {
    rec.onstop = () => resolve();
  });
  rec.start();
  await new Promise((r) => setTimeout(r, ms));
  if (rec.state === "recording") rec.stop();
  await stopped;
  stream.getTracks().forEach((t) => t.stop());
  const blob = new Blob(chunks, { type: rec.mimeType || mime });
  if (blob.size < 800) throw new Error("empty");
  const audioBase64 = await blobToBase64(blob);
  const result = await transcribeAudio({
    data: { audioBase64, mimeType: blob.type || mime },
  });
  if (!result.ok) throw new Error(result.error);
  return result.text;
}

export async function listenOnce(): Promise<string> {
  try {
    const text = await listenBrowser();
    if (text) return text;
  } catch {
    // fall through to recorder
  }
  return recordAndTranscribe(7000);
}
