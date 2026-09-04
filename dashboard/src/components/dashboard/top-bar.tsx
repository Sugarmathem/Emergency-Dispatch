"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RadioTower,
  Radio,
  FileText,
  Gavel,
  Users,
  History,
  Settings,
  CornerDownLeft,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { LiveClock } from "./live-clock";
import { useDispatchStore } from "@/src/lib/dispatch-store";

const pages = [
  { href: "/dispatch", label: "Dispatch", icon: RadioTower, hint: "Live board" },
  { href: "/units", label: "Units", icon: Radio, hint: "Roster & statuses" },
  { href: "/pcrs", label: "PCRs", icon: FileText, hint: "Review queue" },
  { href: "/warrants", label: "Warrants", icon: Gavel, hint: "Active orders" },
  { href: "/members", label: "Members", icon: Users, hint: "Roster" },
  { href: "/activity", label: "Activity", icon: History, hint: "Audit feed" },
  { href: "/settings", label: "Settings", icon: Settings, hint: "Server config" },
];

export function TopBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const operator = useDispatchStore((s) => s.operator);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function run(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-4 border-b border-border bg-card/40 px-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex h-7 w-64 items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 text-left text-[13px] text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
        >
          <Search className="size-3.5 shrink-0" />
          <span className="flex-1 truncate">Search calls, units, records…</span>
          <kbd className="rounded border border-border bg-secondary px-1 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-4">
          <LiveClock />
          <div className="hidden h-5 w-px bg-border sm:block" />
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="flex size-6 items-center justify-center rounded-[5px] bg-primary/15 font-mono text-[10px] font-semibold text-primary">
              {operator.callsign.slice(0, 2)}
            </div>
            <div className="leading-tight">
              <p className="font-mono text-[11px] font-medium text-foreground">
                {operator.name}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {operator.callsign} · {operator.position}
              </p>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl" showClose={false}>
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <DialogDescription className="sr-only">
            Jump to a page or run a dispatch action
          </DialogDescription>
          <Command>
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <CommandEmpty className="py-5 text-center font-mono text-xs text-muted-foreground">
                NO RESULTS
              </CommandEmpty>
              <CommandGroup heading="Navigate">
                {pages.map((p) => (
                  <CommandItem key={p.href} onSelect={() => run(p.href)}>
                    <p.icon className="size-4 text-muted-foreground" />
                    <span>{p.label}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {p.hint}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Quick actions">
                <CommandItem onSelect={() => run("/pcrs")}>
                  <FileText className="size-4 text-muted-foreground" />
                  <span>Review pending PCRs</span>
                  <CornerDownLeft className="ml-auto size-3 text-muted-foreground" />
                </CommandItem>
                <CommandItem onSelect={() => run("/dispatch")}>
                  <RadioTower className="size-4 text-muted-foreground" />
                  <span>Go to live dispatch board</span>
                  <CornerDownLeft className="ml-auto size-3 text-muted-foreground" />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
