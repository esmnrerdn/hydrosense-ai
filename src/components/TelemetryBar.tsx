import React, { useEffect, useRef, useState } from 'react';
import { TelemetryData } from '../types';
import {
  Activity,
  Gauge,
  Zap,
  Waves,
  Cpu,
  CheckCircle2,
  Terminal,
  Wrench,
  Calendar,
} from 'lucide-react';

interface TelemetryBarProps {
  telemetry: TelemetryData;
}

/* ------------------------------------------------------------------ */
/*  1) AI Otomatik Optimizasyon Günlüğü                                */
/* ------------------------------------------------------------------ */

interface LogLine {
  id: number;
  time: string;
  level: 'INFO' | 'OPT' | 'ROUTE' | 'OK';
  text: string;
}

const levelColor: Record<LogLine['level'], string> = {
  INFO: 'text-sky-700',
  OPT: 'text-amber-700',
  ROUTE: 'text-fuchsia-700',
  OK: 'text-emerald-700',
};

const MAX_LINES = 40;

const nowStr = () => new Date().toLocaleTimeString('tr-TR', { hour12: false });

export const AiLogTerminal: React.FC<{ telemetry: TelemetryData }> = ({ telemetry }) => {
  const [lines, setLines] = useState<LogLine[]>([]);
  const idRef = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef(telemetry);
  const stepRef = useRef(0);
  const prevValve = useRef(telemetry.smartValveState);

  useEffect(() => {
    telemetryRef.current = telemetry;
  }, [telemetry]);

  const push = (level: LogLine['level'], text: string) => {
    idRef.current += 1;
    const line: LogLine = { id: idRef.current, time: nowStr(), level, text };
    setLines((prev) => [...prev, line].slice(-MAX_LINES));
  };

  useEffect(() => {
    push('INFO', 'AI motoru başlatıldı. Sensör akışı dinleniyor...');

    const timer = setInterval(() => {
      const t = telemetryRef.current;
      const step = stepRef.current++ % 5;

      switch (step) {
        case 0:
          push(
            'OPT',
            t.aiDynamicMode
              ? `VFD pompa basıncı ${t.pumpPressure} bara ayarlandı (${t.pumpFrequencyHz} Hz) - %38 enerji tasarrufu.`
              : `Sabit mod aktif: ${t.pumpPressure} bar, dinamik regülasyon devre dışı.`
          );
          break;
        case 1:
          push(
            'INFO',
            `Giriş şebeke TDS ${t.inletTds} ppm algılandı. ${
              t.inletTds < 300 ? 'Temiz şebeke' : t.inletTds < 550 ? 'Orta sertlik' : 'Yüksek kireç'
            } profili uygulanıyor.`
          );
          break;
        case 2:
          push(
            'ROUTE',
            `Konsantre valfi → ${
              t.smartValveState === 'reservoir'
                ? 'site klozet deposu'
                : t.smartValveState === 'landscape'
                ? 'bahçe & peyzaj deposu'
                : 'emniyet tahliyesi'
            } yönlendirildi.`
          );
          break;
        case 3:
          push('OK', `Çıkış TDS ${t.pureTds} ppm - içme suyu standardı sağlandı.`);
          break;
        case 4:
          push(
            'OPT',
            `Geri kazanım oranı %${t.recoveryRate}, motor gücü ${t.motorPowerWatts} W. Parametreler optimum.`
          );
          break;
      }
    }, 3500);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevValve.current !== telemetry.smartValveState) {
      push('ROUTE', `Akıllı valf durumu değişti: ${prevValve.current} → ${telemetry.smartValveState}`);
      prevValve.current = telemetry.smartValveState;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telemetry.smartValveState]);

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

   return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <Terminal className="w-3.5 h-3.5 text-slate-500 ml-2" />
        <span className="text-xs font-mono text-slate-600">AI Otomatik Optimizasyon Günlüğü</span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] font-mono text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          CANLI
        </span>
      </div>

      <div ref={boxRef} className="h-56 overflow-y-auto p-4 font-mono text-xs leading-relaxed bg-slate-50/60">
        {lines.map((l) => (
          <div key={l.id} className="flex gap-2">
            <span className="text-slate-400 shrink-0">[{l.time}]</span>
            <span className={`${levelColor[l.level]} font-semibold shrink-0 w-12`}>{l.level}</span>
            <span className="text-slate-700">{l.text}</span>
          </div>
        ))}
        <div className="text-emerald-600 animate-pulse">▌</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  2) Gelecek Bakım Tahmini (Predictive Maintenance)                  */
/* ------------------------------------------------------------------ */

const TOTAL_LIFE_DAYS = 180;

const barColor = (pct: number) =>
  pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-500';

export const PredictiveMaintenanceCard: React.FC<{ telemetry: TelemetryData }> = ({ telemetry }) => {
  const mainDays = Math.max(
    5,
    Math.min(TOTAL_LIFE_DAYS, Math.round(142 - (telemetry.inletTds - 300) * 0.1))
  );
  const mainPct = Math.round((mainDays / TOTAL_LIFE_DAYS) * 100);

  const items = [
    { name: 'Ana Membran Kirlilik Ömrü', days: mainDays, pct: mainPct },
    { name: 'Ön Filtre (Sediment)', days: 47, pct: Math.round((47 / 90) * 100) },
    { name: 'Karbon Filtre', days: 96, pct: Math.round((96 / 180) * 100) },
  ];

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Gelecek Bakım Tahmini (Predictive Maintenance)
        </h3>
        <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          AI tahmini
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((it) => (
          <div key={it.name}>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-slate-600">{it.name}</span>
              <span className="text-xs font-mono text-slate-500">%{it.pct}</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor(it.pct)} transition-all duration-700`}
                style={{ width: `${it.pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-sm font-bold font-mono tabular-nums text-slate-900">
              {it.days}{' '}
              <span className="text-xs font-sans font-normal text-slate-500">gün kaldı</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Ana bileşen: orijinal telemetri çubuğu (değişmedi)                 */
/* ------------------------------------------------------------------ */

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
              {telemetry.inletTds < 300
                ? 'Temiz Şebeke'
                : telemetry.inletTds < 550
                ? 'Orta Sertlik'
                : 'Yüksek Kireç'}
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
            <span className="text-[11px] text-slate-500 mt-0.5">TS266 İpeksi Yumuşaklık</span>
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
              <span className="text-xs text-slate-400 line-through ml-1 font-mono">%20</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">Gelenekselin 3 katı verim</span>
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