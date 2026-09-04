"use client";

import * as React from "react";
import { PageHeader } from "@/src/components/dashboard/page-header";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { units, unitCounts, type UnitStatus } from "@/src/lib/mock-data";
import { cn } from "@/src/lib/utils";

const statusVariant: Record<UnitStatus, "ok" | "info" | "warn" | "secondary"> = {
  "10-8": "ok",
  "10-6": "info",
  "10-97": "warn",
  "10-23": "warn",
  "10-11": "warn",
  "10-7": "secondary",
  "10-5": "secondary",
};

const columns = "grid grid-cols-[96px_1fr_128px_92px_64px_56px] gap-3 px-4";

export default function UnitsPage() {
  const [query, setQuery] = React.useState("");
  const [agency, setAgency] = React.useState("all");

  const agencies = ["all", ...new Set(units.map((u) => u.agency))].sort();

  const visible = units.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      u.callsign.toLowerCase().includes(q) ||
      u.officer.toLowerCase().includes(q) ||
      u.vehicle.toLowerCase().includes(q);
    const matchesAgency = agency === "all" || u.agency === agency;
    return matchesQuery && matchesAgency;
  });

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        code="SEC 02 / UNITS"
        title="Unit Roster"
        description={`${unitCounts.total} units registered · ${unitCounts.available} available · ${unitCounts.onScene} on scene`}
        actions={
          <>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Callsign, officer, vehicle…"
              className="w-52 font-mono"
            />
            <Select value={agency} onValueChange={setAgency}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Agency" />
              </SelectTrigger>
              <SelectContent>
                {agencies.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a === "all" ? "All agencies" : a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className={cn(columns, "sticky top-0 z-10 border-b border-border bg-background/95 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur")}>
          <span>Callsign</span>
          <span>Officer / Vehicle</span>
          <span>Status</span>
          <span>Postal</span>
          <span>Updated</span>
          <span className="text-right">Beep</span>
        </div>

        {visible.map((u) => (
          <div
            key={u.id}
            className={cn(
              columns,
              "items-center border-b border-border/50 py-2 text-[12px] transition-colors hover:bg-accent/30"
            )}
          >
            <span className="font-mono text-[11px] font-semibold text-foreground">
              {u.callsign}
            </span>
            <span className="min-w-0 truncate text-muted-foreground">
              <span className="text-foreground">{u.officer}</span>
              <span className="mx-1.5 text-border">·</span>
              {u.vehicle}
            </span>
            <span>
              <Badge variant={statusVariant[u.status]}>{u.status}</Badge>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">{u.postal}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{u.updated}</span>
            <span className="text-right">
              {u.beep && <span className="size-1.5 inline-block rounded-full bg-warn" title="Beep tone on" />}
            </span>
          </div>
        ))}

        {visible.length === 0 && (
          <p className="px-4 py-10 text-center font-mono text-xs text-muted-foreground">
            NO UNITS MATCH FILTER
          </p>
        )}
      </div>
    </div>
  );
}
