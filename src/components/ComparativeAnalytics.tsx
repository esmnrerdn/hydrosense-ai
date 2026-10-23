import React, { useState } from 'react';
import { ApartmentData, ComparativeStats, BlockId } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Coins, 
  Leaf, 
  Building, 
  Check, 
  X,
  ArrowRight,
  BookOpen,
  Scale
} from 'lucide-react';

interface ComparativeAnalyticsProps {
  stats: ComparativeStats;
  apartments: ApartmentData[];
}

export const ComparativeAnalytics: React.FC<ComparativeAnalyticsProps> = ({
  stats,
  apartments
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockId | 'all'>('all');

  const filteredApartments = selectedBlock === 'all' 
    ? apartments 
    : apartments.filter(a => a.block === selectedBlock);

  const monthlyWaterSavedTons = ((stats.traditionalWastedLitersPerDay * 30) / 1000).toFixed(0);

  return (
    <div className="space-y-6">
      
      {/* Overview Banner - TASARRUF KUTUSU SAĞA ALINDI */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100">
                Akıllı Site Su Yönetimi Kıyaslaması (4 Blok · 80 Daire)
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Siemens Smart Infrastructure & YGA
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-3">
              80 Bağımsız Tezgâh Altı Arıtma vs. Merkezi HydroSense AI
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Bireysel sistemlerin aylık <strong>270 Ton</strong> su israfına ve yüksek enerji tüketimine karşılık; merkezi <strong>HydroSense AI</strong> atık suyu peyzaj ve klozet hatlarına geri kazandırarak sıfır israf hedefler.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 shrink-0 min-w-[280px]">
            <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-800">Yıllık Site Net Tasarrufu</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-900 leading-tight">
                {stats.annualSavingsTl.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                80 dairenin ortak bütçesine dev katkı
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (4 Core Metrics) - ALT METİNLER TEMİZLENDİ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              Aylık Kurtarılan Atık Su
            </span>
            <span className="text-emerald-700 font-bold">%100 Geri Kazanım</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {monthlyWaterSavedTons}
            </span>
            <span className="text-sm font-semibold text-slate-600">Ton / Ay</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Siemens VFD Enerji
            </span>
            <span className="text-emerald-700 font-bold">%42 Daha Az Enerji</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stats.traditionalKwhPerMonth - stats.aiKwhPerMonth}
            </span>
            <span className="text-sm font-semibold text-slate-600">kWh / Ay</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Aylık Site İndirimi
            </span>
            <span className="text-emerald-700 font-bold">Ortak Bütçe</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
              {stats.monthlySavingsTl.toLocaleString('tr-TR')}
            </span>
            <span className="text-sm font-semibold text-emerald-800">₺ / Ay</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-green-600" />
              CO2 Emisyon Önleme
            </span>
            <span className="text-green-700 font-bold">LEED / ESG</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stats.co2SavedKgPerMonth}
            </span>
            <span className="text-sm font-semibold text-slate-600">kg CO2 / Ay</span>
          </div>
        </div>

      </div>

      {/* Side-by-Side Architectural Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900">
            80 Dairelik Konut Sitesi Kapsamlı Karşılaştırma Matrisi
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bireysel tezgâh altı arıtmalar ile Siemens destekli merkezi SCADA mimarisinin teknik kıyaslaması
          </p>
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
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  Geri Kazanım Verimliliği
                </td>
                <td className="py-3.5 px-6 font-mono text-slate-600">
                  Sabit %20 (1 L temiz suya 4 L atık)
                </td>
                <td className="py-3.5 px-6 font-mono font-bold text-sky-700 bg-sky-50/30">
                  Dinamik %55 - %65
                </td>
                <td className="py-3.5 px-6 font-semibold text-emerald-700">
                  3 Kat Daha Verimli
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  Kanalizasyona Atılan Su
                </td>
                <td className="py-3.5 px-6 font-mono text-rose-600 font-bold">
                  8.960 L / Gün (270 Ton / Ay)
                </td>
                <td className="py-3.5 px-6 font-mono font-bold text-emerald-700 bg-sky-50/30">
                  0 L / Gün (Sıfır İsraf)
                </td>
                <td className="py-3.5 px-6 font-semibold text-emerald-700">
                  Yılda 3.240 Ton Su Kurtarımı
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  Atık Su Kullanım Hedefi
                </td>
                <td className="py-3.5 px-6 text-slate-600">
                  Doğrudan kanalizasyona deşarj
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-900 bg-sky-50/30">
                  4 Blok Klozet Rezervuarları + Site Peyzajı
                </td>
                <td className="py-3.5 px-6 font-semibold text-emerald-700">
                  Bahçe sulama ve sifon suyu bedavaya gelir
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  Pompa ve Basınç Kontrolü
                </td>
                <td className="py-3.5 px-6 text-slate-600">
                  80 adet kontrolsüz küçük motor (Sabit 6.5 bar)
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-900 bg-sky-50/30">
                  Siemens Sinamics VFD Pompa İstasyonu
                </td>
                <td className="py-3.5 px-6 font-semibold text-emerald-700">
                  %42 Net Enerji Tasarrufu
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  Yasal Depo & Hijyen Takibi
                </td>
                <td className="py-3.5 px-6 text-slate-600">
                  Manuel, yılda bir unutulan bakım
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-900 bg-sky-50/30">
                  Sağlık Bak. 2007/67 Uyumlu 7/24 Dijital İzleme
                </td>
                <td className="py-3.5 px-6 font-semibold text-emerald-700">
                  Yönetime Ceza Riskini Sıfırlar
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  İçme Suyu Güvenliği & İzleme
                </td>
                <td className="py-3.5 px-6 text-slate-600">
                  Sensörsüz, filtre ömrü bilinmeyen kör kullanım
                </td>
                <td className="py-3.5 px-6 font-medium text-slate-900 bg-sky-50/30">
                  Siemens Sitrans TDS probu + UV dezenfeksiyon
                </td>
                <td className="py-3.5 px-6 font-semibold text-emerald-700">
                  TS266 Sağlık Bakanlığı Standart Garantisi
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Blok 80 Dairelik Tüketim Tablosu */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Site Daire Tüketim ve Aidat İndirim Listesi (80 Daire)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              4 bloğun daire bazlı saf içme suyu, sifon gri su katkısı ve aidat indirimi
            </p>
          </div>

          {/* Block Filter Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedBlock('all')}
              className={`px-3 py-1 font-semibold rounded-md transition-all ${
                selectedBlock === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tüm Bloklar (80 Daire)
            </button>
            <button
              onClick={() => setSelectedBlock('A')}
              className={`px-3 py-1 font-semibold rounded-md transition-all ${
                selectedBlock === 'A' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A Blok (20 Daire)
            </button>
            <button
              onClick={() => setSelectedBlock('B')}
              className={`px-3 py-1 font-semibold rounded-md transition-all ${
                selectedBlock === 'B' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              B Blok (20 Daire)
            </button>
            <button
              onClick={() => setSelectedBlock('C')}
              className={`px-3 py-1 font-semibold rounded-md transition-all ${
                selectedBlock === 'C' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              C Blok (20 Daire)
            </button>
            <button
              onClick={() => setSelectedBlock('D')}
              className={`px-3 py-1 font-semibold rounded-md transition-all ${
                selectedBlock === 'D' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              D Blok (20 Daire)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Blok & Daire</th>
                <th className="py-2.5 px-4">Kat</th>
                <th className="py-2.5 px-4">Sakin</th>
                <th className="py-2.5 px-4">İçme Suyu (L/Ay)</th>
                <th className="py-2.5 px-4">Kurtarılan Gri Su (L/Ay)</th>
                <th className="py-2.5 px-4">Su Kalitesi</th>
                <th className="py-2.5 px-4 text-right">Aidat İndirimi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApartments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-4 font-bold text-slate-900 font-mono">
                    {apt.number}
                  </td>
                  <td className="py-2 px-4 text-slate-600">
                    {apt.floor}. Kat
                  </td>
                  <td className="py-2 px-4 text-slate-600">
                    {apt.residentCount} Kişi
                  </td>
                  <td className="py-2 px-4 font-mono tabular-nums text-slate-800">
                    {apt.monthlyDrinkingWaterLiters} L
                  </td>
                  <td className="py-2 px-4 font-mono tabular-nums text-sky-700 font-medium">
                    {apt.monthlyFlushGreywaterLiters} L
                  </td>
                  <td className="py-2 px-4">
                    <span className="font-mono tabular-nums text-emerald-700 font-bold">
                      {apt.waterQualityPpm} ppm
                    </span>
                    <span className="text-[11px] text-slate-500 ml-1">· TS266</span>
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                    +{apt.monthlyAidatDiscountTl} ₺
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};