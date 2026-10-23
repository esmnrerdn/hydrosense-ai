import React from 'react';
import { TelemetryData } from '../types';
import { Activity, Gauge, Zap, Waves, Cpu, CheckCircle2 } from 'lucide-react';

interface TelemetryBarProps {
  telemetry: TelemetryData;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ telemetry }) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Giriş TDS */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              Giriş Şebeke TDS
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {telemetry.inletTds}
              </span>
              <span className="text-xs text-slate-500 font-sans">ppm</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              {telemetry.inletTds < 300 ? 'Temiz Şebeke' : telemetry.inletTds < 550 ? 'Orta Sertlik' : 'Yüksek Kireç'}
            </span>
          </div>

          {/* Çıkış Saf Su TDS */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Site İçme Suyu
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono tabular-nums text-emerald-700">
                {telemetry.pureTds}
              </span>
              <span className="text-xs text-emerald-600 font-sans">ppm</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              TS266 İpeksi Yumuşaklık
            </span>
          </div>

          {/* Pompa Basıncı & VFD */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-sky-600" />
              AI Pompa Basıncı
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {telemetry.pumpPressure}
              </span>
              <span className="text-xs text-slate-500 font-sans">bar</span>
              <span className="text-xs font-mono text-slate-400 ml-1">
                ({telemetry.pumpFrequencyHz} Hz)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              {telemetry.aiDynamicMode ? 'VFD Dinamik Regülasyon' : 'Sabit 6.5 bar Modu'}
            </span>
          </div>

          {/* Motor Gücü */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Merkezi Motor Gücü
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {telemetry.motorPowerWatts}
              </span>
              <span className="text-xs text-slate-500 font-sans">Watt</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {telemetry.aiDynamicMode ? '%38 Güç Tasarrufu' : 'Sabit Güç Tüketimi'}
            </span>
          </div>

          {/* Geri Kazanım Verimi */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-sky-600" />
              Geri Kazanım Oranı
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono tabular-nums text-sky-700">
                %{telemetry.recoveryRate}
              </span>
              <span className="text-xs text-slate-400 line-through ml-1 font-mono">
                %20
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Gelenekselin 3 katı verim
            </span>
          </div>

          {/* Akıllı Valf & Kanalizasyon Durumu */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Akıllı Valf Hedefi
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-sm font-semibold text-slate-900">
                {telemetry.smartValveState === 'reservoir' && 'Site Klozet Deposu'}
                {telemetry.smartValveState === 'landscape' && 'Site Bahçe & Peyzaj Deposu'}
                {telemetry.smartValveState === 'drain' && 'Emniyet Tahliyesi'}
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Kanalizasyon İsrafı: 0 L/saat
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
