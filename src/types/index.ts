export type ValveState = 'reservoir' | 'landscape' | 'drain';

export type BuildingLoadPreset = 'morning' | 'noon' | 'evening' | 'irrigation' | 'custom';

export interface TelemetryData {
  inletTds: number;          // ppm (e.g. 180 - 750)
  pureTds: number;           // ppm (target < 25)
  rejectTds: number;         // ppm (brine concentration)
  pumpPressure: number;      // bar (AI: 3.8 - 6.2, Conventional: 6.5 fixed)
  pumpFrequencyHz: number;   // VFD frequency (30 - 50 Hz)
  motorPowerWatts: number;   // Watts (AI: 320 - 580W, Conventional: 850W)
  pureFlowRate: number;      // L/h (pure drinking water demand)
  rejectFlowRate: number;    // L/h (concentrate stream)
  recoveryRate: number;      // percentage (e.g. 58% vs 20%)
  
  // Tanks
  reservoirTankLevel: number;// Liters (max 2000 L)
  reservoirTankCapacity: number; // 2000 L
  landscapeTankLevel: number;// Liters (max 1500 L)
  landscapeTankCapacity: number; // 1500 L
  
  smartValveState: ValveState;
  aiDynamicMode: boolean;
  buildingLoadName: string;
  hourlyConsumptionLiters: number;
}

export type BlockId = 'A' | 'B' | 'C' | 'D';

export interface ApartmentData {
  id: number;
  number: string;
  block: BlockId;
  floor: number;
  residentCount: number;
  monthlyDrinkingWaterLiters: number; // pure water consumed
  monthlyFlushGreywaterLiters: number;// flush water diverted
  monthlyAidatDiscountTl: number;     // TL savings reflected on dues
  waterQualityPpm: number;
  lastFilterCheckDate: string;
}

export interface ComparativeStats {
  traditionalTotalDrawnLitersPerDay: number;
  aiTotalDrawnLitersPerDay: number;
  traditionalWastedLitersPerDay: number;
  aiWastedLitersPerDay: number;
  traditionalKwhPerMonth: number;
  aiKwhPerMonth: number;
  monthlySavingsTl: number;
  annualSavingsTl: number;
  co2SavedKgPerMonth: number;
  legalTankRequiredM3: number;
}

export interface AIDiagnosisResult {
  statusSummary: string;
  membraneHealth: string;
  energySavingsComment: string;
  waterRecoveryComment: string;
  recommendations: string[];
  isFallback?: boolean;
}

export interface AIBulletinResult {
  headline: string;
  body: string;
  highlightMetrics: { label: string; value: string }[];
  isFallback?: boolean;
}
