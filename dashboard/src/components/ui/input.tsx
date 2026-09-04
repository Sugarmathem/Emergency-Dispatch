import * as React from "react";

import { cn } from "@/src/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-8 w-full rounded-md border border-input bg-background/60 px-2.5 py-1 text-[13px] shadow-none transition-colors placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring/60 focus-visible:ring-1 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
