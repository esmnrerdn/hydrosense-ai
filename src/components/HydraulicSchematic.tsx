import React, { useState } from 'react';
import { TelemetryData } from '../types';
import { 
  Activity, 
  Gauge, 
  Cpu, 
  Droplet, 
  RotateCw, 
  Layers, 
  Sparkles, 
  Home, 
  Trees, 
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building
} from 'lucide-react';

interface HydraulicSchematicProps {
  telemetry: TelemetryData;
  onTriggerFlush: () => void;
  onTriggerIrrigation: () => void;
}

export const HydraulicSchematic: React.FC<HydraulicSchematicProps> = ({
  telemetry,
  onTriggerFlush,
  onTriggerIrrigation
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('valve');

  const reservoirPct = Math.min(100, Math.round((telemetry.reservoirTankLevel / telemetry.reservoirTankCapacity) * 100));
  const landscapePct = Math.min(100, Math.round((telemetry.landscapeTankLevel / telemetry.landscapeTankCapacity) * 100));

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            Site Merkezi SCADA Hidrolik Akış Şeması
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Şebeke TDS Dinleme · Yapay Zekâ Basınç Optimizasyonu · 3-Yollu Akıllı Valf Geri Kazanımı
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerFlush}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Building className="w-3.5 h-3.5 text-sky-600" />
            <span>Sifon Tüket (-100L)</span>
          </button>
          <button
            onClick={onTriggerIrrigation}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bahçe Sula (-300L)</span>
          </button>
        </div>
      </div>

      {/* Main SCADA Canvas */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative w-full overflow-x-auto bg-slate-950/2 rounded-xl p-4 border border-slate-200/80">
          
          <svg
            viewBox="0 0 1000 480"
            className="w-full min-w-[850px] h-auto select-none font-sans"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              <linearGradient id="feedWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              <linearGradient id="pureWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <linearGradient id="rejectWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <linearGradient id="tankWaterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="landscapeWaterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* PIPE LINES (STATIC BACKGROUND & ANIMATED FLOW STREAMS) */}

            {/* 1. Inlet line: City Main (40, 240) -> PreFilter (160, 240) */}
            <path d="M 50 240 L 160 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
            <path d="M 50 240 L 160 240" stroke="#0284c7" strokeWidth="4" strokeDasharray="6 6" className="animate-flow" />

            {/* 2. PreFilter -> VFD Pump (240, 240) */}
            <path d="M 160 240 L 260 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
            <path d="M 160 240 L 260 240" stroke="#0284c7" strokeWidth="4" strokeDasharray="6 6" className="animate-flow" />

            {/* 3. VFD Pump -> RO Membrane Vessel (380, 240) */}
            <path d="M 260 240 L 370 240" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
            <path d="M 260 240 L 370 240" stroke="#0369a1" strokeWidth="5" strokeDasharray="6 6" className="animate-flow-fast" />

            {/* 4. RO Pure Water Line: RO (510, 215) -> UV & Booster -> Site Drinking Line */}
            <path d="M 510 215 L 610 215 L 610 110 L 820 110" stroke="#cbd5e1" strokeWidth="7" fill="none" />
            <path d="M 510 215 L 610 215 L 610 110 L 820 110" stroke="#06b6d4" strokeWidth="3.5" fill="none" strokeDasharray="6 6" className="animate-flow" />

            {/* 5. RO Reject Line: RO (510, 265) -> Smart 3-Way Valve (600, 310) */}
            <path d="M 510 265 L 560 265 L 560 320 L 610 320" stroke="#cbd5e1" strokeWidth="7" fill="none" />
            <path d="M 510 265 L 560 265 L 560 320 L 610 320" stroke="#f59e0b" strokeWidth="3.5" fill="none" strokeDasharray="6 6" className="animate-flow" />

            {/* 6. Smart Valve Branch A: Valve (640, 310) -> Reservoir Tank (800, 280) */}
            <path d="M 640 310 L 710 310 L 710 270 L 780 270" stroke={telemetry.smartValveState === 'reservoir' ? '#cbd5e1' : '#e2e8f0'} strokeWidth="7" fill="none" />
            {telemetry.smartValveState === 'reservoir' && (
              <path d="M 640 310 L 710 310 L 710 270 L 780 270" stroke="#0284c7" strokeWidth="4" fill="none" strokeDasharray="6 6" className="animate-flow" />
            )}

            {/* 7. Smart Valve Branch B: Valve (640, 330) -> Landscape Tank (800, 410) */}
            <path d="M 640 330 L 710 330 L 710 410 L 780 410" stroke={telemetry.smartValveState === 'landscape' ? '#cbd5e1' : '#e2e8f0'} strokeWidth="7" fill="none" />
            {telemetry.smartValveState === 'landscape' && (
              <path d="M 640 330 L 710 330 L 710 410 L 780 410" stroke="#059669" strokeWidth="4" fill="none" strokeDasharray="6 6" className="animate-flow" />
            )}

            {/* 8. Smart Valve Branch C: Emergency Drain Line */}
            <path d="M 625 340 L 625 430" stroke={telemetry.smartValveState === 'drain' ? '#cbd5e1' : '#e2e8f0'} strokeWidth="6" strokeDasharray="4 4" />
            {telemetry.smartValveState === 'drain' && (
              <path d="M 625 340 L 625 430" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 6" className="animate-flow" />
            )}

            {/* 9. Output line from Reservoir Tank to Toilet Risers */}
            <path d="M 900 270 L 940 270 L 940 180 L 890 180" stroke="#cbd5e1" strokeWidth="6" fill="none" />
            <path d="M 900 270 L 940 270 L 940 180 L 890 180" stroke="#0284c7" strokeWidth="3" fill="none" strokeDasharray="6 6" className="animate-flow" />

            {/* COMPONENT BLOCKS */}

            {/* NODE 1: Şebeke Girişi & TDS Sensor */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('inlet')}
            >
              <rect x="20" y="200" width="85" height="80" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
              <rect x="20" y="200" width="85" height="24" rx="8" fill="#f1f5f9" />
              <text x="62" y="216" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">ŞEBEKE GİRİŞİ</text>
              
              <circle cx="62.5" cy="242" r="14" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
              <text x="62.5" y="246" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369a1" fontFamily="monospace">
                TDS
              </text>
              <text x="62.5" y="272" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a" fontFamily="monospace">
                {telemetry.inletTds} ppm
              </text>
            </g>

            {/* NODE 2: Ön Filtreler */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('filter')}
            >
              <rect x="135" y="195" width="65" height="90" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
              <rect x="135" y="195" width="65" height="20" rx="8" fill="#f1f5f9" />
              <text x="167" y="209" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#334155">ÖN FİLTRE</text>
              
              <rect x="145" y="222" width="18" height="50" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
              <rect x="171" y="222" width="18" height="50" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
              <text x="167" y="282" textAnchor="middle" fontSize="8" fill="#64748b">5μm + CTO</text>
            </g>

            {/* NODE 3: Değişken Frekanslı AI Pompa */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('pump')}
            >
              <rect x="225" y="180" width="95" height="120" rx="10" fill="#ffffff" stroke={telemetry.aiDynamicMode ? "#0284c7" : "#64748b"} strokeWidth={telemetry.aiDynamicMode ? "2.5" : "2"} filter="drop-shadow(0 3px 6px rgba(0,0,0,0.08))" />
              <rect x="225" y="180" width="95" height="24" rx="10" fill={telemetry.aiDynamicMode ? "#e0f2fe" : "#f1f5f9"} />
              <text x="272" y="196" textAnchor="middle" fontSize="10" fontWeight="bold" fill={telemetry.aiDynamicMode ? "#0369a1" : "#334155"}>
                AI VFD MOTOR
              </text>

              <circle cx="272" cy="235" r="22" fill="#f8fafc" stroke="#0284c7" strokeWidth="3" />
              <path d="M 272 217 L 272 253 M 254 235 L 290 235" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              
              <text x="272" y="272" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a" fontFamily="monospace">
                {telemetry.pumpPressure} bar
              </text>
              <text x="272" y="288" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">
                {telemetry.pumpFrequencyHz} Hz · {telemetry.motorPowerWatts}W
              </text>
            </g>

            {/* NODE 4: Merkezi RO Membran */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('membrane')}
            >
              <rect x="355" y="180" width="155" height="120" rx="12" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.08))" />
              <rect x="355" y="180" width="155" height="24" rx="12" fill="#e0f2fe" />
              <text x="432" y="196" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
                MERKEZİ RO MEMBRAN
              </text>

              <rect x="375" y="215" width="115" height="50" rx="6" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="432" y1="215" x2="432" y2="265" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
              <text x="432" y="244" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0284c7">
                Geri Kazanım: %{telemetry.recoveryRate}
              </text>

              <text x="432" y="286" textAnchor="middle" fontSize="10" fill="#64748b">
                Site Kapasitesi · %97 Tuz Reddi
              </text>
            </g>

            {/* NODE 5: Akıllı 3-Yollu Valf */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('valve')}
            >
              <circle cx="625" cy="320" r="28" fill="#ffffff" stroke="#6366f1" strokeWidth="3" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.1))" />
              <text x="625" y="316" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4338ca">AKILLI</text>
              <text x="625" y="327" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4338ca">VALF</text>

              <circle cx="625" cy="320" r="18" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 2" />
              {telemetry.smartValveState === 'reservoir' && (
                <path d="M 625 320 L 645 295" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              )}
              {telemetry.smartValveState === 'landscape' && (
                <path d="M 625 320 L 645 345" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
              )}

              <rect x="585" y="355" width="80" height="20" rx="4" fill="#e0e7ff" />
              <text x="625" y="369" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3730a3">
                {telemetry.smartValveState === 'reservoir' && 'HAT A: REZERVUAR'}
                {telemetry.smartValveState === 'landscape' && 'HAT B: PEYZAJ'}
                {telemetry.smartValveState === 'drain' && 'HAT C: TAHLİYE'}
              </text>
            </g>

            {/* NODE 6: Site İçme Suyu Dağıtımı */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('pureWater')}
            >
              <rect x="820" y="65" width="150" height="90" rx="10" fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
              <rect x="820" y="65" width="150" height="22" rx="10" fill="#ecfeff" />
              <text x="895" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0891b2">
                SİTE İÇME SUYU HATTI
              </text>

              <text x="895" y="110" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#0e7490" fontFamily="monospace">
                {telemetry.pureTds} ppm
              </text>
              <text x="895" y="128" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#0891b2" fontFamily="monospace">
                Debi: {telemetry.pureFlowRate} L/saat
              </text>
              <text x="895" y="144" textAnchor="middle" fontSize="9" fill="#64748b">
                Site Mutfak Dağıtımı
              </text>
            </g>

            {/* NODE 7: Site Klozet Rezervuar Deposu (2.000 L) */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('reservoirTank')}
            >
              <rect x="780" y="210" width="120" height="110" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
              
              <rect 
                x="782" 
                y={318 - (reservoirPct * 0.85)} 
                width="116" 
                height={reservoirPct * 0.85} 
                rx="4" 
                fill="url(#tankWaterGrad)" 
              />

              <text x="840" y="230" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
                KLOZET DEPOSU
              </text>
              <text x="840" y="260" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a" fontFamily="monospace">
                %{reservoirPct}
              </text>
              <text x="840" y="280" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#0284c7" fontFamily="monospace">
                {telemetry.reservoirTankLevel} / 2.000 L
              </text>
              <text x="840" y="305" textAnchor="middle" fontSize="8" fill="#475569">
                Site Sifon Beslemesi
              </text>
            </g>

            {/* NODE 8: Site Peyzaj Deposu (1.500 L) */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedNode('landscapeTank')}
            >
              <rect x="780" y="355" width="120" height="110" rx="8" fill="#ffffff" stroke="#059669" strokeWidth="2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.06))" />
              
              <rect 
                x="782" 
                y={463 - (landscapePct * 0.85)} 
                width="116" 
                height={landscapePct * 0.85} 
                rx="4" 
                fill="url(#landscapeWaterGrad)" 
              />

              <text x="840" y="375" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#047857">
                PEYZAJ DEPOSU
              </text>
              <text x="840" y="405" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a" fontFamily="monospace">
                %{landscapePct}
              </text>
              <text x="840" y="425" textAnchor="middle" fontSize="11" fontWeight="medium" fill="#059669" fontFamily="monospace">
                {telemetry.landscapeTankLevel} / 1.500 L
              </text>
              <text x="840" y="450" textAnchor="middle" fontSize="8" fill="#475569">
                Ortak Bahçe Damlama
              </text>
            </g>

            {/* NODE 9: Emniyet Tahliyesi */}
            <g>
              <rect x="585" y="430" width="80" height="35" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="625" y="445" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748b">KANALİZASYON</text>
              <text x="625" y="458" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#16a34a" fontFamily="monospace">
                0 L/saat (SIFIR İSRAF)
              </text>
            </g>

          </svg>
        </div>

        {/* Selected Component Detail Inspector Box */}
        <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          {selectedNode === 'valve' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Akıllı 3-Yollu Selenoid Valf Matrisi
                    <span className="text-xs font-normal text-slate-500">· Sıfır İsraf Teknolojisi</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    RO membranından çıkan konsantre atık su mineralli ve kireçsizdir. Akıllı valf, su seviyesi sensörlerini okuyarak atık suyu öncelikli olarak <strong>Site Klozet Rezervuar Ana Deposuna (2.000 L)</strong> aktarır. Rezervuar dolduğunda otomatik olarak <strong>Bahçe Peyzaj Deposuna (1.500 L)</strong> geçiş yapar.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  Aktif Yön: <span className="font-bold text-indigo-700">{telemetry.smartValveState.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'pump' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                  <Gauge className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Değişken Frekanslı AI Pompa (VFD Booster)
                    <span className="text-xs font-normal text-slate-500">· Site Merkezi Motor</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Geleneksel arıtmalar şebeke TDS’i 180 ppm olsa bile motoru sabit 6.5 bar tam güçte çalıştırır. HydroSense AI, osmotik basıncı (<span className="font-mono">Π = 0.0075 × TDS</span>) anlık hesaplayarak motor basıncını <strong>{telemetry.pumpPressure} bar</strong> seviyesine optimize eder; motoru yıpratmaz ve elektrik faturasını %38 düşürür.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  Çekilen Güç: <span className="font-bold text-slate-900">{telemetry.motorPowerWatts} Watt</span> ({telemetry.pumpFrequencyHz} Hz)
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'membrane' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Merkezi Ters Ozmoz (RO) Membran Ünitesi
                    <span className="text-xs font-normal text-slate-500">· Yüksek Geri Kazanım Modeli</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Tezgâh altı küçük cihazlar %20 sabit geri kazanım ile 1 bardak temiz su için 4 bardak suyu kanalizasyona döker. Merkezi sistemimiz dinamik basınç ve spiral sarımlı endüstriyel membran ile <strong>%{telemetry.recoveryRate} geri kazanım oranı</strong> sağlar.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  Geri Kazanım: <span className="font-bold text-sky-700">%{telemetry.recoveryRate}</span>
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'reservoirTank' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Site Klozet Rezervuar Ana Deposu (2.000 Litre)
                    <span className="text-xs font-normal text-slate-500">· Sifon Dağıtım Kolon Hattı</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Sitede dairelerin her birinde günde ortalama 5 kez sifon çekilir (daire başı 30 L, site geneli günde 600 L). Arıtmanın ürettiği tüm atık su doğrudan bu depoya dolarak sitenin tüm sifon ihtiyacını sıfır şebeke suyu harcayarak karşılar.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  Depo: <span className="font-bold text-blue-700">%{reservoirPct} Dolu</span> ({telemetry.reservoirTankLevel} L)
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'landscapeTank' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Trees className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Site Bahçe & Peyzaj Sulama Deposu (1.500 Litre)
                    <span className="text-xs font-normal text-slate-500">· Yeşil Alan Damlama Ağı</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Klozet deposu dolduğunda akıllı valf suyu bahçe sulama deposuna pompalar. Peyzaj bitkileri ve çimler için mineral açısından zengin olan bu su, yaz aylarında pahalı şehir şebeke suyu kullanımını ortadan kaldırır.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  Depo: <span className="font-bold text-emerald-700">%{landscapePct} Dolu</span> ({telemetry.landscapeTankLevel} L)
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'inlet' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Şebeke Su Girişi & Anlık TDS Probu
                    <span className="text-xs font-normal text-slate-500">· Çevrimiçi Sensör Takibi</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Belediye şebekesinden siteye giren suyun iletkenlik ve çözünmüş katı madde (TDS) miktarını saniyelik okur. AI algoritması bu veriye göre pompanın ihtiyaç duyduğu en düşük basıncı anlık belirler.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  Şebeke Kalitesi: <span className="font-bold text-slate-900">{telemetry.inletTds} ppm</span>
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'pureWater' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Site İçme Suyu Dağıtım Kolonu
                    <span className="text-xs font-normal text-slate-500">· UV Sterilizatörlü Güvenli Hat</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Arıtılan 18 ppm saflıktaki içme suyu, site dikey şaftındaki paslanmaz gıda normlu borularla her dairenin mutfağına doğrudan ulaşır. Daire sakinleri damacana veya tezgâh altı filtre maliyetinden tamamen kurtulur.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  Kalite: <span className="font-bold text-emerald-700">{telemetry.pureTds} ppm (TS266)</span>
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'filter' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Ön Filtrasyon Aşaması (5 Mikron Sediment + Blok Karbon)
                    <span className="text-xs font-normal text-slate-500">· Membran Koruma Ağı</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Şebekeden gelen kum, pas, tortu ve kloru tutarak yüksek verimli RO membranının tıkanmasını ve klor aşınmasını önler.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
                  ΔP Basınç Farkı: <span className="font-bold text-slate-900">0.2 bar (Normal)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
