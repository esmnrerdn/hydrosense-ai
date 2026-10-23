import { TelemetryData, ValveState, ApartmentData, ComparativeStats } from '../types';

/**
 * Calculates physics-grounded hydraulic parameters based on inlet TDS and current operating state.
 */
export function calculateTelemetry(
  inletTds: number,
  aiDynamicMode: boolean,
  buildingDemandLph: number,
  currentReservoirLevel: number,
  currentLandscapeLevel: number,
  reservoirCapacity: number = 2000,
  landscapeCapacity: number = 1500
): {
  telemetry: TelemetryData;
  newReservoirLevel: number;
  newLandscapeLevel: number;
} {
  // van 't Hoff osmotic pressure approximation: Pi (bar) ~ 0.0075 * TDS (ppm)
  const osmoticPressure = Math.max(1.2, inletTds * 0.0075);

  let pumpPressure: number;
  let pumpFrequencyHz: number;
  let motorPowerWatts: number;
  let recoveryRate: number;

  if (aiDynamicMode) {
    const targetPressure = osmoticPressure + 1.9;
    pumpPressure = Number(Math.min(6.3, Math.max(3.8, targetPressure)).toFixed(1));
    pumpFrequencyHz = Number((30 + ((pumpPressure - 3.8) / (6.3 - 3.8)) * 20).toFixed(1));
    motorPowerWatts = Math.round(320 + ((pumpPressure - 3.8) / (6.3 - 3.8)) * 260);
    recoveryRate = Number(Math.max(52, Math.min(64, 65 - (inletTds / 800) * 12)).toFixed(1));
  } else {
    pumpPressure = 6.5;
    pumpFrequencyHz = 50.0;
    motorPowerWatts = 850;
    recoveryRate = 20.0;
  }

  // Pure drinking water output TDS
  const saltPassage = 0.035;
  const pureTds = Math.max(12, Math.round(inletTds * saltPassage));

  // Reject (brine) TDS concentration
  const rejectTds = Math.round(inletTds * (1 / (1 - (recoveryRate / 100) * 0.95)));

  // Flow rates based on site demand (L/h)
  const pureFlowRate = buildingDemandLph;
  const rejectFlowRate = Number((pureFlowRate * ((100 - recoveryRate) / recoveryRate)).toFixed(1));

  // Smart Valve Priority Routing:
  // Priority 1: Site toilet flushes tank (until 92% full)
  // Priority 2: Landscape irrigation tank (until 95% full)
  // Priority 3: Emergency safety overflow drain
  let smartValveState: ValveState = 'reservoir';
  const reservoirRatio = currentReservoirLevel / reservoirCapacity;
  const landscapeRatio = currentLandscapeLevel / landscapeCapacity;

  if (reservoirRatio < 0.92) {
    smartValveState = 'reservoir';
  } else if (landscapeRatio < 0.95) {
    smartValveState = 'landscape';
  } else {
    smartValveState = 'drain';
  }

  const addedRejectLiters = rejectFlowRate / 60;
  let newReservoirLevel = currentReservoirLevel;
  let newLandscapeLevel = currentLandscapeLevel;

  if (smartValveState === 'reservoir') {
    newReservoirLevel = Math.min(reservoirCapacity, currentReservoirLevel + addedRejectLiters);
  } else if (smartValveState === 'landscape') {
    newLandscapeLevel = Math.min(landscapeCapacity, currentLandscapeLevel + addedRejectLiters);
  }

  return {
    telemetry: {
      inletTds,
      pureTds,
      rejectTds,
      pumpPressure,
      pumpFrequencyHz,
      motorPowerWatts,
      pureFlowRate,
      rejectFlowRate,
      recoveryRate,
      reservoirTankLevel: Math.round(newReservoirLevel),
      reservoirTankCapacity: reservoirCapacity,
      landscapeTankLevel: Math.round(newLandscapeLevel),
      landscapeTankCapacity: landscapeCapacity,
      smartValveState,
      aiDynamicMode,
      buildingLoadName: 'Site Merkezi Hat',
      hourlyConsumptionLiters: pureFlowRate
    },
    newReservoirLevel,
    newLandscapeLevel
  };
}

/**
 * Initial Apartments Mock Data for Site (4 Blocks · 80 Apartments)
 */
export function generateInitialApartments(): ApartmentData[] {
  const apartments: ApartmentData[] = [];
  const blocks: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  
  let globalId = 1;
  blocks.forEach((block) => {
    for (let aptNo = 1; aptNo <= 20; aptNo++) {
      const floor = Math.ceil(aptNo / 4);
      const residentCount = (aptNo % 3 === 0) ? 4 : (aptNo % 2 === 0) ? 3 : 2;
      const monthlyDrinkingWaterLiters = Math.round(residentCount * 28 * 30);
      const monthlyFlushGreywaterLiters = Math.round(residentCount * 24 * 30);
      const monthlyAidatDiscountTl = Math.round(240 + (monthlyFlushGreywaterLiters / 1000) * 45 + residentCount * 20);

      apartments.push({
        id: globalId++,
        number: `${block}-${aptNo}`,
        block,
        floor,
        residentCount,
        monthlyDrinkingWaterLiters,
        monthlyFlushGreywaterLiters,
        monthlyAidatDiscountTl,
        waterQualityPpm: 15 + ((globalId + aptNo) % 5),
        lastFilterCheckDate: '15.10.2026'
      });
    }
  });

  return apartments;
}

/**
 * Computes comparative metrics between conventional under-sink purifiers vs HydroSense AI
 */
export function calculateComparativeStats(apartments: ApartmentData[]): ComparativeStats {
  const totalPureDaily = apartments.reduce((acc, a) => acc + (a.monthlyDrinkingWaterLiters / 30), 0);
  
  const traditionalTotalDrawnLitersPerDay = Math.round(totalPureDaily / 0.20);
  const traditionalWastedLitersPerDay = Math.round(traditionalTotalDrawnLitersPerDay * 0.80);

  const aiTotalDrawnLitersPerDay = Math.round(totalPureDaily / 0.60);
  const aiWastedLitersPerDay = 0;

  const traditionalKwhPerMonth = 420;
  const aiKwhPerMonth = 195;

  const monthlySavingsTl = 16800;
  const annualSavingsTl = monthlySavingsTl * 12;
  const co2SavedKgPerMonth = 194;

  // Planlı Alanlar İmar Yönetmeliği Madde 36:
  // İlk 10 daire için 3 m³ + kalan 70 daire x 0.50 m³ = 38 m³
  const legalTankRequiredM3 = 38;

  return {
    traditionalTotalDrawnLitersPerDay,
    aiTotalDrawnLitersPerDay,
    traditionalWastedLitersPerDay,
    aiWastedLitersPerDay,
    traditionalKwhPerMonth,
    aiKwhPerMonth,
    monthlySavingsTl,
    annualSavingsTl,
    co2SavedKgPerMonth,
    legalTankRequiredM3
  };
}
