"use client";

import * as React from "react";
import { PageHeader } from "@/src/components/dashboard/page-header";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { useDispatchStore } from "@/src/lib/dispatch-store";

const channelDefaults = [
  { label: "911 Emergencies", value: "#911-dispatch", tone: "danger" as const },
  { label: "PCR Submissions", value: "#pcr-review", tone: "info" as const },
  { label: "Warrant Actions", value: "#warrants", tone: "danger" as const },
  { label: "Radio Logs", value: "#radio-logs", tone: "secondary" as const },
];

export default function SettingsPage() {
  const operator = useDispatchStore((s) => s.operator);

  const [autoAssign, setAutoAssign] = React.useState(true);
  const [beepOnNew, setBeepOnNew] = React.useState(true);
  const [compact, setCompact] = React.useState(false);
  const [soundAlerts, setSoundAlerts] = React.useState(false);

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        code="SEC 07 / SETTINGS"
        title="Console Settings"
        description="Server integration and operator preferences"
        actions={<Button variant="outline" size="sm">Save changes</Button>}
      />

      <div className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <Card>
          <CardHeader>
            <CardTitle>Server Integration</CardTitle>
            <Badge variant="ok">CONNECTED</Badge>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <Field label="ER:LC API Key">
              <Input
                type="password"
                defaultValue="erlc_sk_••••••••••••3f2a"
                className="font-mono"
              />
            </Field>
            <Field label="PCR Review Channel">
              <Input defaultValue="#pcr-review" className="font-mono" />
            </Field>
            <Field label="Log Channel">
              <Input defaultValue="#dispatch-logs" className="font-mono" />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {channelDefaults.map((row, i) => (
              <React.Fragment key={row.label}>
                {i > 0 && <Separator className="my-3" />}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] text-foreground">{row.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{row.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={row.tone}>{row.tone === "danger" ? "P1" : "P3"}</Badge>
                    <Switch defaultChecked={row.label !== "Radio Logs"} />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operator Preferences</CardTitle>
            <span className="font-mono text-[10px] text-muted-foreground">
              {operator.callsign}
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-foreground">Auto-assign nearest unit</p>
                <p className="text-[11px] text-muted-foreground">
                  Suggest the closest 10-8 unit when a call is created
                </p>
              </div>
              <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-foreground">Beep on new call</p>
                <p className="text-[11px] text-muted-foreground">
                  Audible tone when a priority call hits the queue
                </p>
              </div>
              <Switch checked={beepOnNew} onCheckedChange={setBeepOnNew} />
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-foreground">Sound alerts</p>
                <p className="text-[11px] text-muted-foreground">
                  Play alert sounds for warrant filings and executions
                </p>
              </div>
              <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-foreground">Compact rows</p>
                <p className="text-[11px] text-muted-foreground">
                  Tighter list density across units and PCR tables
                </p>
              </div>
              <Switch checked={compact} onCheckedChange={setCompact} />
            </div>
          </CardContent>
        </Card>

        <p className="pb-2 text-center font-mono text-[10px] text-muted-foreground">
          PULSE·RESPONSE v0.1.0 · BUILD {new Date().getFullYear()}-09-04 · NODE RC-2
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-3">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
