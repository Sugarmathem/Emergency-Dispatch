"use client";

import { useEffect, useState } from "react";
import { format } from "./format";

/**
 * Live UTC clock — HH:MM:SS UTC + the Zulu date stamp.
 * Hydration-safe: renders a placeholder until mounted on the client.
 */
export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2.5 font-mono">
      <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />
      <span className="text-sm font-medium tabular-nums text-foreground">
        {now ? format.utcHMS(now) : "--:--:--"}
      </span>
      <span className="hidden text-[11px] tracking-wider text-muted-foreground md:inline">
        {now ? format.zuluDate(now) : "UTC"}
      </span>
    </div>
  );
}
