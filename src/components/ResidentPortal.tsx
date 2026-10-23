import React, { useState } from 'react';
import { ApartmentData, TelemetryData, BlockId } from '../types';
import { 
  Building, 
  Droplet, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  Waves, 
  Users,
  ChevronDown,
  TreePine,
  Sprout
} from 'lucide-react';

interface ResidentPortalProps {
  apartments: ApartmentData[];
  selectedApartmentId: number;
  setSelectedApartmentId: (id: number) => void;
  telemetry: TelemetryData;
  userRole?: 'management' | 'resident';
}

export const ResidentPortal: React.FC<ResidentPortalProps> = ({
  apartments,
  selectedApartmentId,
  setSelectedApartmentId,
  telemetry,
  userRole = 'resident'
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockId | 'all'>('all');
  const [showCertificate, setShowCertificate] = useState(false);

  const currentApt = apartments.find(a => a.id === selectedApartmentId) || apartments[0];
  const damacanaCount = (currentApt.monthlyDrinkingWaterLiters / 19).toFixed(1);
  const damacanaSavedMoney = Math.round(Number(damacanaCount) * 115);
  const totalMoneyBenefit = damacanaSavedMoney + currentApt.monthlyAidatDiscountTl;

  const selectableApartments = selectedBlock === 'all'
    ? apartments
    : apartments.filter(a => a.block === selectedBlock);

  // Oyunlaştırma (Dijital Orman) Hesaplamaları
  const totalSavedLiters = currentApt.monthlyFlushGreywaterLiters * 4.5;
  const LITER_PER_TREE = 2000;
  const completedTrees = Math.floor(totalSavedLiters / LITER_PER_TREE);
  const currentTreeProgress = ((totalSavedLiters % LITER_PER_TREE) / LITER_PER_TREE) * 100;

  return (
    <div className="space-y-6">
      
      {/* 1. SADECE DAİRE SAKİNİNİ ÖZEL GÖRÜNÜM */}
      {userRole === 'resident' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* ÇERÇEVESİZ / KUTUSUZ DİJİTAL ORMAN (EN ÜSTTE) */}
          <div className="relative py-4 px-2 flex flex-col md:flex-row items-center justify-between gap-8 z-0">
            <div className="flex-1 z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Kişisel Çevresel Etkiniz
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                Dijital Ormanınız
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-md">
                Sisteme katıldığınızden beri <strong className="text-emerald-700 font-mono text-base">{totalSavedLiters.toLocaleString('tr-TR')} Litre</strong> su kurtardınız. Bu miktar doğada {completedTrees} yetişkin ağacın su ihtiyacını karşılıyor.
              </p>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center z-10">
              <div className="flex items-end gap-6 mb-4 justify-center md:justify-start border-b border-emerald-100 pb-2">
                {/* Tamamlanmış Ağaçlar */}
                {Array.from({ length: completedTrees }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center animate-in zoom-in duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                    <TreePine className="w-10 h-10 text-emerald-600 mb-1 drop-shadow-md" />
                    <span className="text-[9px] font-bold text-emerald-800 tracking-widest uppercase">Yetişkin</span>
                  </div>
                ))}

                {/* Büyüyen Fidan */}
                <div className="flex flex-col items-center animate-in zoom-in duration-500 delay-500 opacity-90 relative">
                  <div className="absolute -top-1 -right-1">
                     <span className="flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                  </div>
                  <Sprout className="w-9 h-9 text-emerald-400 mb-1 drop-shadow-sm" />
                  <span className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase">Fidan</span>
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  <span>{Math.floor(completedTrees + 1)}. Ağacın Büyüme Seviyesi</span>
                  <span className="text-emerald-600">%{Math.round(currentTreeProgress)}</span>
                </div>
                <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${currentTreeProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Apartment Selector Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Site Sakini Su & Tasarruf Portalı
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Aktif Abone
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                    {currentApt.number} · {currentApt.floor}. Kat ({currentApt.residentCount} Kişilik Hane)
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setSelectedBlock('all')}
                    className={`px-2.5 py-1 font-semibold rounded-md transition-all ${
                      selectedBlock === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tümü
                  </button>
                  {(['A', 'B', 'C', 'D'] as BlockId[]).map((blk) => (
                    <button
                      key={blk}
                      onClick={() => {
                        setSelectedBlock(blk);
                        const firstInBlock = apartments.find(a => a.block === blk);
                        if (firstInBlock) setSelectedApartmentId(firstInBlock.id);
                      }}
                      className={`px-2.5 py-1 font-semibold rounded-md transition-all ${
                        selectedBlock === blk 
                          ? 'bg-white text-sky-700 shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {blk} Blok
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <select
                    value={selectedApartmentId}
                    onChange={(e) => setSelectedApartmentId(Number(e.target.value))}
                    className="appearance-none bg-slate-50 border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    {selectableApartments.map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {apt.number} ({apt.floor}. Kat · {apt.residentCount} Kişi)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-sky-600" />
                  Mutfak İçme Suyu
                </span>
                <span className="text-sky-700 font-bold font-mono">{currentApt.waterQualityPpm} ppm</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{currentApt.monthlyDrinkingWaterLiters}</span>
                <span className="text-sm font-semibold text-slate-600">Litre / Ay</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <span className="font-semibold text-slate-700 font-mono">~{damacanaCount} adet</span> damacanaya eşdeğer saf su aktı.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-indigo-600" />
                  Sifonda Kurtarılan Su
                </span>
                <span className="text-emerald-700 font-bold">%100 Geri Dönüşüm</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tabular-nums text-indigo-700">{currentApt.monthlyFlushGreywaterLiters}</span>
                <span className="text-sm font-semibold text-slate-600">Litre / Ay</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Klozetinizde şebeke suyu yerine arıtma suyu kullanıldı.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  Aidat İndirimi
                </span>
                <span className="text-emerald-700 font-bold">Faturadan Düşüldü</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">+{currentApt.monthlyAidatDiscountTl}</span>
                <span className="text-sm font-semibold text-emerald-800">₺ / Ay</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Ortak su ve elektrik tasarrufundan yansıyan pay.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs bg-gradient-to-br from-white to-emerald-50/40">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Toplam Aile Kazancı
                </span>
                <span className="text-emerald-800 font-bold">Damacana + Aidat</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{totalMoneyBenefit.toLocaleString('tr-TR')}</span>
                <span className="text-sm font-semibold text-slate-600">₺ / Ay</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-2">Dairenizin yılda ~{(totalMoneyBenefit * 12).toLocaleString('tr-TR')} ₺ cebinde kaldı.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{currentApt.number} Mutfak Musluğu Su Kalite Karnesi</h3>
                    <p className="text-xs text-slate-500">T.C. Sağlık Bakanlığı İnsani Tüketim Amaçlı Sular Hakkında Yönetmelik (TS 266)</p>
                  </div>
                </div>
                <button onClick={() => setShowCertificate(!showCertificate)} className="text-xs font-semibold text-sky-700 hover:text-sky-800 underline">
                  {showCertificate ? 'Özeti Göster' : 'Detaylı Analiz'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">TDS (Çözünmüş Katı)</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">{currentApt.waterQualityPpm} ppm</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">İdeal İpeksi Tat</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">pH Seviyesi</span>
                  <span className="text-lg font-bold font-mono text-slate-900">7.6 pH</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Doğal Alkali</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Klor & Koku</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">0.00 mg/L</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">%100 Tutuldu</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Bakteriyolojik Sterilite</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">0 CFU</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">UV Dezenfeksiyonlu</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-600" />
                  Sitenin 4 Blokluk Ortak Başarısı
                </h3>
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Site Klozet Rezervuar Deposu:</span>
                      <span className="font-mono font-bold text-slate-900">
                        %{Math.round((telemetry.reservoirTankLevel / telemetry.reservoirTankCapacity) * 100)} ({telemetry.reservoirTankLevel} / 8.000 L)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600 transition-all duration-500" style={{ width: `${(telemetry.reservoirTankLevel / telemetry.reservoirTankCapacity) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Site Peyzaj ve Park Sulama Deposu:</span>
                      <span className="font-mono font-bold text-slate-900">
                        %{Math.round((telemetry.landscapeTankLevel / telemetry.landscapeTankCapacity) * 100)} ({telemetry.landscapeTankLevel} / 15.000 L)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${(telemetry.landscapeTankLevel / telemetry.landscapeTankCapacity) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SADECE YÖNETİCİYE ÖZEL GÖRÜNÜM */}
      {userRole === 'management' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-sky-900">Yönetici Paneline Özel Görünüm</h4>
              <p className="text-xs text-sky-700 mt-0.5">
                Aşağıdaki kapsamlı yönetim matrisi ve 80 dairelik detaylı tüketim raporu sadece <strong>Site Yönetimi</strong> rolüyle giriş yaptığınız için gösterilmektedir.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">80 Dairelik Konut Sitesi Kapsamlı Karşılaştırma Matrisi</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-6">Karşılaştırma Parametresi</th>
                    <th className="py-3 px-6 text-slate-700">80 Dairede Bireysel Tezgâh Altı</th>
                    <th className="py-3 px-6 text-sky-800 bg-sky-50/40">Merkezi HydroSense AI (Önerilen)</th>
                    <th className="py-3 px-6 text-emerald-800">Net Site Avantajı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">Geri Kazanım Verimliliği</td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">Sabit %20 (1 L temiz suya 4 L atık)</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-sky-700 bg-sky-50/30">Dinamik %55 - %65</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700">3 Kat Daha Verimli</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">Kanalizasyona Atılan Su</td>
                    <td className="py-3.5 px-6 font-mono text-rose-600 font-bold">8.960 L / Gün (270 Ton / Ay)</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-700 bg-sky-50/30">0 L / Gün (Sıfır İsraf)</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700">Yılda 3.240 Ton Su Kurtarımı</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Site Daire Tüketim ve Aidat İndirim Listesi (80 Daire)</h3>
              </div>
              <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                <button onClick={() => setSelectedBlock('all')} className={`px-3 py-1.5 font-semibold rounded-md transition-all ${selectedBlock === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                  Tüm Bloklar
                </button>
                {(['A', 'B', 'C', 'D'] as BlockId[]).map((blk) => (
                  <button key={blk} onClick={() => setSelectedBlock(blk)} className={`px-3 py-1.5 font-semibold rounded-md transition-all ${selectedBlock === blk ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                    {blk} Blok
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider shadow-sm">
                  <tr>
                    <th className="py-3 px-4">Blok & Daire</th>
                    <th className="py-3 px-4">Kat</th>
                    <th className="py-3 px-4">Sakin</th>
                    <th className="py-3 px-4">İçme Suyu (L/Ay)</th>
                    <th className="py-3 px-4">Kurtarılan Gri Su (L/Ay)</th>
                    <th className="py-3 px-4">Su Kalitesi</th>
                    <th className="py-3 px-4 text-right">Aidat İndirimi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectableApartments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-slate-900 font-mono">{apt.number}</td>
                      <td className="py-2.5 px-4 text-slate-600">{apt.floor}. Kat</td>
                      <td className="py-2.5 px-4 text-slate-600">{apt.residentCount} Kişi</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-slate-800">{apt.monthlyDrinkingWaterLiters} L</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-sky-700 font-medium">{apt.monthlyFlushGreywaterLiters} L</td>
                      <td className="py-2.5 px-4">
                        <span className="font-mono tabular-nums text-emerald-700 font-bold">{apt.waterQualityPpm} ppm</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">+{apt.monthlyAidatDiscountTl} ₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};