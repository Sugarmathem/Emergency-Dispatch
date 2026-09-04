import type { ElementType } from "react";
import {
  RadioTower,
  FileText,
  Gavel,
  UserPlus,
  ArrowUpCircle,
  Ban,
  Check,
} from "lucide-react";
import { PageHeader } from "@/src/components/dashboard/page-header";
import { activity, type ActivityItem } from "@/src/lib/mock-data";

const kindIcon: Record<ActivityItem["kind"], ElementType> = {
  PCR_SUBMITTED: FileText,
  PCR_APPROVED: Check,
  PCR_REJECTED: Ban,
  WARRANT_FILED: Gavel,
  WARRANT_EXECUTED: Gavel,
  "UNIT_10-8": RadioTower,
  UNIT_STATUS: RadioTower,
  PROMOTION: ArrowUpCircle,
  MEMBER_JOINED: UserPlus,
};

function kindClass(kind: ActivityItem["kind"]): string {
  if (kind.startsWith("PCR")) return "text-info";
  if (kind.startsWith("WARRANT")) return "text-primary";
  if (kind.startsWith("UNIT")) return "text-warn";
  return "text-muted-foreground";
}

export default function ActivityPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        code="SEC 06 / ACTIVITY"
        title="Activity Feed"
        description="Chronological audit trail of dispatch and records events"
      />

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-2xl">
          <ol className="relative ml-[9px] border-l border-border">
            {activity.map((item) => {
              const Icon = kindIcon[item.kind];
              return (
                <li key={item.id} className="relative flex gap-3 pb-5 pl-6">
                  <span className="absolute -left-[10px] top-0 flex size-5 items-center justify-center rounded-full border border-border bg-card">
                    <Icon className={`size-3 ${kindClass(item.kind)}`} />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-mono text-[11px] font-semibold text-foreground">
                        {item.actor}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.kind.replace(/_/g, " ")}
                      </span>
                      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
            — END OF FEED · {activity.length} EVENTS TODAY —
          </p>
        </div>
      </div>
    </div>
  );
}
