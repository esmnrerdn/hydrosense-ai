# Akıllı Bina Su Yönetimi (HydroSense AI - 20 Dairelik Bina Ölçeği) - Uygulama Planı

20 dairelik (yaklaşık 70-80 bina sakini) merkezi konut bloğunda şebeke suyunun kirlilik oranını (TDS) anlık izleyen, pompa basıncını yapay zekâ ile dinamik optimize eden ve ters ozmoz (RO) atık suyunu kanalizasyon yerine akıllı valflerle 20 dairenin tuvalet rezervuarlarına ve bina peyzaj sulama tanklarına yönlendiren uçtan uca interaktif su yönetim ve simülasyon platformu.

---

### Kullanıcı Tercihleri ve Bina Ölçeği (User Review & Critical Decisions)

> [!IMPORTANT]
> **20 Dairelik Bina Ölçeği ve Hidrolik Büyüklükler**:
> Sistem tek bir müstakil ev için değil, **20 Dairelik Merkezi Konut Yapısı** için tasarlanmıştır. Verilerin ve debilerin büyüklüğü bu ölçeğe göre somutlaştırılmıştır:
> - **Günlük Arıtılmış İçme & Mutfak Suyu Tüketimi**: 20 daire $\times$ 25-30 L/gün $\approx$ **500 - 600 Litre/gün** saf su.
> - **Geleneksel Tezgâh Altı Cihazlardaki Devasa İsraf**: %20 verimlilikle çalışan eski sistemlerde 600 L saf su elde etmek için tam **2.400 Litre/gün (ayda 72 Ton)** şebeke suyu doğrudan kanalizasyona dökülmektedir!
> - **HydroSense AI Kazanımı**: Geri kazanım oranı %55-%65 seviyesine çıkarılır; açığa çıkan konsantre su (yaklaşık 1.000 - 1.400 L/gün) akıllı valflerle 20 dairenin klozet rezervuar hattına (günlük ~600 L sifon ihtiyacı) ve 1.500 L kapasiteli bahçe peyzaj sulama tankına yönlendirilir. Kanalizasyona sıfır atık hedeflenir.
> - **Bina Ekonomisi**: Aylık ~70 Ton su tasarrufu + AI motor basıncı ile %35 elektrik tasarrufu sayesinde bina ortak giderinde yıllık 60.000 TL+ net aidat avantajı.

- **Doğrulanan Karar 1 (Kullanıcı Paneli Mimarisi)**:
  - **Bina Teknik Yönetim & SCADA Ekranı**: 20 daireye giden ana hat basıncı, merkezi pompa VFD frekansı, membran giriş/çıkış TDS sensörleri, 3-yollu akıllı valf matrisi, rezervuar ana deposu (2.000 L) ve peyzaj sulama deposu (1.500 L) canlı debileri.
  - **Daire Sakinleri Portalı (20 Dairelik Seçici)**: Sakin kendi dairesini (Daire 1 - Daire 20) seçip dairesine ulaşan filtrelenmiş su kalitesini, bu ay sifonlarda geri dönüştürülen gri su payını ve aidatına yansıyan net TL tasarrufunu görebilir.
- **Doğrulanan Karar 2 (Simülasyon Deneyimi)**:
  - 20 dairelik binanın anlık su çekişi (sabah/akşam pik saatleri simülasyonu), şebeke suyu TDS dalgalanmaları (180 - 750 ppm), AI basınç regülatörü ve akıllı valflerin dinamik yönlendirmesi canlı SVG akış şemasında gösterilecektir.
- **Doğrulanan Karar 3 (Görsel Tema ve Tasarım)**:
  - Açık tema, ferah, kurumsal ESG & sürdürülebilirlik odaklı modern arayüz (`#F8FAFC` zemin, berrak su mavisi `#0284C7`, ekolojik zümrüt `#059669`, endüstriyel arduvaz `#334155`).

---

### 1. Genel Bakış ve Temel Konsept (Overview & Core Concept)

- **Problem (20 Dairelik Apartmanda Yaşanan İsraf)**:
  - 20 dairenin her birinde bağımsız tezgâh altı arıtma cihazı olduğunda, 20 adet küçük verimsiz pompa sürekli kontrolsüz çalışır. Her daire 1 bardak temiz su için 4 bardak suyu kanalizasyona döker. Binada günde 2 tondan fazla içilebilir kalitedeki su kanalizasyonda kaybolur.
- **Çözüm (Merkezi HydroSense AI)**:
  1. **Merkezi AI Pompa ve Basınç Kontrolü**: Tek bir yüksek verimli endüstriyel pompa, şebeke giriş TDS'ini anlık ölçerek motor basıncını 3.8 - 6.2 bar arasında yapay zekâ ile optimize eder.
  2. **Yüksek Geri Kazanım Membranları**: Merkezi sistemde %55-%65 verimle içme suyu üretilir.
  3. **20 Dairelik Akıllı Valf Dağıtım Hattı**:
     - Atık su kanalizasyon yerine önce 20 dairenin ortak klozet rezervuar kolon hattına basılır.
     - Rezervuar tankı dolduğunda akıllı valf peyzaj sulama tankına yönlendirir.
     - Şebekeden sifon ve sulama için harcanan pahalı şehir suyu tüketimi neredeyse sıfırlanır.
- **Hedef Kitle**: Bina yöneticileri, site teknik personeli, 20 dairelik apartman sakinleri, yeşil bina (LEED / BREEAM) danışmanları.

---

### 2. Kullanıcı Deneyimi ve Görsel Tasarım (UX & Visual Design)

- **Görsel Kimlik ve Tipografi**:
  - *Yazı Tipleri*: Kurumsal ve modern sans `Plus Jakarta Sans` / `Outfit`; telemetri, TDS (ppm), basınç (bar), debi (L/saat) ve tasarruf tutarları için monospaced tabular numerals (`font-mono tabular-nums`).
  - *Renk Paleti*:
    - %60 Dominant Tuval: Nötr ferah beyaz ve açık buz grisi (`bg-slate-50 / bg-white`).
    - %30 Yapısal Yüzeyler: İnce 1px çerçeveli paneller (`border-slate-200`), kontrastlı arduvaz metin (`text-slate-900 / text-slate-600`).
    - %10 Odaklı Vurgu: Su mavisi (`#0284C7`), geri kazanım zümrütü (`#059669`), uyarı kehribarı (`#D97706`).
  - *Anti-Slop Disiplini*: Gereksiz pill etiketler yok; `·` ayırıcıları ile temiz veri gösterimi; sahte hız/ping sayaçları yok; net mühendislik metrikleri.

- **Ekran Bölümleri ve Gezinme**:
  - **Üst Çubuk (Top Bar Contract)**:
    - Bölge 1: Marka (`HydroSense AI · 20 Dairelik Akıllı Su Yönetimi`)
    - Bölge 2: Navigasyon sekmeleri (`Merkezi SCADA Şeması`, `20 Daire Akış Simülatörü`, `Yapay Zekâ Analitiği`, `Daire Sakinleri Portalı`, `Tasarruf & ESG`)
    - Bölge 3: Rol Seçici (`Bina Yönetimi & Tesis Mühendisi` / `Daire Sakini Paneli`)
  - **20 Dairelik Canlı SCADA Akış Şeması**:
    - Şebeke Girişi (TDS: 180-750 ppm) ➔ Tortu/Karbon Ön Filtre ➔ Değişken Frekanslı AI Pompa ➔ Merkezi RO Membran Modülü.
    - Temiz Su Hattı ➔ 20 Daire İçme Suyu Hidroforu (500-600 L/gün).
    - Konsantre Atık Su Hattı ➔ 3-Yollu Akıllı Valf Bloğu ➔
      - Hat 1: 20 Daire Rezervuar Deposu (2.000 L kapasite, şamandıra ve seviye sensörü).
      - Hat 2: Peyzaj & Bahçe Sulama Deposu (1.500 L kapasite, damlama hattı).
      - Hat 3: Emniyet Taşma/Tahliye Hattı.
    - SVG tabanlı borularda su akış hızını gösteren animasyonlu partiküller.
  - **Bina Simülasyon Kontrolleri**:
    - *Şebeke Suyu Durumu*: Normal Şebeke (280 ppm), Sert/Kireçli Su (480 ppm), Ağır Kirlilik (720 ppm) veya serbest kaydırıcı.
    - *Bina Tüketim Yükü*: Sabah Piki (20 daire uyanış - 80 L/saat), Öğle Sakinliği (15 L/saat), Akşam Piki (95 L/saat), Bahçe Sulama Saati (150 L/saat).
    - *AI Dinamik Basınç Motoru*: Açık / Kapalı anahtarı (Geleneksel sabit 6.5 bar ile AI değişken 3.8-6.2 bar kıyaslaması).
    - *Hızlı Tüketim Butonları*: "Klozet Sifonu Çek (Daire 7)" (-6 L rezervuar), "Peyzaj Fıskiyelerini Çalıştır" (-200 L peyzaj tankı).
  - **Daire Sakini Görünümü (20 Daire Seçilebilir)**:
    - Sakin kendi dairesini seçer (ör. Daire 12 - 3 Kişi).
    - Dairesinin bu ay tükettiği arıtılmış su (Litre) ve TDS saflık garantisi (18 ppm).
    - Tuvalet sifonunda kullanılan geri dönüştürülmüş su miktarı ve şebekeden çekilmeyen su payı.
    - Bu ay aidata yansıyan tasarruf indirimi (TL) ve 20 dairelik toplam bina çevre başarısı.
  - **Gemini Destekli Sistem Teşhisi ve ESG Raporlama**:
    - `@google/genai` (model: `gemini-3.8-flash`) ile mevcut bina parametrelerini inceleyen yapay zekâ:
      - Membran kirlenme eğilimi ve ters yıkama zamanlaması.
      - 20 dairenin haftalık su bülteni için otomatik oluşturulan bilgilendirici yönetici özeti.

---

### 3. Temel Ürün Kararları ve Mimari Tercihler (Product Decisions & Trade-Offs)

- **Karar 1: 20 Dairelik Gerçekçi Hidrolik Matematik**:
  - *Geleneksel Durum*: 20 daire $\times$ 30 L = 600 L saf su. Geleneksel RO %20 verim $\rightarrow$ 2.400 L atık su ziyan edilir. Toplam çekilen şebeke suyu = 3.000 L/gün.
  - *HydroSense AI Durumu*: 600 L saf su için %60 verim $\rightarrow$ Sadece 400 L konsantre su üretilir. Bu 400 L doğrudan rezervuarlara yönlendirilir; rezervuar ihtiyacının (%70'i) sıfır maliyetle karşılanır.
- **Karar 2: Akıllı Valf Öncelik Algoritması**:
  - Seviye 1: Rezervuar Tankı Seviyesi < %85 ise tüm konsantre su 20 dairenin rezervuar ana deposuna aktarılır.
  - Seviye 2: Rezervuar Tankı dolduğunda valf otomatik olarak Peyzaj Tankına geçer.
  - Seviye 3: Her iki tank da dolarsa veya TDS aşırı tuzlanma sınırına ulaşırsa tahliye vanası devreye girer.

---

### 4. Teknik Mimari ve Bileşen Yapısı (Technical Architecture)

```
┌────────────────────────────────────────────────────────────────────────┐
│               HydroSense AI - 20 Dairelik Su Yönetimi                  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navigation & Dual-Role Switcher (Bina SCADA / Daire Sakinleri)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ 20-Daire Telemetri Barı │  │ Simülasyon & Yük Kontrolleri        │  │
│  │ • Şebeke TDS (ppm)      │  │ • TDS Kaydırıcısı (100 - 800 ppm)   │  │
│  │ • AI Pompa Basıncı (bar)│  │ • Bina Pik Saat Tüketim Yükü (L/h)  │  │
│  │ • Saf Su Debisi (L/h)   │  │ • AI Basınç Optimizasyonu (Açık/Kap)│  │
│  │ • Geri Kazanım (%)      │  │ • Sifon / Sulama Tetikleme          │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ SVG Tabanlı SCADA Akış Şeması (20 Dairelik Borulama & Akıllı Valf)│  │
│  │ Şebeke ➔ VFD Pompa ➔ RO Membran ➔ İçme Suyu Hattı                │  │
│  │ Atık Su ➔ Akıllı 3-Yollu Valf ➔ [Rezervuar Deposu | Peyzaj Deposu] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ 20 Dairelik Karşılaştırma│ │ Gemini AI Teşhis & Yönetici Raporu  │  │
│  │ • Geleneksel vs. AI     │  │ • Anlık Membran & Pompa Sağlığı     │  │
│  │ • Ayda 72 Ton Su Tasarruf│ │ • 20 Dairelik ESG Özeti             │  │
│  │ • 60.000 TL+ Yıllık Kar │  │ • Ters Yıkama Önerisi               │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Daire Sakini Portalı (Daire 1-20 Seçimi, Su Kalitesi, Aidat Payı)│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Bileşen Hiyerarşisi**:
  - `src/App.tsx`: Genel durum, rol geçişi, simülasyon tick döngüsü, 20 dairelik veri senkronizasyonu.
  - `src/components/Header.tsx`: Üst bar sözleşmesi (3 bölge), bina adı, rol değiştirici.
  - `src/components/HydraulicSchematic.tsx`: 20 dairelik SVG hidrolik SCADA paneli, animasyonlu boru hatları, akıllı valf açıları, tank doluluk göstergeleri.
  - `src/components/SimulationControls.tsx`: TDS ayarı, bina pik saat modu, AI motor optimizasyonu, manuel tüketim test butonları.
  - `src/components/ComparativeAnalytics.tsx`: 20 dairelik apartman için geleneksel tezgâh altı arıtmalar ile HydroSense AI arasındaki su (Ton/ay), enerji (kWh) ve maliyet (TL) farkını gösteren grafikler ve sayaçlar.
  - `src/components/ResidentPortal.tsx`: 20 daire arasından seçim yapabilen daire sakini arayüzü; daireye özel su kalitesi sertifikası, rezervuar gri su katkısı ve aidat indirimi.
  - `src/components/GeminiAdvisor.tsx`: Gemini 3.8 Flash modeli ile anlık sistem telemetrisine göre mühendislik teşhisi ve bina sakinlerine yönelik ESG bülteni oluşturucu.

---

### Doğrulama Planı (Verification Plan)
1. **Derleme Kontrolü**: `compile_applet` ile sıfır hata doğrulaması.
2. **20 Dairelik Veri Tutarlılığı**: Günlük/aylık litrelerin, sifon ve sulama tüketimlerinin 20 dairelik bina ölçeği ile tam örtüştüğünün doğrulanması.
3. **Simülasyon Reaktivitesi**: TDS değiştikçe AI pompanın basıncı dinamik ayarlaması ve atık suyun rezervuar/peyzaj tanklarına yönelmesinin görsel doğrulaması.
