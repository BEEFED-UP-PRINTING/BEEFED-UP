import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/shell";
import { parseEmbedSearch } from "@/lib/embed";

export const Route = createFileRoute("/")({
  validateSearch: parseEmbedSearch,
  component: Home,
});

function Home() {
  const { embed } = Route.useSearch();
  return <AppShell embed={embed} />;
}
