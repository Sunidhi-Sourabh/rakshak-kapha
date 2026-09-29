import { useState } from "react";
import type { WearerRecord } from "@/lib/wearers";

function Header({ kicker, title, right }: { kicker: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <p className="label-micro">{kicker}</p>
        <h3 className="mt-1 text-base font-semibold tracking-wider">{title}</h3>
      </div>
      {right}
    </div>
  );
}

export function LocketIdentity() {
  return (
    <section className="panel-frame p-4">
      <Header kicker="HARDWARE BINDING" title="Locket Identity" />
      <div className="flex items-center gap-4">
        <div
          className="breathe flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-display text-xl font-bold"
          style={{
            borderColor: "var(--vital-green)",
            color: "var(--vital-green)",
            boxShadow: "0 0 22px oklch(0.82 0.19 152 / 0.45), inset 0 0 14px oklch(0.82 0.19 152 / 0.25)",
          }}
        >
          RK
        </div>
        <dl className="grid flex-1 gap-2 text-xs">
          <div>
            <dt className="label-micro">FACTORY EFUSE UID</dt>
            <dd className="mt-0.5 font-mono text-sm" style={{ color: "var(--vital-cyan)" }}>RK26-EF9801</dd>
          </div>
          <div>
            <dt className="label-micro">ABHA REFERENCE</dt>
            <dd className="mt-0.5 font-mono text-sm">91-XXXX-4421</dd>
          </div>
        </dl>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <span
          className="label-micro rounded-full border px-2.5 py-1"
          style={{ color: "var(--vital-green)", borderColor: "var(--vital-green)", backgroundColor: "oklch(0.82 0.19 152 / 0.1)" }}
        >
          ✓ VERIFIED • PATIENT BOUND
        </span>
        <span className="label-micro">Last authenticated 08:14:22</span>
      </div>
    </section>
  );
}

const NODES = [
  { id: "A1", name: "Camp Gate", x: 60, y: 60, fixed: true },
  { id: "A2", name: "Medical Tent", x: 300, y: 60, fixed: true },
  { id: "L-01", name: "", x: 110, y: 170, fixed: false },
  { id: "L-02", name: "", x: 200, y: 130, fixed: false },
  { id: "L-03", name: "", x: 270, y: 190, fixed: false },
];
const LINKS: [string, string, string, boolean][] = [
  ["A1", "A2", "-58 dBm", true],
  ["A1", "L-01", "-65 dBm", true],
  ["A1", "L-02", "-74 dBm", false],
  ["A2", "L-02", "-70 dBm", true],
  ["A2", "L-03", "-82 dBm", false],
  ["L-02", "L-03", "-77 dBm", false],
];

export function MeshTopology({ onSelectWearer }: { onSelectWearer: (nodeId: string) => void }) {
  const get = (id: string) => NODES.find((n) => n.id === id);
  return (
    <section className="panel-frame p-4">
      <Header
        kicker="LOCALIZATION LAYER"
        title="BLE Mesh Topology"
        right={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--vital-cyan)" strokeWidth="1.6">
            <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" />
            <path d="M12 1v5M12 18v5M1 12h5M18 12h5" />
          </svg>
        }
      />
      <span
        className="label-micro rounded-sm border px-2 py-0.5"
        style={{ color: "var(--vital-amber)", borderColor: "var(--vital-amber)" }}
      >
        SHELTER ZONE • NO GPS
      </span>
      <div className="mt-3 rounded-sm border border-border bg-background/60">
        <svg viewBox="0 0 360 240" className="h-auto w-full">
          {LINKS.map(([a, b, rssi, solid]) => {
            const p = get(a), q = get(b);
            if (!p || !q) return null;
            const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
            return (
              <g key={a + b}>
                <line
                  x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                  stroke={solid ? "var(--vital-cyan)" : "var(--muted-foreground)"}
                  strokeWidth={solid ? 1.5 : 1}
                  strokeDasharray={solid ? undefined : "4 4"}
                  opacity={0.8}
                />
                <rect x={mx - 24} y={my - 8} width="48" height="15" rx="2" fill="var(--panel)" stroke="var(--border)" />
                <text x={mx} y={my + 3} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono)" fill="var(--vital-cyan)">{rssi}</text>
              </g>
            );
          })}
          {NODES.map((n) =>
            n.fixed ? (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r="16" fill="oklch(0.82 0.19 152 / 0.15)" stroke="var(--vital-green)" strokeWidth="1.5" />
                <circle cx={n.x} cy={n.y} r="5" fill="var(--vital-green)" />
                <text x={n.x} y={n.y - 22} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--foreground)">{n.id}</text>
                <text x={n.x} y={n.y + 30} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--muted-foreground)">{n.name}</text>
              </g>
            ) : (
              <g
                key={n.id}
                className="breathe cursor-pointer outline-none focus-visible:[filter:drop-shadow(0_0_7px_var(--vital-cyan))]"
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                role="button"
                tabIndex={0}
                aria-label={`Open hardware binding for ${n.id}`}
                onClick={() => onSelectWearer(n.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectWearer(n.id);
                  }
                }}
              >
                <circle cx={n.x} cy={n.y} r="18" fill="transparent" />
                <rect x={n.x - 7} y={n.y - 7} width="14" height="14" transform={`rotate(45 ${n.x} ${n.y})`} fill="var(--vital-red)" />
                <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--vital-red)">{n.id}</text>
              </g>
            ),
          )}
        </svg>
      </div>
      <div className="mt-2 flex gap-4 label-micro">
        <span><span style={{ color: "var(--vital-green)" }}>●</span> Fixed relay</span>
        <span><span style={{ color: "var(--vital-red)" }}>◆</span> Wearable locket</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
        {[
          ["±2.5m", "LOCATION ACCURACY"],
          ["3 HOPS", "RELAY PATH"],
          ["-65 dBm", "BEST RSSI"],
        ].map(([v, l]) => (
          <div key={l}>
            <div className="readout text-lg" style={{ color: "var(--vital-cyan)" }}>{v}</div>
            <div className="label-micro mt-1 text-[0.55rem]">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// GATEWAY DEVICE LINK (OFFLINE BLE RELAY TO DASHBOARD)
// -------------------------------------------------------------
export function GatewayDeviceLink({ nodeId, locketUid }: { nodeId?: string; locketUid?: string }) {
  const [status, setStatus] = useState<"DISCONNECTED" | "SCANNING" | "LINKED">("DISCONNECTED");
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);
  const [rssi, setRssi] = useState<string>("-59 dBm");

  const pairLocalGateway = async () => {
    setStatus("SCANNING");
    try {
      const nav = navigator as unknown as { bluetooth?: { requestDevice: (opt: unknown) => Promise<{ name?: string }> } };
      if (!nav.bluetooth) {
        alert("Web Bluetooth Chrome ya Edge browser par hi supported hai.");
        setStatus("DISCONNECTED");
        return;
      }

      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      });

      setDeviceInfo(device.name || "Handheld Gateway Relay");
      setRssi("-56 dBm");
      setStatus("LINKED");
    } catch {
      setStatus("DISCONNECTED");
    }
  };

  const disconnectGateway = () => {
    setStatus("DISCONNECTED");
    setDeviceInfo(null);
  };

  return (
    <div className="mt-5 rounded-sm border border-border bg-panel p-3.5">
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-2 w-2 rounded-full"
            style={{
              backgroundColor: status === "LINKED" ? "var(--vital-green)" : status === "SCANNING" ? "var(--vital-amber)" : "var(--vital-red)",
              boxShadow: status === "LINKED" ? "0 0 8px var(--vital-green)" : undefined,
            }}
          />
          <span className="label-micro font-bold tracking-widest text-foreground">GATEWAY INGRESS RELAY</span>
        </div>
        <span
          className="label-micro rounded px-1.5 py-0.5 border"
          style={{
            color: status === "LINKED" ? "var(--vital-green)" : status === "SCANNING" ? "var(--vital-amber)" : "var(--vital-red)",
            borderColor: status === "LINKED" ? "var(--vital-green)" : status === "SCANNING" ? "var(--vital-amber)" : "var(--vital-red)",
            backgroundColor: "background/50",
          }}
        >
          {status === "LINKED" ? "RELAY LINKED" : status === "SCANNING" ? "SCANNING..." : "OFFLINE / STANDBY"}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="label-micro">TOPOLOGY</dt>
          <dd className="font-mono text-[11px] text-foreground">Peer-to-Gateway (0 Cloud)</dd>
        </div>
        <div>
          <dt className="label-micro">RSSI SIGNAL</dt>
          <dd className="font-mono text-[11px]" style={{ color: "var(--vital-cyan)" }}>
            {status === "LINKED" ? rssi : "--"}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="label-micro">RELAY CLIENT</dt>
          <dd className="font-mono text-[11px] text-muted-foreground truncate">
            {deviceInfo || `Local Bridge (${nodeId || 'NODE-01'} / ${locketUid || 'RK26-EF9801'})`}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex gap-2">
        {status !== "LINKED" ? (
          <button
            onClick={pairLocalGateway}
            disabled={status === "SCANNING"}
            className="w-full rounded-sm border px-3 py-1.5 font-mono text-xs font-semibold tracking-wider transition-colors"
            style={{
              borderColor: "var(--vital-cyan)",
              color: "var(--vital-cyan)",
              backgroundColor: "color-mix(in oklab, var(--vital-cyan) 10%, transparent)",
            }}
          >
            {status === "SCANNING" ? "SCANNING BLE BEACONS..." : "⚡ PAIR LOCAL GATEWAY (BLE)"}
          </button>
        ) : (
          <button
            onClick={disconnectGateway}
            className="w-full rounded-sm border px-3 py-1.5 font-mono text-xs font-semibold tracking-wider transition-colors"
            style={{
              borderColor: "var(--vital-red)",
              color: "var(--vital-red)",
              backgroundColor: "color-mix(in oklab, var(--vital-red) 10%, transparent)",
            }}
          >
            DISCONNECT RELAY
          </button>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// INDIVIDUAL PATIENT HARDWARE BINDING DRAWER
// -------------------------------------------------------------
export function HardwareBindingPanel({ wearer, onClose }: { wearer: WearerRecord | null; onClose: () => void }) {
  if (!wearer) return null;
  const tone = wearer.tag === "RED" ? "var(--vital-red)" : wearer.tag === "YELLOW" ? "var(--vital-amber)" : "var(--vital-green)";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/70 animate-fade-in" onClick={onClose}>
      <aside
        className="panel-frame h-full w-full max-w-sm animate-slide-in-right overflow-y-auto p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hardware-binding-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="label-micro">HARDWARE BINDING</p>
            <h2 id="hardware-binding-title" className="mt-1 text-xl font-semibold">{wearer.nodeId}</h2>
          </div>
          <button className="label-micro rounded-sm border px-2 py-1 hover:bg-panel-raised" onClick={onClose} aria-label="Close hardware binding panel">CLOSE</button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-bold" style={{ borderColor: tone, color: tone, boxShadow: `0 0 18px color-mix(in oklab, ${tone} 40%, transparent)` }}>RK</div>
          <div>
            <div className="label-micro">LOCKET UID</div>
            <div className="readout mt-1 text-lg" style={{ color: "var(--vital-cyan)" }}>{wearer.locketUid}</div>
          </div>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <BindingRow label="ABHA ID" value={wearer.abhaId} />
          <BindingRow label="Battery" value={`${wearer.battery}%`} tone="var(--vital-green)" />
          <BindingRow label="Triage" value={wearer.tag} tone={tone} />
          <BindingRow label="Sector" value={wearer.sector} />
        </dl>

        {/* INTEGRATED OFFLINE GATEWAY LINK COMPONENT */}
        <GatewayDeviceLink nodeId={wearer.nodeId} locketUid={wearer.locketUid} />

        <div className="mt-5 border-t border-border pt-4">
          <p className="label-micro mb-3">LIVE VITALS</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
            <Vital label="Pulse" value={`${Math.round(wearer.vitals.hr)} bpm`} tone={tone} />
            <Vital label="SpO₂" value={`${wearer.vitals.spo2.toFixed(1)}%`} tone={tone} />
            <Vital label="Resp rate" value={`${Math.round(wearer.vitals.rr)} br/min`} />
            <Vital label="HRV RMSSD" value={`${wearer.vitals.hrv.toFixed(1)} ms`} />
            <div className="col-span-2"><Vital label="Inhaled CO₂" value={`${Math.round(wearer.vitals.co2)} ppm`} /></div>
          </div>
        </div>

        <div className="mt-5 label-micro rounded-sm border px-3 py-2 text-center" style={{ color: "var(--vital-green)", borderColor: "var(--vital-green)" }}>✓ VERIFIED • PATIENT BOUND</div>
      </aside>
    </div>
  );
}

function BindingRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2"><dt className="label-micro">{label}</dt><dd className="readout text-right" style={tone ? { color: tone } : undefined}>{value}</dd></div>;
}

function Vital({ label, value, tone = "var(--vital-cyan)" }: { label: string; value: string; tone?: string }) {
  return <div className="bg-panel p-3"><div className="label-micro">{label}</div><div className="readout mt-2 text-lg" style={{ color: tone }}>{value}</div></div>;
}

export function BatteryTelemetry() {
  return (
    <section className="panel-frame p-4">
      <h3 className="text-sm font-semibold tracking-widest">BATTERY & CONNECTIVITY</h3>
      <div className="mt-3 flex items-end justify-between">
        <span className="readout text-3xl glow-green">87%</span>
        <span className="label-micro">EST 4d 18h remaining</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full" style={{ width: "87%", backgroundColor: "var(--vital-green)" }} />
      </div>
      <dl className="mt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <dt className="label-micro">BLE MESH LINK</dt>
          <dd className="label-micro rounded-full border px-2 py-0.5" style={{ color: "var(--vital-green)", borderColor: "var(--vital-green)" }}>READY</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="label-micro">LAST SYNC</dt>
          <dd className="font-mono" style={{ color: "var(--vital-cyan)" }}>12 sec ago</dd>
        </div>
      </dl>
    </section>
  );
}

export function ZeroGpsRationale() {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel-frame p-4" style={{ borderColor: "var(--vital-amber)" }}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="text-sm font-semibold tracking-widest" style={{ color: "var(--vital-amber)" }}>? WHY ZERO-GPS?</span>
        <span className="label-micro">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          GPS chips consume 25-40mA causing 80% battery drain, and fail under tin-sheet shelters.
          Passive BLE Mesh RSSI anchor mapping saves 90% power while locating patients within ±2.5 meters.
        </p>
      )}
    </section>
  );
}
