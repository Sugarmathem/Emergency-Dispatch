import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[4px] border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        secondary: "border-border bg-secondary text-muted-foreground",
        outline: "border-border text-muted-foreground",
        ok: "border-ok/25 bg-ok/10 text-ok",
        warn: "border-warn/25 bg-warn/10 text-warn",
        danger: "border-primary/30 bg-primary/10 text-primary",
        info: "border-info/25 bg-info/10 text-info",
      },
    },
    defaultVariants: { variant: "secondary" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
