export type ViewId = "chat" | "studio" | "memory" | "voice";

export type MemoryKind = "fact" | "style" | "goal" | "name";

export type LogoForm =
  | "wordmark"
  | "monogram"
  | "emblem"
  | "pictorial"
  | "abstract"
  | "lettermark";

export type VoiceId = "rex" | "orion" | "zagan" | "atlas" | "eve";

export interface ChatImage {
  url: string;
  alt?: string;
}

export interface StudioHint {
  name: string;
  industry: string;
  style: string;
  form: LogoForm;
  colors: string;
  notes: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  images?: ChatImage[];
  studioHint?: StudioHint;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface MemoryItem {
  id: string;
  kind: MemoryKind;
  text: string;
  weight: number;
  createdAt: number;
}

export interface LogoBrief {
  name: string;
  industry: string;
  style: string;
  form: LogoForm;
  colors: string;
  notes: string;
  background: "ink" | "paper" | "transparent-look";
}

export interface BrandKit {
  palette: { name: string; hex: string }[];
  typePairing: { display: string; body: string; why: string };
  usage: string;
  tagline: string;
}

export interface LogoWork {
  id: string;
  imageUrl: string;
  prompt: string;
  brief: LogoBrief;
  liked: boolean;
  kit?: BrandKit;
  createdAt: number;
}

export interface Profile {
  name: string;
  role: string;
  styles: string[];
  onboarded: boolean;
  voiceId: VoiceId;
  autoSpeak: boolean;
  playSting: boolean;
}
