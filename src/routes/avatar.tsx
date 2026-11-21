import { createFileRoute, Link } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AvatarStudio } from "@/components/app/avatar-studio";

export const Route = createFileRoute("/avatar")({
  component: AvatarPage,
});

function AvatarPage() {
  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="font-display text-lg leading-none tracking-[-0.03em]">BUSHIE MET LYN</p>
          <p className="mt-1 text-xs text-muted">Avatar — send this page, or download the HTML</p>
        </div>
        <Link to="/" search={{ embed: false }} className="ml-auto min-h-11 text-sm text-muted">
          Full studio
        </Link>
      </header>
      <div className="min-h-0 flex-1">
        <AvatarStudio />
      </div>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{ classNames: { toast: "bg-raised text-fg border border-border" } }}
      />
    </div>
  );
}