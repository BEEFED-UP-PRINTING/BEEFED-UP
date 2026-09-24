import { createContext, useContext } from "react";

export const EmbedContext = createContext(false);

export function useEmbed() {
  return useContext(EmbedContext);
}

export function parseEmbedSearch(raw: Record<string, unknown>): { embed: boolean } {
  const v = raw.embed;
  return { embed: v === "1" || v === 1 || v === "true" || v === true };
}
