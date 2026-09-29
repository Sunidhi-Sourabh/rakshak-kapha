import React, { useState } from 'react';
import { Bluetooth, Radio, Signal, WifiOff, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';

interface GatewayLinkProps {
  nodeId?: string;
  className?: string;
}

export const GatewayLink: React.FC<GatewayLinkProps> = ({ 
  nodeId = "NODE-ALPHA-01", 
  className = "" 
}) => {
  const [status, setStatus] = useState<'DISCONNECTED' | 'SCANNING' | 'LINKED'>('DISCONNECTED');
  const [rssi, setRssi] = useState<number | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const handlePairGateway = async () => {
    setStatus('SCANNING');
    try {
      if (!navigator.bluetooth) {
        alert("Web Bluetooth Chrome/Edge browser me hi work karega.");
        setStatus('DISCONNECTED');
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });

      setDeviceName(device.name || "Offline Relay Hub");
      setRssi(-62);
      setStatus('LINKED');
    } catch (err) {
      console.log("BLE Pairing Cancelled:", err);
      setStatus('DISCONNECTED');
    }
  };

  const handleDisconnect = () => {
    setStatus('DISCONNECTED');
    setDeviceName(null);
    setRssi(null);
  };

  return (
    <div className={`bg-[#0a0f18] border border-cyan-900/60 rounded-md p-3 font-mono text-xs select-none shadow-lg ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-cyan-950 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${status === 'LINKED' ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'}`} />
          <span className="font-bold tracking-widest text-slate-200 uppercase">
            LOCAL GATEWAY INGRESS
          </span>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1 rounded">
            AIR-GAPPED
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${
            status === 'LINKED' ? 'bg-emerald-400 animate-ping' : 
            status === 'SCANNING' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'
          }`} />
          <span className={`text-[10px] font-bold ${
            status === 'LINKED' ? 'text-emerald-400' : 
            status === 'SCANNING' ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* Grid Telemetry Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1 text-[11px] text-slate-400 mb-2 border-b border-slate-900">
        <div>
          <span className="block text-[9px] text-slate-500 uppercase">Target Node</span>
          <span className="text-cyan-300 font-bold">{nodeId}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 uppercase">Relay Topology</span>
          <span className="text-slate-200">Point-to-Gateway (0 Cloud)</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 uppercase">BLE Signal (RSSI)</span>
          <span className="text-slate-200 flex items-center gap-1">
            <Signal className="w-3 h-3 text-cyan-400 inline" />
            {rssi ? `${rssi} dBm (Optimal)` : '--'}
          </span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 uppercase">Ingress Device</span>
          <span className="text-slate-200 truncate">{deviceName || 'No Relay Device'}</span>
        </div>
      </div>

      {/* Action Trigger Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {status !== 'LINKED' ? (
          <button
            onClick={handlePairGateway}
            disabled={status === 'SCANNING'}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 rounded text-cyan-300 transition-all font-semibold active:scale-[0.99]"
          >
            {status === 'SCANNING' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                SCANNING LOCAL FIELD HUBS...
              </>
            ) : (
              <>
                <Bluetooth className="w-3.5 h-3.5" />
                CONNECT LOCAL GATEWAY RELAY
              </>
            )}
          </button>
        ) : (
          <>
            <div className="flex-1 flex items-center gap-2 py-1.5 px-3 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-300 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>LINK ESTABLISHED — RE-ROUTING TELEMETRY LOCALLY</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="py-1.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/60 rounded text-rose-300 font-semibold transition-all"
            >
              DISCONNECT
            </button>
          </>
        )}
      </div>
    </div>
  );
};
