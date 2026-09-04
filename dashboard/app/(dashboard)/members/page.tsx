"use client";

import * as React from "react";
import { PageHeader } from "@/src/components/dashboard/page-header";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { members, memberCounts } from "@/src/lib/mock-data";

export default function MembersPage() {
  const [query, setQuery] = React.useState("");

  const visible = members.filter((m) => {
    const q = query.trim().toLowerCase();
    return (
      q === "" ||
      m.name.toLowerCase().includes(q) ||
      m.robloxUsername.toLowerCase().includes(q) ||
      m.discordId.toLowerCase().includes(q) ||
      (m.callsign ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        code="SEC 05 / MEMBERS"
        title="Community Roster"
        description={`${memberCounts.total} members · ${memberCounts.onDuty} on duty`}
        actions={
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, callsign, username…"
            className="w-56 font-mono"
          />
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 grid grid-cols-[160px_92px_110px_1fr_70px_70px] gap-3 border-b border-border bg-background/95 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
          <span>Member</span>
          <span>Callsign</span>
          <span>Rank</span>
          <span>Division</span>
          <span className="text-right">Calls</span>
          <span className="text-right">Hours</span>
        </div>

        {visible.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[160px_92px_110px_1fr_70px_70px] items-center gap-3 border-b border-border/50 px-4 py-2.5 text-[12px] transition-colors hover:bg-accent/30"
          >
            <span className="min-w-0">
              <span className="block truncate text-foreground">{m.name}</span>
              <span className="block truncate font-mono text-[10px] text-muted-foreground">
                {m.robloxUsername}
              </span>
            </span>
            <span className="font-mono text-[11px] font-semibold text-foreground">
              {m.callsign ?? "—"}
            </span>
            <span>
              <Badge variant="outline">{m.rank}</Badge>
            </span>
            <span className="min-w-0 truncate text-muted-foreground">{m.division}</span>
            <span className="text-right font-mono text-[11px] text-foreground">
              {m.callsToday}
            </span>
            <span className="text-right font-mono text-[11px] text-muted-foreground">
              {m.hours.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
