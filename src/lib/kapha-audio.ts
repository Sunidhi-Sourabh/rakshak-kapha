/** Web Audio buzzer emulator for the virtual RAKSHAK-KAPHA patch. */
let ctx: AudioContext | null = null;
let alertTimer: ReturnType<typeof setInterval> | null = null;
let alertLabel: 0 | 1 | 2 | null = null;

function ac(): AudioContext {
  if (!ctx) {
    const C =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function chirp(freq: number, dur: number, gain = 0.06, type: OscillatorType = "square") {
  const a = ac();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, a.currentTime);
  g.gain.setValueAtTime(0, a.currentTime);
  g.gain.linearRampToValueAtTime(gain, a.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0005, a.currentTime + dur);
  osc.connect(g).connect(a.destination);
  osc.start();
  osc.stop(a.currentTime + dur + 0.02);
}

/** Soft periodic chirp for YELLOW (every 6 s). */
export function yellowChirp() {
  chirp(1180, 0.09, 0.04, "sine");
}

/** Modulated beep for RED (every 3 s). */
export function playModulatedBeep() {
  const a = ac();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(700, a.currentTime);
  osc.frequency.linearRampToValueAtTime(1900, a.currentTime + 0.18);
  osc.frequency.linearRampToValueAtTime(700, a.currentTime + 0.36);
  g.gain.setValueAtTime(0.001, a.currentTime);
  g.gain.linearRampToValueAtTime(0.075, a.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0005, a.currentTime + 0.38);
  osc.connect(g).connect(a.destination);
  osc.start();
  osc.stop(a.currentTime + 0.4);
}

export function stopAlertAudio() {
  if (alertTimer) clearInterval(alertTimer);
  alertTimer = null;
  alertLabel = null;
}

/**
 * Throttled triage alert control:
 * RED → one modulated beep every 3 s, YELLOW → soft chirp every 6 s,
 * GREEN (or muted) → audio fully stopped.
 */
export function handleTriageAlert(label: 0 | 1 | 2, audioOn: boolean) {
  if (!audioOn || label === 0) {
    stopAlertAudio();
    return;
  }
  if (alertLabel === label) return; // already running for this level
  stopAlertAudio();
  alertLabel = label;
  const fire = label === 2 ? playModulatedBeep : yellowChirp;
  const interval = label === 2 ? 3000 : 6000;
  fire();
  alertTimer = setInterval(fire, interval);
}

export function confirmBeep() {
  chirp(880, 0.07, 0.05, "triangle");
  setTimeout(() => chirp(1320, 0.09, 0.05, "triangle"), 90);
}
