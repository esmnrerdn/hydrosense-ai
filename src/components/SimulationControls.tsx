import React from 'react';
import { TelemetryData } from '../types';
import { Sliders, Cpu, Play, Pause, RotateCcw, FastForward, Droplet, Trees } from 'lucide-react';

interface SimulationControlsProps {
  telemetry: TelemetryData;
  setInletTds: (tds: number) => void;
  setAiDynamicMode: (mode: boolean) => void;
  setBuildingDemandLph: (lph: number) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  onTriggerFlush: () => void;
  onTriggerIrrigation: () => void;
  onResetSimulation: () => void;
}

const TDS_PRESETS = [
  { label: 'Temiz', value: 190 },
  { label: 'Normal', value: 340 },
  { label: 'Kireçli', value: 530 },
];

const DEMAND_PRESETS = [
  { label: 'Sabah piki', value: 85 },
  { label: 'Öğle', value: 25 },
  { label: 'Akşam piki', value: 95 },
];

const presetClass = (active: boolean) =>
  `py-2 px-2 rounded-lg border text-center transition-all ${
    active
      ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
  }`;

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  telemetry,
  setInletTds,
  setAiDynamicMode,
  setBuildingDemandLph,
  isSimulating,
  setIsSimulating,
  simSpeed,
  setSimSpeed,
  onTriggerFlush,
  onTriggerIrrigation,
  onResetSimulation,
}) => {
  const ai = telemetry.aiDynamicMode;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      {/* Başlık ve oynatma kontrolleri */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-600" />
            Simülasyon Paneli
            <span className="ml-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
              Simülasyon verisi
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Su kalitesini ve tüketimi değiştirip sistemin tepkisini izleyin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
              isSimulating
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Başlat</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSimSpeed(simSpeed === 1 ? 3 : 1)}
            className={`px-3 py-2 text-sm font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
              simSpeed === 3
                ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Simülasyon hızını değiştir"
          >
            <FastForward className="w-4 h-4" />
            <span>{simSpeed}x</span>
          </button>

          <button
            onClick={onResetSimulation}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Sıfırla"
            aria-label="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* 1. Şebeke suyu kirliliği */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="tds-slider" className="text-sm font-semibold text-slate-800">
              1. Şebeke suyu kirliliği
            </label>
            <span className="text-sm font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
              {telemetry.inletTds} ppm
            </span>
          </div>

          <input
            id="tds-slider"
            type="range"
            min="120"
            max="800"
            step="10"
            value={telemetry.inletTds}
            onChange={(e) => setInletTds(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Temiz</span>
            <span>Ağır</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            {TDS_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setInletTds(p.value)}
                className={presetClass(telemetry.inletTds === p.value)}
              >
                <div>{p.label}</div>
                <div className="text-xs font-mono text-slate-500">{p.value} ppm</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Yapay zekâ basınç kontrolü */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-800 block">
            2. Yapay zekâ basınç kontrolü
          </label>

          <button
            type="button"
            role="switch"
            aria-checked={ai}
            onClick={() => setAiDynamicMode(!ai)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              ai
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ai ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {ai ? 'Yapay zekâ açık' : 'Klasik sistem'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {ai ? 'Basınç suya göre ayarlanıyor' : 'Basınç sabit'}
                  </div>
                </div>
              </div>

              {/* Anahtar görünümü */}
              <span
                aria-hidden="true"
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                  ai ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    ai ? 'left-5' : 'left-0.5'
                  }`}
                />
              </span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Pompa basıncı</div>
              <div className="text-lg font-mono font-bold text-slate-900">
                {telemetry.pumpPressure} <span className="text-sm font-normal text-slate-500">bar</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Geri kazanım</div>
              <div className="text-lg font-mono font-bold text-sky-700">%{telemetry.recoveryRate}</div>
            </div>
          </div>
        </div>

        {/* 3. Site tüketimi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800">3. Site tüketimi</label>
            <span className="text-sm font-mono font-bold text-slate-900">
              {telemetry.pureFlowRate} L/saat
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            {DEMAND_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setBuildingDemandLph(p.value)}
                className={presetClass(telemetry.pureFlowRate === p.value)}
              >
                <div>{p.label}</div>
                <div className="text-xs font-mono text-slate-500">{p.value} L/s</div>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="text-sm font-semibold text-slate-800 block">Olay tetikle</span>
            <div className="flex gap-2">
              <button
                onClick={onTriggerFlush}
                title="Tuvalet sifonu: yaklaşık 100 L"
                className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors"
              >
                <Droplet className="w-4 h-4 text-sky-600" />
                <span>Sifon çek</span>
              </button>
              <button
                onClick={onTriggerIrrigation}
                title="Bahçe sulama: yaklaşık 300 L"
                className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors"
              >
                <Trees className="w-4 h-4 text-emerald-600" />
                <span>Bahçeyi sula</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};