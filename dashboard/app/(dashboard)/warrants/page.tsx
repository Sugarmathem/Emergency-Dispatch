"use client";

import * as React from "react";
import { Gavel } from "lucide-react";
import { PageHeader } from "@/src/components/dashboard/page-header";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { warrants, warrantCounts, type WarrantStatus } from "@/src/lib/mock-data";

const statusVariant: Record<WarrantStatus, "danger" | "ok" | "secondary"> = {
  ACTIVE: "danger",
  EXECUTED: "ok",
  EXPIRED: "secondary",
};

export default function WarrantsPage() {
  const [query, setQuery] = React.useState("");

  const visible = warrants.filter((w) => {
    const q = query.trim().toLowerCase();
    return (
      q === "" ||
      w.targetName.toLowerCase().includes(q) ||
      w.targetId.includes(q) ||
      w.type.toLowerCase().includes(q) ||
      String(w.number).includes(q)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        code="SEC 04 / WARRANTS"
        title="Warrant Registry"
        description={`${warrantCounts.active} active · ${warrantCounts.executed} executed · ${warrantCounts.expired} expired`}
        actions={
          <>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Target, type, warrant #…"
              className="w-56 font-mono"
            />
            <Button size="sm">
              <Gavel className="size-3.5" />
              File warrant
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {visible.map((w) => (
          <div
            key={w.id}
            className="flex items-start gap-4 border-b border-border/50 px-4 py-3 transition-colors hover:bg-accent/30"
          >
            <div className="flex w-24 shrink-0 flex-col items-start">
              <span className="font-mono text-[11px] font-semibold text-primary">
                WR-{w.number}
              </span>
              <span className="mt-1">
                <Badge variant={statusVariant[w.status]}>{w.status}</Badge>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-mono text-[13px] font-semibold text-foreground">
                  {w.targetName}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  R{w.targetId}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {w.type}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.reason}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                FILED BY {w.filedBy} · {w.createdAt}
                {w.expires !== "—" && ` · EXPIRES ${w.expires}`}
              </p>
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <p className="px-4 py-10 text-center font-mono text-xs text-muted-foreground">
            NO WARRANTS MATCH
          </p>
        )}
      </div>
    </div>
  );
}
