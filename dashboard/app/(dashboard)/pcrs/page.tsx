"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/src/components/dashboard/page-header";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { pcrs, pcrCounts, type PcrStatus } from "@/src/lib/mock-data";

const statusVariant: Record<PcrStatus, "warn" | "ok" | "danger"> = {
  PENDING: "warn",
  APPROVED: "ok",
  REJECTED: "danger",
};

const columns = "grid grid-cols-[64px_100px_1fr_170px_88px_72px] gap-3 px-4";

export default function PcrsPage() {
  const [tab, setTab] = React.useState<"all" | PcrStatus>("all");

  const visible = pcrs.filter((p) => tab === "all" || p.status === tab);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        code="SEC 03 / PCR"
        title="Patrol Check Reports"
        description={`${pcrCounts.pending} awaiting review · ${pcrCounts.approved} approved · ${pcrCounts.rejected} rejected`}
        actions={
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending {pcrCounts.pending}</TabsTrigger>
              <TabsTrigger value="APPROVED">Approved</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 grid grid-cols-[64px_100px_1fr_170px_88px_72px] gap-3 border-b border-border bg-background/95 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
          <span>#</span>
          <span>Unit</span>
          <span>Type / Disposition</span>
          <span>Command team</span>
          <span>Words</span>
          <span className="text-right">Action</span>
        </div>

        {visible.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[64px_100px_1fr_170px_88px_72px] items-center gap-3 border-b border-border/50 px-4 py-2.5 text-[12px] transition-colors hover:bg-accent/30"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              #{p.number}
            </span>
            <span className="font-mono text-[11px] font-semibold text-foreground">
              {p.callsign}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-foreground">{p.callType}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {p.disposition}
                {p.commandTeam ? ` · ${p.commandTeam}` : ""}
              </span>
            </span>
            <span>
              <Badge variant={statusVariant[p.status]}>
                {p.status}
                {p.reviewedBy ? ` · ${p.reviewedBy}` : ""}
              </Badge>
            </span>
            <span
              className={cnWords(p.words)}
            >
              {p.words}w
            </span>
            <span className="flex justify-end gap-1">
              {p.status === "PENDING" ? (
                <>
                  <Button size="icon" variant="outline" className="size-7" title="Approve">
                    <Check className="size-3.5 text-ok" />
                  </Button>
                  <Button size="icon" variant="outline" className="size-7" title="Reject">
                    <X className="size-3.5 text-primary" />
                  </Button>
                </>
              ) : (
                <span className="font-mono text-[10px] text-muted-foreground">—</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function cnWords(words: number): string {
  if (words < 50) return "font-mono text-[11px] text-primary";
  if (words < 150) return "font-mono text-[11px] text-warn";
  return "font-mono text-[11px] text-ok";
}
