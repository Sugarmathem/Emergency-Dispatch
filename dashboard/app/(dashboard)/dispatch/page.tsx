"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  ChevronsUpDown,
  MapPin,
  PhoneCall,
  Users,
} from "lucide-react";
import { PageHeader } from "@/src/components/dashboard/page-header";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { calls, units, type Call, type UnitStatus } from "@/src/lib/mock-data";
import { useDispatchStore } from "@/src/lib/dispatch-store";
import { cn } from "@/src/lib/utils";

const statusStyles: Record<UnitStatus, string> = {
  "10-8": "text-ok",
  "10-6": "text-info",
  "10-97": "text-warn",
  "10-23": "text-warn",
  "10-7": "text-muted-foreground",
  "10-11": "text-warn",
  "10-5": "text-muted-foreground",
};

function UnitRow({ unit }: { unit: (typeof units)[number] }) {
  const activeCallId = useDispatchStore((s) => s.activeCallId);
  const onActiveCall =
    activeCallId !== null && calls.find((c) => c.id === activeCallId)?.assigned.includes(unit.callsign);

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 text-[12px] transition-colors hover:bg-accent/40",
        onActiveCall && "bg-primary/5"
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", statusStyles[unit.status].replace("text-", "bg-"))} />
      <span className={cn("w-24 shrink-0 font-mono text-[11px] font-semibold", statusStyles[unit.status])}>
        {unit.callsign}
      </span>
      <span className="min-w-0 flex-1 truncate text-muted-foreground">{unit.detail ?? unit.vehicle}</span>
      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{unit.postal}</span>
    </div>
  );
}

function CallCard({ call }: { call: Call }) {
  const activeCallId = useDispatchStore((s) => s.activeCallId);
  const setActiveCall = useDispatchStore((s) => s.setActiveCall);
  const selected = activeCallId === call.id;

  return (
    <button
      type="button"
      onClick={() => setActiveCall(selected ? null : call.id)}
      className={cn(
        "w-full rounded-md border px-3 py-2.5 text-left transition-colors",
        selected
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-card hover:border-ring/30 hover:bg-accent/30"
      )}
    >
      <div className="flex items-center gap-2">
        {call.priority === 1 && <AlertTriangle className="size-3.5 shrink-0 text-primary" />}
        <span className="font-mono text-[11px] font-semibold text-primary">911-C{call.id}</span>
        <span className="font-mono text-[11px] text-muted-foreground">{call.time}</span>
        {call.priority === 1 && <Badge variant="danger">PRI 1</Badge>}
        {call.priority === 2 && <Badge variant="warn">PRI 2</Badge>}
        {call.priority === 3 && <Badge variant="info">PRI 3</Badge>}
        {call.status === "PENDING" && <Badge variant="outline">UNASSIGNED</Badge>}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">{call.postal}</span>
      </div>
      <p className="mt-1.5 text-[13px] font-semibold tracking-wide text-foreground">{call.type}</p>
      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
        <MapPin className="size-3" />
        {call.location}
      </p>
      {selected && (
        <div className="mt-2.5 border-t border-border/70 pt-2.5">
          <p className="text-xs leading-relaxed text-muted-foreground">{call.narrative}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Caller: <span className="text-foreground">{call.caller}</span> · Assigned:{" "}
            <span className="text-foreground">{call.assigned.length > 0 ? call.assigned.join(", ") : "NONE"}</span>
          </p>
        </div>
      )}
    </button>
  );
}

export default function DispatchPage() {
  const activeCallId = useDispatchStore((s) => s.activeCallId);
  const setActiveCall = useDispatchStore((s) => s.setActiveCall);
  const activeCall = calls.find((c) => c.id === activeCallId) ?? null;
  const [filter, setFilter] = React.useState<string>("all");

  const visibleCalls =
    filter === "all"
      ? calls
      : calls.filter((c) => c.status.toLowerCase() === filter);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        code="SEC 01 / DISPATCH"
        title="Live Dispatch Board"
        description="Calls for service and unit tracking — primary channel OPS-3"
        actions={
          <>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All calls</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            {activeCall && (
              <Button variant="outline" size="sm" onClick={() => setActiveCall(null)}>
                Clear
              </Button>
            )}
          </>
        }
      />

      <div className="grid flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[1fr_320px]">
        {/* Calls queue */}
        <div className="flex min-h-0 flex-col overflow-y-auto border-b border-border lg:border-b-0 lg:border-r">
          <div className="grid-lines sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
            <PhoneCall className="size-3.5 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Calls for service
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {visibleCalls.length} SHOWN
            </span>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {visibleCalls.map((call) => (
              <CallCard key={call.id} call={call} />
            ))}
          </div>
        </div>

        {/* Unit roster */}
        <aside className="flex min-h-0 flex-col overflow-hidden">
          <div className="grid-lines flex items-center gap-2 border-b border-border px-4 py-2">
            <Users className="size-3.5 text-muted-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Units on air
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {units.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {units.map((unit) => (
              <UnitRow key={unit.id} unit={unit} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
