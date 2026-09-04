"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  RadioTower,
  FileText,
  Gavel,
  Users,
  History,
  Settings,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { pcrCounts, warrantCounts } from "@/src/lib/mock-data";

const groups: {
  title: string;
  items: { href: string; label: string; icon: typeof Radio }[];
}[] = [
  {
    title: "Operations",
    items: [
      { href: "/dispatch", label: "Dispatch", icon: RadioTower },
      { href: "/units", label: "Units", icon: Radio },
    ],
  },
  {
    title: "Records",
    items: [
      { href: "/pcrs", label: "PCRs", icon: FileText },
      { href: "/warrants", label: "Warrants", icon: Gavel },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/members", label: "Members", icon: Users },
      { href: "/activity", label: "Activity", icon: History },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function countsFor(href: string): number | null {
  if (href === "/pcrs") return pcrCounts.pending;
  if (href === "/warrants") return warrantCounts.active;
  return null;
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-0.5">
          <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {group.title}
          </p>
          {group.items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const count = countsFor(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-0.5 rounded-full",
                    active ? "bg-primary" : "bg-transparent"
                  )}
                />
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    active
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className={cn(active && "font-medium")}>{item.label}</span>
                {count !== null && count > 0 && (
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
