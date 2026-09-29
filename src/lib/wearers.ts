import type { TelemetryFrame } from "@/lib/kapha-stream";

export type TriageTag = "RED" | "YELLOW" | "GREEN";

export interface WearerRecord {
  nodeId: string;
  locketUid: string;
  abhaId: string;
  battery: number;
  tag: TriageTag;
  sector: string;
  vitals: Pick<TelemetryFrame, "hr" | "spo2" | "rr" | "hrv" | "co2">;
}

const SECTORS = ["A1 Camp Gate", "A2 Medical Tent", "Kitchen Block"];

export function wearerForNode(
  nodeId: string,
  tick: number,
  liveFrame?: TelemetryFrame,
): WearerRecord {
  const number = Number(nodeId.replace("L-", "")) || 1;
  const index = Math.max(0, number - 1);
  const tag: TriageTag = index < 2 ? "RED" : index < 7 ? "YELLOW" : "GREEN";
  const oscillation = Math.sin(tick * 0.7 + index * 3.1);
  const base = tag === "RED" ? [134, 89, 29, 11, 2240] : tag === "YELLOW" ? [112, 93, 23, 19, 1320] : [82, 97.5, 17, 38, 520];
  const generated = {
    hr: Math.round((base[0] ?? 80) + oscillation * 4),
    spo2: +((base[1] ?? 97) + oscillation * 0.8).toFixed(1),
    rr: Math.round((base[2] ?? 17) + oscillation * 2),
    hrv: +((base[3] ?? 35) - oscillation * 1.8).toFixed(1),
    co2: Math.round((base[4] ?? 520) + oscillation * 45),
  };

  return {
    nodeId,
    locketUid: `RK26-EF${String(9800 + number).padStart(4, "0")}`,
    abhaId: `91-XXXX-${String(4420 + number).padStart(4, "0")}`,
    battery: Math.max(42, 88 - index * 2),
    tag,
    sector: SECTORS[index % SECTORS.length] ?? "A1 Camp Gate",
    vitals: nodeId === "L-01" && liveFrame ? {
      hr: liveFrame.hr,
      spo2: liveFrame.spo2,
      rr: liveFrame.rr,
      hrv: liveFrame.hrv,
      co2: liveFrame.co2,
    } : generated,
  };
}

export function wearerRoster(tick: number, liveFrame?: TelemetryFrame): WearerRecord[] {
  return Array.from({ length: 24 }, (_, index) =>
    wearerForNode(`L-${String(index + 1).padStart(2, "0")}`, tick, liveFrame),
  );
}
