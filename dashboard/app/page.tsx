import Link from "next/link";
import { RadioTower } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { callCounts, pcrCounts, unitCounts, warrantCounts } from "@/src/lib/mock-data";
import { prisma } from "@/src/lib/db";

export const dynamic = "force-dynamic";

async function getOperatorName(): Promise<string | null> {
  try {
    const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
    return user?.name ?? null;
  } catch {
    // Database not reachable during design-time — fall back to generic label.
    return null;
  }
}

export default async function HomePage() {
  const operatorName = await getOperatorName();

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <section className="w-full max-w-sm rounded-md border border-border bg-card p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-[5px] bg-primary">
            <RadioTower className="size-4 text-primary-foreground" />
          </div>
          <p className="text-sm font-bold tracking-tight text-foreground">
            PULSE<span className="text-primary">·</span>RESPONSE
          </p>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Console ready
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {operatorName ? `Signed in as ${operatorName}` : "Sign-in pending"} — session handled by Better Auth.
        </p>

        <dl className="mt-5 space-y-1.5 border-t border-border pt-4 font-mono text-[11px]">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">UNITS 10-8</dt>
            <dd className="text-ok">{unitCounts.available}/{unitCounts.total}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">ACTIVE CALLS</dt>
            <dd className="text-warn">{callCounts.active + callCounts.pending}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">PCR QUEUE</dt>
            <dd className="text-warn">{pcrCounts.pending}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">ACTIVE WARRANTS</dt>
            <dd className="text-primary">{warrantCounts.active}</dd>
          </div>
        </dl>

        <Link
          href="/dispatch"
          className="mt-5 flex h-9 items-center justify-center gap-2 rounded-md bg-primary text-[13px] font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <RadioTower className="size-3.5" />
          Open Dispatch Board
        </Link>

        <p className="mt-3 text-center">
          <Badge variant="outline">OPS-3 · LINK ACTIVE</Badge>
        </p>
      </section>
    </main>
  );
}
