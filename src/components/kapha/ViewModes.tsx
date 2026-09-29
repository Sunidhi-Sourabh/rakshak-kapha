import { useState } from "react";
import type { TelemetryFrame } from "@/lib/kapha-stream";
import { wearerRoster, type TriageTag, type WearerRecord } from "@/lib/wearers";

export type ViewMode = "patient" | "command";

export function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  const opts: { id: ViewMode; label: string }[] = [
    { id: "patient", label: "👤 Individual Patient" },
    { id: "command", label: "🏥 ASHA / Command View" },
  ];
  return (
    <div className="relative flex rounded-sm border border-border bg-muted/40 p-1" role="tablist">
      <span
        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-sm transition-transform duration-300 ease-out"
        style={{
          transform: view === "patient" ? "translateX(0)" : "translateX(100%)",
          backgroundColor: "oklch(0.78 0.14 210 / 0.18)",
          border: "1px solid var(--vital-cyan)",
        }}
      />
      {opts.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={view === o.id}
          onClick={() => onChange(o.id)}
          className="relative z-10 flex-1 whitespace-nowrap px-3 py-1.5 text-[0.65rem] tracking-[0.14em] uppercase"
          style={{ color: view === o.id ? "var(--vital-cyan)" : "var(--muted-foreground)" }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span
      className="label-micro rounded-sm border px-2 py-1"
      style={{ borderColor: tone, color: tone, backgroundColor: `color-mix(in oklab, ${tone} 12%, transparent)` }}
    >
      {children}
    </span>
  );
}

export function PatientTopBar() {
  return (
    <section className="panel-frame flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="var(--vital-cyan)">PATIENT TELEMETRY</Badge>
        <span className="readout text-sm">RK26-EF9801</span>
        <span className="label-micro">ABHA 91-XXXX-4421</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="var(--vital-green)">Verified • Patient Bound</Badge>
        <Badge tone="var(--vital-green)">Battery 87% · ~4d 18h</Badge>
        <Badge tone="var(--vital-cyan)">BLE Link · Ready</Badge>
      </div>
    </section>
  );
}

export function LocalTopology() {
  return (
    <section className="panel-frame p-4">
      <h3 className="text-sm font-semibold tracking-widest">LOCAL TOPOLOGY</h3>
      <p className="label-micro mt-1">THIS NODE → NEAREST RELAY</p>
      <svg viewBox="0 0 300 90" className="mt-3 w-full">
        <line x1="50" y1="45" x2="250" y2="45" stroke="var(--vital-cyan)" strokeDasharray="5 4" strokeWidth="1.5">
          <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
        </line>
        <circle cx="50" cy="45" r="12" fill="var(--vital-red)" opacity="0.85" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">RK26-EF9801</text>
        <rect x="236" y="31" width="28" height="28" fill="var(--vital-green)" opacity="0.85" />
        <text x="250" y="80" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">Camp Gate - A1</text>
        <text x="150" y="36" textAnchor="middle" fontSize="10" fill="var(--vital-cyan)">-65 dBm · 1 hop</text>
      </svg>
      <div className="mt-2 flex justify-between label-micro">
        <span>RSSI -65 dBm</span>
        <span>ACCURACY ±2.5 m</span>
      </div>
    </section>
  );
}

const TAG_TONE: Record<TriageTag, string> = {
  RED: "var(--vital-red)",
  YELLOW: "var(--vital-amber)",
  GREEN: "var(--vital-green)",
};
export function CommandOverview({
  tick,
  liveFrame,
  onSelectWearer,
  onSilence,
  onExport,
  onBroadcast,
  silenced,
}: {
  tick: number;
  liveFrame: TelemetryFrame;
  onSelectWearer: (wearer: WearerRecord) => void;
  onSilence: () => void;
  onExport: () => void;
  onBroadcast: () => void;
  silenced: boolean;
}) {
  const list = wearerRoster(tick, liveFrame);
  const stats = [
    { l: "Total Patients Monitored", v: 24, t: "var(--vital-cyan)" },
    { l: "Immediate / Red Alert", v: 2, t: "var(--vital-red)" },
    { l: "Delayed / Yellow", v: 5, t: "var(--vital-amber)" },
    { l: "Minor / Green", v: 17, t: "var(--vital-green)" },
  ];
  const btn = "label-micro rounded-sm border px-3 py-2 hover:bg-panel-raised";
  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="panel-frame p-3">
            <div className="label-micro">{s.l}</div>
            <div className="readout mt-2 text-4xl" style={{ color: s.t }}>{s.v}</div>
          </div>
        ))}
      </section>
      <section className="flex flex-wrap gap-2">
        <button className={btn} onClick={onSilence}>{silenced ? "Camp Audio Silenced" : "Silence Camp Audio Alarm"}</button>
        <button className={btn} onClick={onExport}>Export Triage Log</button>
        <button className={btn} onClick={onBroadcast}>Broadcast Check-in</button>
      </section>
      <section className="panel-frame p-3">
        <div className="label-micro mb-2">PATIENT TRIAGE ROSTER · CLICK A ROW FOR DETAILS</div>
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="label-micro text-left">
                <th className="py-1">Patient</th><th className="px-3">Locket ID</th><th>Triage</th><th>Pulse</th><th>SpO₂</th><th>Sector</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.nodeId} tabIndex={0} onClick={() => onSelectWearer(p)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectWearer(p); } }} className="cursor-pointer border-t border-border/60 outline-none hover:bg-panel-raised focus-visible:bg-panel-raised">
                  <td className="readout py-1.5">{p.nodeId}</td>
                  <td className="px-3"><span className="readout whitespace-nowrap" style={{ color: "var(--vital-cyan)" }}>{p.locketUid}</span></td>
                  <td><Badge tone={TAG_TONE[p.tag]}>{p.tag}</Badge></td>
                  <td className="readout">{Math.round(p.vitals.hr)}</td>
                  <td className="readout">{p.vitals.spo2}%</td>
                  <td className="text-muted-foreground">{p.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
