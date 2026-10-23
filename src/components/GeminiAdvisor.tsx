import React, { useState } from 'react';
import { TelemetryData, AIDiagnosisResult, AIBulletinResult } from '../types';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  Wrench, 
  Waves, 
  Cpu, 
  Lightbulb
} from 'lucide-react';

interface GeminiAdvisorProps {
  telemetry: TelemetryData;
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ telemetry }) => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'bulletin'>('diagnosis');
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [loadingBulletin, setLoadingBulletin] = useState(false);
  const [copied, setCopied] = useState(false);

  const [diagnosis, setDiagnosis] = useState<AIDiagnosisResult | null>(null);
  const [bulletin, setBulletin] = useState<AIBulletinResult | null>(null);

  // Fetch real-time AI diagnosis
  const handleFetchDiagnosis = async () => {
    setLoadingDiagnosis(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inletTds: telemetry.inletTds,
          pureTds: telemetry.pureTds,
          pumpPressure: telemetry.pumpPressure,
          aiOptimized: telemetry.aiDynamicMode,
          pureFlowRate: telemetry.pureFlowRate,
          rejectFlowRate: telemetry.rejectFlowRate,
          reservoirTankPct: Math.round((telemetry.reservoirTankLevel / telemetry.reservoirTankCapacity) * 100),
          landscapeTankPct: Math.round((telemetry.landscapeTankLevel / telemetry.landscapeTankCapacity) * 100),
          valveState: telemetry.smartValveState,
          buildingLoadName: telemetry.buildingLoadName,
          apartmentCount: 20
        })
      });

      const data = await res.json();
      if (data.success && data.diagnosis) {
        setDiagnosis(data.diagnosis);
      }
    } catch (err) {
      console.error('Diagnosis fetch failed:', err);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  // Fetch resident bulletin
  const handleFetchBulletin = async () => {
    setLoadingBulletin(true);
    try {
      const res = await fetch('/api/bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlySavedWaterLiters: 72400,
          monthlyElectricitySavedKwh: 73,
          monthlyCostSavedTl: 3850,
          perApartmentSavedTl: 265,
          divertedToFlushesLiters: 36000,
          divertedToIrrigationLiters: 36400,
          apartmentCount: 20
        })
      });

      const data = await res.json();
      if (data.success && data.bulletin) {
        setBulletin(data.bulletin);
      }
    } catch (err) {
      console.error('Bulletin fetch failed:', err);
    } finally {
      setLoadingBulletin(false);
    }
  };

  const handleCopyBulletin = () => {
    if (!bulletin) return;
    const textToCopy = `${bulletin.headline}\n\n${bulletin.body}\n\nÖnemli Kazanımlar:\n${bulletin.highlightMetrics.map(m => `• ${m.label}: ${m.value}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Gemini 3.8 Flash Yapay Zekâ Mühendislik ve ESG Asistanı
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                SCADA telemetrisini anlık yorumlar, membran kirlenmesini öngörür ve 20 dairelik sakin bültenleri üretir
              </p>
            </div>
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
                activeTab === 'diagnosis'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mühendislik Teşhisi
            </button>
            <button
              onClick={() => setActiveTab('bulletin')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
                activeTab === 'bulletin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sakin Bilgilendirme Bülteni
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Engineering Diagnosis */}
      {activeTab === 'diagnosis' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Anlık Sistem Telemetrisi Teşhisi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mevcut giriş TDS: <span className="font-mono font-bold text-slate-800">{telemetry.inletTds} ppm</span> · Pompa: <span className="font-mono font-bold text-slate-800">{telemetry.pumpPressure} bar</span> · Mod: <span className="font-bold text-sky-700">{telemetry.aiDynamicMode ? 'AI Dinamik' : 'Sabit'}</span>
                </p>
              </div>

              <button
                onClick={handleFetchDiagnosis}
                disabled={loadingDiagnosis}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDiagnosis ? 'animate-spin' : ''}`} />
                <span>{loadingDiagnosis ? 'Yapay Zekâ İnceliyor...' : 'Telemetriyi Analiz Et'}</span>
              </button>
            </div>

            {diagnosis ? (
              <div className="mt-6 space-y-6">
                
                {/* Summary Banner */}
                <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">Durum Değerlendirmesi</div>
                    <p className="text-sm text-slate-800 mt-1 font-medium leading-relaxed">
                      {diagnosis.statusSummary}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Item 1: Membrane Health */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Waves className="w-4 h-4 text-cyan-600" />
                      Membran Sağlığı & Kirlenme
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {diagnosis.membraneHealth}
                    </p>
                  </div>

                  {/* Item 2: Energy & Pressure */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      VFD Basınç & Enerji
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {diagnosis.energySavingsComment}
                    </p>
                  </div>

                  {/* Item 3: Water Recovery */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Atık Su Yönlendirmesi
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {diagnosis.waterRecoveryComment}
                    </p>
                  </div>

                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Mühendislik Eylem Planı & Tavsiyeler
                  </div>
                  <ul className="space-y-2">
                    {diagnosis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {i + 1}
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="mt-8 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Bot className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  Yukarıdaki "Telemetriyi Analiz Et" butonuna tıklayarak anlık TDS ve pompa durumunu Gemini ile değerlendirin.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Yapay zekâ osmotik basınç dengesini, ters yıkama zamanını ve valf optimizasyonunu hesaplar.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Resident Bulletin */}
      {activeTab === 'bulletin' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  20 Dairelik Sakin Bilgilendirme Bülteni Oluşturucu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Site WhatsApp grubu, bina panosu veya aidat makbuzları için şeffaf tasarruf bülteni
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFetchBulletin}
                  disabled={loadingBulletin}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${loadingBulletin ? 'animate-spin' : ''}`} />
                  <span>{loadingBulletin ? 'Bülten Hazırlanıyor...' : 'Yeni Bülten Üret'}</span>
                </button>
              </div>
            </div>

            {bulletin ? (
              <div className="mt-6 space-y-6">
                
                <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {bulletin.headline}
                    </h4>

                    <button
                      onClick={handleCopyBulletin}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Kopyalandı' : 'Metni Kopyala'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
                    {bulletin.highlightMetrics.map((m, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">{m.label}</span>
                        <span className="text-lg font-bold font-mono text-emerald-800 block mt-0.5">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/80 p-4 rounded-lg border border-slate-200/80">
                    {bulletin.body}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Yayınlayan: HydroSense AI Bina Yönetim Sistemi</span>
                    <span>Tüm 20 Daire İle Paylaşıma Uygundur</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="mt-8 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  "Yeni Bülten Üret" butonuna tıklayarak bu ayın su tasarruf rakamlarını içeren profesyonel bir metin oluşturun.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bina sakinlerinin çevre katkılarını ve aidat indirimlerini görerek sürece sahip çıkmalarını sağlar.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
