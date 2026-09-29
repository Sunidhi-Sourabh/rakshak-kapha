import { TRIAGE_META, type InferenceResult } from "@/lib/triage-model";

export function TriageBanner({ result }: { result: InferenceResult }) {
  const meta = TRIAGE_META[result.label];
  const flashing = result.label === 2;

  return (
    <div
      className="panel-frame relative overflow-hidden p-4"
      style={{
        borderColor: meta.token,
        backgroundImage: `linear-gradient(90deg, ${meta.token}22, transparent 60%)`,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-3 rounded-sm ${flashing ? "flash-alarm" : "breathe"}`}
            style={{ backgroundColor: meta.token, boxShadow: `0 0 22px ${meta.token}` }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="label-micro">mSTaRT ON-DEVICE CLASSIFICATION</span>
              <span
                className="label-micro rounded px-1.5 py-0.2 border text-[0.6rem]"
                style={{
                  color: "var(--vital-cyan)",
                  borderColor: "var(--vital-cyan)",
                  backgroundColor: "color-mix(in oklab, var(--vital-cyan) 10%, transparent)",
                }}
              >
                LOCAL RELAY • 0-CLOUD
              </span>
            </div>
            <div
              className={`readout text-3xl sm:text-4xl ${flashing ? "flash-alarm" : ""}`}
              style={{ color: meta.token, textShadow: `0 0 26px ${meta.token}77` }}
            >
              {meta.code} · {meta.name}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{meta.action}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-right">
          <div>
            <div className="label-micro">Votes</div>
            <div className="readout text-lg">
              {result.votes[0]}/{result.votes[1]}/{result.votes[2]}
            </div>
          </div>
          <div>
            <div className="label-micro">Confidence</div>
            <div className="readout text-lg">{Math.round(result.confidence * 100)}%</div>
          </div>
          <div>
            <div className="label-micro">Inference</div>
            <div className="readout text-lg glow-green">
              {(result.latencyMs * 1000).toFixed(1)} µs
            </div>
          </div>
          <div>
            <div className="label-micro">Gateway Hop</div>
            <div className="readout text-lg" style={{ color: "var(--vital-cyan)" }}>
              Direct BLE
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2.5">
        <div className="flex flex-wrap gap-1.5">
          {result.perTree.map((cls, i) => (
            <span
              key={i}
              className="label-micro rounded-sm border px-1.5 py-0.5"
              style={{ color: TRIAGE_META[cls].token, borderColor: TRIAGE_META[cls].token }}
            >
              tree_{i} → {TRIAGE_META[cls].code[0]}
            </span>
          ))}
        </div>
        <div className="label-micro text-[0.6rem] text-muted-foreground">
          INGRESS: AIR-GAPPED HARDWARE BINDING ACTIVE
        </div>
      </div>
    </div>
  );
}
