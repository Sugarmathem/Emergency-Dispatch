import type { ReactNode } from "react";
import { SidebarNav } from "@/src/components/dashboard/sidebar-nav";
import { TopBar } from "@/src/components/dashboard/top-bar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-card/30 md:flex">
        {/* Brand */}
        <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border px-4">
          <div className="relative flex size-6 items-center justify-center rounded-[5px] bg-primary">
            <span className="absolute inset-0 animate-ping rounded-[5px] bg-primary/40" style={{ animationDuration: "2.5s" }} />
            <svg viewBox="0 0 24 24" className="relative size-3.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h3l2-7 4 14 3-10 2 3h6" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold tracking-tight text-foreground">
              PULSE<span className="text-primary">·</span>RESPONSE
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Dispatch Console
            </p>
          </div>
        </div>

        <SidebarNav />

        {/* Sidebar footer — radio channel info */}
        <div className="mt-auto shrink-0 border-t border-border px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Radio Channel
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-foreground">OPS-3 · ENC</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-ok animate-pulse-dot" />
            <span className="font-mono text-[10px] text-muted-foreground">LINK ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
