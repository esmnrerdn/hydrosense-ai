import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// POST /api/diagnose - AI SCADA Analysis & Engineering Diagnostics
app.post('/api/diagnose', async (req: Request, res: Response) => {
  try {
    const {
      inletTds,
      pureTds,
      pumpPressure,
      aiOptimized,
      pureFlowRate,
      rejectFlowRate,
      reservoirTankPct,
      landscapeTankPct,
      valveState,
      buildingLoadName,
      apartmentCount = 80
    } = req.body;

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      return res.json({
        success: true,
        isFallback: true,
        diagnosis: {
          statusSummary: `Site merkezi arıtma sistemi ${inletTds} ppm şebeke TDS seviyesinde ${aiOptimized ? 'Siemens VFD dinamik basınç' : 'geleneksel sabit basınç'} modunda 4 bloğa (80 Daire) hizmet veriyor.`,
          membraneHealth: inletTds > 600 ? 'Yüksek kirlilik yükü; membran ters yıkama 18 saat içinde tavsiye edilir.' : 'Merkezi spiral membran geçirgenliği %97 nominal aralıkta, kirlenme riski düşük.',
          energySavingsComment: aiOptimized 
            ? `Dinamik ${pumpPressure} bar regülasyonu sayesinde geleneksel sabit motora göre %42 elektrik tasarrufu sağlanıyor.`
            : 'Dikkat: Sabit basınç modu aktif. AI optimizasyonu açılarak günlük ~14.6 kWh enerji tasarrufu sağlanabilir.',
          waterRecoveryComment: `Üretilen ${rejectFlowRate} L/saat konsantre atık su, akıllı valf ile ${valveState === 'reservoir' ? '4 bloğun (80 daire) klozet rezervuarlarına' : valveState === 'landscape' ? 'sitenin 15.000 L bahçe peyzaj deposuna' : 'emniyet hattına'} yönlendiriliyor. Kanalizasyona sıfır deşarj sağlandı.`,
          recommendations: [
            'Planlı Alanlar İmar Yönetmeliği Madde 36 kapsamındaki 38 m³ merkezi depo seviyesi nominaldir.',
            inletTds > 500 ? 'Merkezi ön sediment ve karbon filtrelerin basınç farkını (ΔP) kontrol ediniz.' : 'Şebeke TDS değeri standart aralıkta.',
            '80 dairenin mutfaklarına basılan 17 ppm içme suyu TS 266 standartlarındadır.'
          ]
        }
      });
    }

    const prompt = `Sen 4 bloklu (80 daire, ~280 site sakini) modern bir konut sitesinin "HydroSense AI - Akıllı Site Su Yönetimi" SCADA sisteminde görevli kıdemli mekatronik ve su mühendisisin (Siemens Desigo & YGA Climathon projesi).
Aşağıdaki anlık telemetri verilerini inceleyerek Türkçe dilinde JSON formatında teknik teşhis ve tavsiye raporu üret:

Site Ölçeği: ${apartmentCount} Daire (4 Blok: A, B, C, D)
Yasal Depo Statüsü: Planlı Alanlar İmar Yönetmeliği Madde 36 (38 m³ Su Deposu ve Hidrofor Odası)
Giriş Şebeke TDS: ${inletTds} ppm (Normal: 200-350 ppm, Yüksek: >500 ppm)
Çıkış Saf Su TDS: ${pureTds} ppm (İçme suyu hedefi: <25 ppm)
Merkezi Siemens VFD Pompa Basıncı: ${pumpPressure} bar
AI Dinamik Basınç Modu: ${aiOptimized ? 'AÇIK (Değişken VFD)' : 'KAPALI (Geleneksel Sabit 6.5 bar)'}
Saf İçme Suyu Debisi: ${pureFlowRate} L/saat
Konsantre Atık Su Debisi: ${rejectFlowRate} L/saat
Site Klozet Rezervuar Deposu Seviyesi: %${reservoirTankPct} (8.000 L kapasite)
Site Geniş Bahçe & Peyzaj Deposu Seviyesi: %${landscapeTankPct} (15.000 L kapasite)
Akıllı 3-Yollu Valf Konumu: ${valveState} (reservoir / landscape / drain)
Site Anlık Su Tüketim Yükü: ${buildingLoadName}

Lütfen yanıtını SADECE aşağıdaki JSON şemasına uygun geçerli bir JSON olarak döndür (markdown kod bloğu veya ek açıklama yazma):
{
  "statusSummary": "1-2 cümlelik durum özeti",
  "membraneHealth": "RO membran sağlığı, kirlenme riski ve ters yıkama ihtiyacı",
  "energySavingsComment": "Motor basıncı ve VFD enerji verimliliği değerlendirmesi",
  "waterRecoveryComment": "Atık suyun rezervuar ve sulamaya yönlendirilmesi ile önlenen kanalizasyon israfı",
  "recommendations": ["Tavsiye 1", "Tavsiye 2", "Tavsiye 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const diagnosis = JSON.parse(text);

    return res.json({ success: true, diagnosis, isFallback: false });
  } catch (error: any) {
    console.error('AI Diagnose Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Teşhis raporu oluşturulurken hata meydana geldi.'
    });
  }
});

// POST /api/bulletin - AI Resident Sustainability & Savings Newsletter
app.post('/api/bulletin', async (req: Request, res: Response) => {
  try {
    const {
      monthlySavedWaterLiters,
      monthlyElectricitySavedKwh,
      monthlyCostSavedTl,
      perApartmentSavedTl,
      divertedToFlushesLiters,
      divertedToIrrigationLiters,
      apartmentCount = 80
    } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        bulletin: {
          headline: 'HydroSense AI ile Sitemiz Bu Ay 270 Ton Şebeke Suyu Kurtardı!',
          body: `Değerli Site Sakinlerimiz,\n\nMerkezi akıllı arıtma ve atık su geri kazanım sistemimiz sayesinde bu ay 4 bloğumuzda (A, B, C, D Blokları - 80 Daire) toplam ${monthlySavedWaterLiters.toLocaleString('tr-TR')} Litre içilebilir kalitedeki şebeke suyunun kanalizasyona dökülmesi önlendi. Ters ozmoz işleminde açığa çıkan mineralli su, akıllı valflerimiz aracılığıyla ${divertedToFlushesLiters.toLocaleString('tr-TR')} Litresi 80 dairemizin klozet rezervuarlarına, ${divertedToIrrigationLiters.toLocaleString('tr-TR')} Litresi ise ortak sitemizin geniş bahçe ve peyzaj sulama göletine yönlendirildi.\n\nSiemens VFD destekli motor optimizasyonuyla sağlanan elektrik tasarrufu dahil bu ay sitemize toplam ${monthlyCostSavedTl.toLocaleString('tr-TR')} TL ortak bütçe tasarrufu sağlandı. Her bir dairemizin aidatına bu ay ortalama ${perApartmentSavedTl} TL net indirim olarak yansıtılmıştır. Planlı Alanlar İmar Yönetmeliği Madde 36 standartlarındaki 38 m³ depomuz ile döngüsel yeşil kampüs hedefimize gururla ulaşıyoruz!`,
          highlightMetrics: [
            { label: 'Sitede Kurtarılan Su', value: `${(monthlySavedWaterLiters / 1000).toFixed(0)} Ton` },
            { label: 'Aylık Enerji Tasarrufu', value: `${monthlyElectricitySavedKwh} kWh` },
            { label: 'Daire Başı Aidat İndirimi', value: `${perApartmentSavedTl} ₺` }
          ]
        }
      });
    }

    const prompt = `Sen 4 bloklu (80 daire, ~280 site sakini) modern bir konut sitesinin yönetim kurulu adına site sakinlerine aylık sürdürülebilirlik, çevre ve su tasarrufu bülteni hazırlayan yapay zekâ asistanısın (Siemens & YGA Climathon projesi).
Aşağıdaki gerçek site verilerini kullanarak sıcak, profesyonel, gurur verici bir Türkçe bülten hazırla:

- Site Ölçeği: ${apartmentCount} Daire (A, B, C, D Blokları)
- Yasal Depo Uygunluğu: Planlı Alanlar İmar Yönetmeliği Madde 36 (38 m³ Merkezi Depo ve Hidrofor)
- Aylık Kanalizasyondan Kurtarılan Atık Su: ${monthlySavedWaterLiters} Litre
- 80 Dairenin Klozet Rezervuarlarına Yönlendirilen Su: ${divertedToFlushesLiters} Litre
- Sitenin Geniş Peyzaj ve Park Sulamasına Verilen Su: ${divertedToIrrigationLiters} Litre
- Siemens VFD Pompa Optimizasyonu Elektrik Tasarrufu: ${monthlyElectricitySavedKwh} kWh
- Aylık Toplam Site Mali Tasarrufu: ${monthlyCostSavedTl} TL
- Daire Başına Düşen Aylık Aidat İndirimi: ${perApartmentSavedTl} TL

Lütfen SADECE aşağıdaki JSON şemasına uygun geçerli bir JSON döndür:
{
  "headline": "Çarpıcı ve motive edici bir başlık",
  "body": "Bina sakinlerine yönelik 2 paragraflık şeffaf ve gurur verici bilgilendirme metni",
  "highlightMetrics": [
    { "label": "Metrik 1 Adı", "value": "Değer 1" },
    { "label": "Metrik 2 Adı", "value": "Değer 2" },
    { "label": "Metrik 3 Adı", "value": "Değer 3" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const bulletin = JSON.parse(text);

    return res.json({ success: true, bulletin, isFallback: false });
  } catch (error: any) {
    console.error('AI Bulletin Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Bülten oluşturulurken hata meydana geldi.'
    });
  }
});

// Setup Vite in Dev or serve Static in Production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HydroSense AI Server running at http://localhost:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer();
