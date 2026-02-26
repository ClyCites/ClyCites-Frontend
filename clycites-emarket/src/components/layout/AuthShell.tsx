import { Leaf, ShieldCheck, Sprout } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const shellPoints = [
  "Marketplace data in one role-aware workspace",
  "Faster negotiation and order coordination",
  "Clear visibility across supply and fulfillment",
];

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/78 backdrop-blur-xl lg:grid-cols-[1fr_460px]">
        <aside className="hidden lg:flex flex-col justify-between bg-[linear-gradient(165deg,hsl(var(--primary)/0.13)_0%,hsl(var(--secondary)/0.08)_60%,hsl(var(--card)/0.2)_100%)] p-10">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 text-primary">
              <Leaf className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-base font-semibold">ClyCites e-Market</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Agri Commerce Suite</p>
            </div>
          </div>

          <div>
            <h1 className="font-display text-3xl leading-tight">{title}</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>

            <div className="mt-8 space-y-3">
              {shellPoints.map((point, index) => (
                <div key={point} className="flex items-center gap-3 rounded-xl border border-border/65 bg-card/70 px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/12 text-primary">
                    {index === 0 ? <ShieldCheck className="h-3.5 w-3.5" /> : <Sprout className="h-3.5 w-3.5" />}
                  </span>
                  <p className="text-sm text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="p-5 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
