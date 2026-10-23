import React from 'react';
import { Droplets } from 'lucide-react';

interface HeaderProps {
  currentTab: 'schematic' | 'simulator' | 'comparison' | 'advisor' | 'residents';
  setCurrentTab: (tab: 'schematic' | 'simulator' | 'comparison' | 'advisor' | 'residents') => void;
  userRole: 'management' | 'resident';
  setUserRole: (role: 'management' | 'resident') => void;
  selectedApartmentNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Logo & Marka */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Site Su Yönetimi
              </span>
              <span className="text-xs text-sky-600 font-semibold whitespace-nowrap">
                HydroSense AI · {userRole === 'management' ? 'SCADA' : 'Sakin Portalı'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigasyon Linkleri */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            
            {/* SADECE YÖNETİCİYE GÖSTERİLEN SEKMELER */}
            {userRole === 'management' && (
              <>
                <button
                  onClick={() => setCurrentTab('schematic')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 text-left ${
                    currentTab === 'schematic' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent'
                  }`}
                >
                  Merkezi SCADA Şeması
                </button>
                <button
                  onClick={() => setCurrentTab('simulator')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 text-left ${
                    currentTab === 'simulator' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent'
                  }`}
                >
                  Site Akış Simülatörü
                </button>
                <button
                  onClick={() => setCurrentTab('comparison')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 text-left ${
                    currentTab === 'comparison' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent'
                  }`}
                >
                  Tasarruf & ESG Kıyaslama
                </button>
                <button
                  onClick={() => setCurrentTab('advisor')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 text-left ${
                    currentTab === 'advisor' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent'
                  }`}
                >
                  Yapay Zekâ Mühendisliği
                </button>
              </>
            )}

            {/* HERKESE (Sakin ve Yönetici) GÖSTERİLEN SEKME */}
            <button
              onClick={() => setCurrentTab('residents')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 text-left ${
                currentTab === 'residents' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent'
              }`}
            >
              Daire Sakinleri Portalı
            </button>
          </nav>
        </div>
      </div>

      {/* Mobil Navigasyon */}
      <div className="md:hidden flex items-center px-4 py-2 border-t border-slate-100 bg-slate-50 overflow-x-auto text-xs gap-3">
        {userRole === 'management' && (
          <>
            <button
              onClick={() => setCurrentTab('schematic')}
              className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'schematic' ? 'bg-sky-600 text-white font-medium' : 'text-slate-600'}`}
            >
              SCADA
            </button>
            <button
              onClick={() => setCurrentTab('simulator')}
              className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'simulator' ? 'bg-sky-600 text-white font-medium' : 'text-slate-600'}`}
            >
              Simülatör
            </button>
            <button
              onClick={() => setCurrentTab('comparison')}
              className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'comparison' ? 'bg-sky-600 text-white font-medium' : 'text-slate-600'}`}
            >
              Tasarruf
            </button>
            <button
              onClick={() => setCurrentTab('advisor')}
              className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'advisor' ? 'bg-sky-600 text-white font-medium' : 'text-slate-600'}`}
            >
              AI
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentTab('residents')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'residents' ? 'bg-sky-600 text-white font-medium' : 'text-slate-600'}`}
        >
          Portal
        </button>
      </div>
    </header>
  );
};