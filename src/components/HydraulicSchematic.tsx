import React, { useState } from 'react';
import { TelemetryData } from '../types';
import { Activity, Gauge, Cpu, Droplet, Layers, Trees, Building } from 'lucide-react';

interface HydraulicSchematicProps {
  telemetry: TelemetryData;
  onTriggerFlush: () => void;
  onTriggerIrrigation: () => void;
  isSimulating?: boolean;
  simSpeed?: number;
  showActions?: boolean;
}

const VALVE_LABEL: Record<string, string> = {
  reservoir: 'Klozet deposu',
  landscape: 'Peyzaj deposu',
  drain: 'Kanalizasyon',
};

const fmtL = (n: number) => Math.round(n).toLocaleString('tr-TR');

// Boru: gri zemin + akan kesikli çizgi
const Pipe: React.FC<{
  d: string;
  color: string;
  width?: number;
  fast?: boolean;
  active?: boolean;
}> = ({ d, color, width = 4, fast = false, active = true }) => (
  <g>
    <path d={d} stroke={active ? '#cbd5e1' : '#e2e8f0'} strokeWidth={7} fill="none" strokeLinecap="round" />
    {active && (
      <path
        d={d}
        stroke={color}
        strokeWidth={width}
        fill="none"
        strokeDasharray="6 6"
        className={fast ? 'hs-flow hs-flow-fast' : 'hs-flow'}
      />
    )}
  </g>
);

export const HydraulicSchematic: React.FC<HydraulicSchematicProps> = ({
  telemetry,
  onTriggerFlush,
  onTriggerIrrigation,
  isSimulating = true,
  simSpeed = 1,
  showActions = true,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('valve');

  const reservoirPct = Math.max(0, Math.min(100, Math.round((telemetry.reservoirTankLevel / telemetry.reservoirTankCapacity) * 100)));
  const landscapePct = Math.max(0, Math.min(100, Math.round((telemetry.landscapeTankLevel / telemetry.landscapeTankCapacity) * 100)));
  const valve = telemetry.smartValveState;

  const info: Record<string, { icon: React.ReactNode; tone: string; title: string; text: string; badge: string }> = {
    valve: {
      icon: <Cpu className="w-5 h-5" />,
      tone: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      title: 'Akıllı 3 yollu valf',
      text: 'Atık suyu önce klozet deposuna, dolunca peyzaja, ikisi de doluysa kanalizasyona yönlendirir.',
      badge: `Aktif yön: ${VALVE_LABEL[valve]}`,
    },
    pump: {
      icon: <Gauge className="w-5 h-5" />,
      tone: 'bg-sky-50 border-sky-200 text-sky-600',
      title: 'Değişken devirli pompa',
      text: 'Basıncı şebeke suyunun TDS değerine göre ayarlar.',
      badge: `${telemetry.pumpPressure} bar · ${telemetry.motorPowerWatts} W`,
    },
    membrane: {
      icon: <Layers className="w-5 h-5" />,
      tone: 'bg-cyan-50 border-cyan-200 text-cyan-600',
      title: 'RO membran',
      text: 'Suyu arıtır. Klasik tezgâh altı cihazlarda geri kazanım %20’dir.',
      badge: `Geri kazanım %${telemetry.recoveryRate}`,
    },
    reservoirTank: {
      icon: <Building className="w-5 h-5" />,
      tone: 'bg-blue-50 border-blue-200 text-blue-600',
      title: 'Klozet deposu',
      text: 'Arıtma atık suyu burada toplanır ve sifonlarda kullanılır.',
      badge: `%${reservoirPct} dolu · ${fmtL(telemetry.reservoirTankLevel)} / ${fmtL(telemetry.reservoirTankCapacity)} L`,
    },
    landscapeTank: {
      icon: <Trees className="w-5 h-5" />,
      tone: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      title: 'Peyzaj deposu',
      text: 'Klozet deposu dolunca atık su buraya yönlenir, bahçe sulamada kullanılır.',
      badge: `%${landscapePct} dolu · ${fmtL(telemetry.landscapeTankLevel)} / ${fmtL(telemetry.landscapeTankCapacity)} L`,
    },
    inlet: {
      icon: <Activity className="w-5 h-5" />,
      tone: 'bg-slate-100 border-slate-200 text-slate-600',
      title: 'Şebeke girişi',
      text: 'Giriş suyunun TDS değerini ölçer.',
      badge: `${telemetry.inletTds} ppm`,
    },
    pureWater: {
      icon: <Droplet className="w-5 h-5" />,
      tone: 'bg-cyan-50 border-cyan-200 text-cyan-600',
      title: 'İçme suyu hattı',
      text: 'Arıtılmış su dairelerin mutfaklarına gider.',
      badge: `${telemetry.pureTds} ppm`,
    },
    filter: {
      icon: <Layers className="w-5 h-5" />,
      tone: 'bg-slate-100 border-slate-200 text-slate-600',
      title: 'Ön filtre',
      text: 'Kum, pas ve klorü tutarak membranı korur.',
      badge: 'Sediment + karbon',
    },
  };
  const sel = info[selectedNode] || info.valve;

  const drainActive = valve === 'drain';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Başlık */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            Hidrolik Akış Şeması
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Şebekeden dairelere ve depolara su akışı.</p>
        </div>

        {showActions && (
          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerFlush}
              className="px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Building className="w-4 h-4 text-sky-600" />
              <span>Sifon çek (-60 L)</span>
            </button>
            <button
              onClick={onTriggerIrrigation}
              className="px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Trees className="w-4 h-4 text-emerald-600" />
              <span>Bahçeyi sula (-300 L)</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative w-full overflow-x-auto bg-slate-950/2 rounded-xl p-4 border border-slate-200/80">
          <svg
            viewBox="0 0 1000 480"
            className={`w-full min-w-[850px] h-auto select-none font-sans ${isSimulating ? '' : 'hs-paused'}`}
            style={
              {
                shapeRendering: 'geometricPrecision',
                '--flow-dur': `${(0.8 / Math.max(1, simSpeed)).toFixed(2)}s`,
              } as React.CSSProperties
            }
          >
            <style>{`
              .hs-flow { animation: hs-dash var(--flow-dur, 0.8s) linear infinite; }
              .hs-flow-fast { animation-duration: calc(var(--flow-dur, 0.8s) / 2); }
              .hs-paused .hs-flow { animation-play-state: paused; }
              @keyframes hs-dash { to { stroke-dashoffset: -12; } }
            `}</style>

            <defs>
              <linearGradient id="tankWaterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="landscapeWaterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
              </linearGradient>
              <clipPath id="resClip">
                <rect x="782" y="233" width="116" height="85" rx="4" />
              </clipPath>
              <clipPath id="landClip">
                <rect x="782" y="378" width="116" height="85" rx="4" />
              </clipPath>
            </defs>

            {/* BORULAR */}
            <Pipe d="M 50 240 L 160 240" color="#0284c7" />
            <Pipe d="M 160 240 L 260 240" color="#0284c7" />
            <Pipe d="M 260 240 L 370 240" color="#0369a1" width={5} fast />
            <Pipe d="M 510 215 L 610 215 L 610 110 L 820 110" color="#06b6d4" width={3.5} />
            <Pipe d="M 510 265 L 560 265 L 560 320 L 610 320" color="#f59e0b" width={3.5} />
            <Pipe d="M 640 310 L 710 310 L 710 270 L 780 270" color="#0284c7" active={valve === 'reservoir'} />
            <Pipe d="M 640 330 L 710 330 L 710 410 L 780 410" color="#059669" active={valve === 'landscape'} />
            <Pipe d="M 625 340 L 625 430" color="#ef4444" width={3} active={drainActive} />
            <Pipe d="M 900 270 L 940 270 L 940 180 L 890 180" color="#0284c7" width={3} />

            {/* Şebeke girişi */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('inlet')}>
              <rect x="20" y="200" width="85" height="80" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
              <rect x="20" y="200" width="85" height="24" rx="8" fill="#f1f5f9" />
              <text x="62" y="216" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">ŞEBEKE</text>
              <circle cx="62.5" cy="242" r="14" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
              <text x="62.5" y="246" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1" fontFamily="monospace">TDS</text>
              <text x="62.5" y="272" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="monospace">{telemetry.inletTds} ppm</text>
            </g>

            {/* Ön filtre */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('filter')}>
              <rect x="135" y="195" width="65" height="90" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
              <rect x="135" y="195" width="65" height="20" rx="8" fill="#f1f5f9" />
              <text x="167" y="209" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">FİLTRE</text>
              <rect x="145" y="222" width="18" height="50" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
              <rect x="171" y="222" width="18" height="50" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            </g>

            {/* Pompa */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('pump')}>
              <rect x="225" y="180" width="95" height="120" rx="10" fill="#ffffff" stroke={telemetry.aiDynamicMode ? '#0284c7' : '#64748b'} strokeWidth={telemetry.aiDynamicMode ? 2.5 : 2} />
              <rect x="225" y="180" width="95" height="24" rx="10" fill={telemetry.aiDynamicMode ? '#e0f2fe' : '#f1f5f9'} />
              <text x="272" y="196" textAnchor="middle" fontSize="11" fontWeight="bold" fill={telemetry.aiDynamicMode ? '#0369a1' : '#334155'}>POMPA</text>
              <circle cx="272" cy="235" r="22" fill="#f8fafc" stroke="#0284c7" strokeWidth="3" />
              <path d="M 272 217 L 272 253 M 254 235 L 290 235" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              <text x="272" y="278" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a" fontFamily="monospace">{telemetry.pumpPressure} bar</text>
              <text x="272" y="293" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">{telemetry.motorPowerWatts} W</text>
            </g>

            {/* RO membran */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('membrane')}>
              <rect x="355" y="180" width="155" height="120" rx="12" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="355" y="180" width="155" height="24" rx="12" fill="#e0f2fe" />
              <text x="432" y="196" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">RO MEMBRAN</text>
              <rect x="375" y="215" width="115" height="50" rx="6" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="432" y1="215" x2="432" y2="265" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
              <text x="432" y="246" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0284c7">Geri kazanım %{telemetry.recoveryRate}</text>
            </g>

            {/* Akıllı valf */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('valve')}>
              <circle cx="625" cy="320" r="28" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
              <text x="625" y="316" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4338ca">AKILLI</text>
              <text x="625" y="327" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4338ca">VALF</text>
              <circle cx="625" cy="320" r="18" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 2" />
              {valve === 'reservoir' && <path d="M 625 320 L 645 295" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />}
              {valve === 'landscape' && <path d="M 625 320 L 645 345" stroke="#059669" strokeWidth="3" strokeLinecap="round" />}
              <rect x="585" y="355" width="80" height="20" rx="4" fill="#e0e7ff" />
              <text x="625" y="369" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3730a3">
                {valve === 'reservoir' && 'KLOZET'}
                {valve === 'landscape' && 'PEYZAJ'}
                {valve === 'drain' && 'TAHLİYE'}
              </text>
            </g>

            {/* İçme suyu hattı */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('pureWater')}>
              <rect x="820" y="65" width="150" height="90" rx="10" fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" />
              <rect x="820" y="65" width="150" height="22" rx="10" fill="#ecfeff" />
              <text x="895" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0891b2">İÇME SUYU</text>
              <text x="895" y="115" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0e7490" fontFamily="monospace">{telemetry.pureTds} ppm</text>
              <text x="895" y="138" textAnchor="middle" fontSize="12" fill="#0891b2" fontFamily="monospace">{telemetry.pureFlowRate} L/saat</text>
            </g>

            {/* Klozet deposu */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('reservoirTank')}>
              <rect x="780" y="210" width="120" height="110" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <g clipPath="url(#resClip)">
                <rect
                  x="782" y="233" width="116" height="85"
                  fill="url(#tankWaterGrad)"
                  style={{ transform: `translateY(${(100 - reservoirPct) * 0.85}px)`, transition: 'transform 0.8s ease' }}
                />
              </g>
              <text x="840" y="228" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1">KLOZET DEPOSU</text>
              <text x="840" y="270" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0f172a" fontFamily="monospace">%{reservoirPct}</text>
              <text x="840" y="292" textAnchor="middle" fontSize="11" fill="#0369a1" fontFamily="monospace">
                {fmtL(telemetry.reservoirTankLevel)} / {fmtL(telemetry.reservoirTankCapacity)} L
              </text>
            </g>

            {/* Peyzaj deposu */}
            <g className="cursor-pointer" onClick={() => setSelectedNode('landscapeTank')}>
              <rect x="780" y="355" width="120" height="110" rx="8" fill="#ffffff" stroke="#059669" strokeWidth="2" />
              <g clipPath="url(#landClip)">
                <rect
                  x="782" y="378" width="116" height="85"
                  fill="url(#landscapeWaterGrad)"
                  style={{ transform: `translateY(${(100 - landscapePct) * 0.85}px)`, transition: 'transform 0.8s ease' }}
                />
              </g>
              <text x="840" y="373" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#047857">PEYZAJ DEPOSU</text>
              <text x="840" y="415" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0f172a" fontFamily="monospace">%{landscapePct}</text>
              <text x="840" y="437" textAnchor="middle" fontSize="11" fill="#047857" fontFamily="monospace">
                {fmtL(telemetry.landscapeTankLevel)} / {fmtL(telemetry.landscapeTankCapacity)} L
              </text>
            </g>

            {/* Kanalizasyon */}
            <g>
              <rect x="575" y="430" width="100" height="38" rx="6" fill="#f8fafc" stroke={drainActive ? '#ef4444' : '#94a3b8'} strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="625" y="446" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">KANALİZASYON</text>
              <text x="625" y="461" textAnchor="middle" fontSize="11" fontWeight="bold" fill={drainActive ? '#dc2626' : '#16a34a'} fontFamily="monospace">
                {drainActive ? `${fmtL(telemetry.rejectFlowRate)} L/saat` : '0 L/saat'}
              </text>
            </g>
          </svg>
        </div>

        {/* Seçilen parça */}
        <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${sel.tone}`}>{sel.icon}</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{sel.title}</h3>
              <p className="text-sm text-slate-600 mt-0.5">{sel.text}</p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums shrink-0">
            {sel.badge}
          </div>
        </div>
      </div>
    </div>
  );
};