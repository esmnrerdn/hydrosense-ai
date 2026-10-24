import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { TelemetryBar } from './components/TelemetryBar';
import { HydraulicSchematic } from './components/HydraulicSchematic';
import { SimulationControls } from './components/SimulationControls';
import { ComparativeAnalytics } from './components/ComparativeAnalytics';
import { ResidentPortal } from './components/ResidentPortal';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { calculateTelemetry, generateInitialApartments, calculateComparativeStats } from './utils/hydraulicEngine';
import { TelemetryData } from './types';
import { 
  Building, 
  UserCheck, 
  Droplet,
  Info 
} from 'lucide-react';

const FLUSH_LITERS = 100;
const IRRIGATION_LITERS = 300;

export default function App() {
  // Uygulama Başlangıç Durumu (Karşılama Ekranı İçin)
  const [isAppStarted, setIsAppStarted] = useState<boolean>(false);

  // Navigation state
  const [currentTab, setCurrentTab] = useState<'schematic' | 'simulator' | 'comparison' | 'advisor' | 'residents'>('schematic');
  const [userRole, setUserRole] = useState<'management' | 'resident'>('management');
  const [selectedApartmentId, setSelectedApartmentId] = useState<number>(1);

  // Simulation parameters for residential site (4 Blocks · 80 Apartments)
  const [inletTds, setInletTds] = useState<number>(340);
  const [aiDynamicMode, setAiDynamicMode] = useState<boolean>(true);
  const [buildingDemandLph, setBuildingDemandLph] = useState<number>(320);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Site storage state (Liters)
  const [reservoirTankLevel, setReservoirTankLevel] = useState<number>(1280);
  const [landscapeTankLevel, setLandscapeTankLevel] = useState<number>(900);

  // Notification toast
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // 80 Apartments database (A, B, C, D Blocks)
  const apartments = useMemo(() => generateInitialApartments(), []);
  const comparativeStats = useMemo(() => calculateComparativeStats(apartments), [apartments]);

  // Real-time calculated telemetry
  const calculated = useMemo(() => {
    return calculateTelemetry(
      inletTds,
      aiDynamicMode,
      buildingDemandLph,
      reservoirTankLevel,
      landscapeTankLevel
    );
  }, [inletTds, aiDynamicMode, buildingDemandLph, reservoirTankLevel, landscapeTankLevel]);

  const telemetry: TelemetryData = calculated.telemetry;

  const reservoirCap = calculated.telemetry.reservoirTankCapacity;
  const landscapeCap = calculated.telemetry.landscapeTankCapacity;

  // Simulation tick loop
  useEffect(() => {
    if (!isSimulating || !isAppStarted) return; // Karşılama ekranındayken simülasyonu durdur

    const intervalMs = Math.max(200, 1000 / simSpeed);
    const timer = setInterval(() => {
      setReservoirTankLevel((prev) => {
        const naturalConsumption = Math.random() < 0.35 ? 18 : 0;
        const inflow = calculated.telemetry.smartValveState === 'reservoir' 
          ? calculated.telemetry.rejectFlowRate / 60 
          : 0;
        const next = prev - naturalConsumption + inflow;
        return Math.min(reservoirCap, Math.max(0, Math.round(next * 10) / 10));
      });

      setLandscapeTankLevel((prev) => {
        const naturalDrip = Math.random() < 0.25 ? 12 : 0;
        const inflow = calculated.telemetry.smartValveState === 'landscape' 
          ? calculated.telemetry.rejectFlowRate / 60 
          : 0;
        const next = prev - naturalDrip + inflow;
        return Math.min(landscapeCap, Math.max(0, Math.round(next * 10) / 10));
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed, calculated.telemetry.smartValveState, calculated.telemetry.rejectFlowRate, reservoirCap, landscapeCap, isAppStarted]);

  const handleTriggerFlush = useCallback(() => {
    setReservoirTankLevel((prev) => Math.max(0, prev - FLUSH_LITERS));
    const randomBlock = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    const randomFlat = Math.floor(Math.random() * 20) + 1;
    showNotification(`${randomBlock} Blok No:${randomFlat} ve komşu daireler sifon çekti (-${FLUSH_LITERS} L). Akıllı valf seviye açığını kapatmak için aktif.`);
  }, []);

  const handleTriggerIrrigation = useCallback(() => {
    setLandscapeTankLevel((prev) => Math.max(0, prev - IRRIGATION_LITERS));
    showNotification(`Sitenin ortak bahçe ve peyzaj damlama sulaması devreye girdi (-${IRRIGATION_LITERS} L peyzaj suyu kullanıldı).`);
  }, []);

  const handleResetSimulation = useCallback(() => {
    setInletTds(340);
    setAiDynamicMode(true);
    setBuildingDemandLph(320);
    setReservoirTankLevel(1280);
    setLandscapeTankLevel(900);
    setSimSpeed(1);
    setIsSimulating(true);
    showNotification('Simülasyon site standart başlangıç değerlerine sıfırlandı.');
  }, []);

  const selectedApartment = apartments.find(a => a.id === selectedApartmentId) || apartments[0];

  // ==========================================
  // 1. KARŞILAMA / ROL SEÇİM EKRANI (WELCOME SCREEN)
  // ==========================================
  if (!isAppStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-sky-100 selection:text-sky-900 font-sans">
        <div className="max-w-4xl w-full">
          
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-sky-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-sky-600/20 mb-6">
              <Droplet className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              HydroSense AI
            </h1>
            <p className="text-base md:text-lg text-slate-600 mt-4 font-medium max-w-2xl mx-auto">
              Akıllı bina ve şebeke suyu optimizasyonu. Siemens Climathon için geliştirilen yapay zekâ destekli döngüsel su yönetim platformu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            
            {/* SCADA Yönetim Girişi */}
            <button
              onClick={() => {
                setUserRole('management');
                setCurrentTab('schematic');
                setIsAppStarted(true);
              }}
              className="group flex flex-col items-center text-center p-10 bg-white rounded-3xl border-2 border-transparent shadow-sm hover:border-sky-500 hover:shadow-xl hover:shadow-sky-100 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-300 mb-6">
                <Building className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Site Yönetimi</h2>
              <p className="text-sm text-slate-500 leading-relaxed px-4">
                Merkezi SCADA sistemini izleyin, AI simülatörünü kontrol edin ve sitenin ESG verilerini analiz edin.
              </p>
              <div className="mt-8 text-sky-600 font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Sisteme Giriş Yap →
              </div>
            </button>

            {/* Daire Sakini Girişi */}
            <button
              onClick={() => {
                setUserRole('resident');
                setCurrentTab('residents');
                setIsAppStarted(true);
              }}
              className="group flex flex-col items-center text-center p-10 bg-white rounded-3xl border-2 border-transparent shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300 mb-6">
                <UserCheck className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Daire Sakini</h2>
              <p className="text-sm text-slate-500 leading-relaxed px-4">
                Hane su kalitenizi anlık görüntüleyin, tüketim verilerinizi ve fatura aidat indirimlerinizi takip edin.
              </p>
              <div className="mt-8 text-emerald-600 font-bold text-sm tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Portala Giriş Yap →
              </div>
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. ANA UYGULAMA EKRANI (MAIN APP)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      
            <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        selectedApartmentNumber={selectedApartment.number}
        onLogoClick={() => setIsAppStarted(false)}
      />

      {currentTab === 'schematic' && <TelemetryBar telemetry={telemetry} />}

      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-500">
        
        {userRole === 'management' && currentTab === 'schematic' && (
          <div className="space-y-6">
            <HydraulicSchematic
              telemetry={telemetry}
              onTriggerFlush={handleTriggerFlush}
              onTriggerIrrigation={handleTriggerIrrigation}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block">4 Blok İçme Suyu Hattı</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-slate-900">{telemetry.pureFlowRate}</span>
                  <span className="text-xs text-slate-500">L/saat</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Arıtılmış TS266 sertifikalı su 80 mutfağa doğrudan basılıyor.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block">Site Klozet Rezervuar Deposu</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-sky-700">{Math.round(telemetry.reservoirTankLevel)}</span>
                  <span className="text-xs text-slate-500">/ {reservoirCap.toLocaleString('tr-TR')} L</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Atık suyun %100'ü 4 bloğa yönlendirilerek kanalizasyon önleniyor.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block">Siemens VFD Enerji Tasarrufu</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-emerald-700">{telemetry.pumpPressure}</span>
                  <span className="text-xs text-slate-500">bar · %42 Tasarruf</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Şebeke TDS'ine göre dinamik Sinamics frekans kontrolü aktif.
                </p>
              </div>
            </div>
          </div>
        )}

        {userRole === 'management' && currentTab === 'simulator' && (
          <div className="space-y-6">
            <SimulationControls
              telemetry={telemetry}
              setInletTds={setInletTds}
              setAiDynamicMode={setAiDynamicMode}
              setBuildingDemandLph={setBuildingDemandLph}
              isSimulating={isSimulating}
              setIsSimulating={setIsSimulating}
              simSpeed={simSpeed}
              setSimSpeed={setSimSpeed}
              onTriggerFlush={handleTriggerFlush}
              onTriggerIrrigation={handleTriggerIrrigation}
              onResetSimulation={handleResetSimulation}
            />
            <HydraulicSchematic
              telemetry={telemetry}
              onTriggerFlush={handleTriggerFlush}
              onTriggerIrrigation={handleTriggerIrrigation}
            />
          </div>
        )}

        {currentTab === 'comparison' && (
          <ComparativeAnalytics
            stats={comparativeStats}
            apartments={apartments}
          />
        )}

        {currentTab === 'advisor' && (
          <GeminiAdvisor telemetry={telemetry} />
        )}

      {currentTab === 'residents' && (
          <ResidentPortal
            apartments={apartments}
            selectedApartmentId={selectedApartmentId}
            setSelectedApartmentId={setSelectedApartmentId}
            telemetry={telemetry}
            userRole={userRole}
          />
        )}

      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">HydroSense AI</span>
            <span>·</span>
            <span>Akıllı Site Su Yönetim Platformu (4 Blok · 80 Daire)</span>
            <span>·</span>
            <span>Siemens & YGA Climathon Projesi</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-medium">İmar Yön. Md. 36 Uyumlu (38 m³ Depo)</span>
            <span>·</span>
            <span className="font-mono">Sağlık Bakanlığı 2007/67</span>
          </div>
        </div>
      </footer>
    </div>
  );
}