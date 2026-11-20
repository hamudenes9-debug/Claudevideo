# Frame Three.js — tek HTML video atölyesi

## Kullanıcı için

`index.html` tek başına tüm uygulamadır: Three.js 0.180.0, uygulama JavaScript'i, CSS ve lisanslar gömülüdür. CDN, modül dosyası, Python veya internet gerektirmez. İndirilen HTML'yi güncel tarayıcıda aç. [Hızlı başlangıç](../WEB_QUICKSTART.md).

- WebGL 2 ile gerçek 3B oda, mobilya, ışıklar, perspektif kamera ve kamera hareketi.
- Fotoğraflar Three.js dokulu düzlem üzerinde merkezden kırpılan yavaş yakınlaşma ile gösterilir. Fotoğraftan 3B mekân çıkarılmaz.
- Son görüntü, Türkçe metin ve logo için 2B Canvas'a kompozitlenir; video, PNG ve önizleme aynı renderer'ı kullanır.
- Tek GPU bağlamı tekrar kullanılır; kaldırılan fotoğrafların GPU dokuları serbest bırakılır. Cihaz piksel oranı 1 ile sınırlandırılır. 720p önerilir; gerçek kare hızı donanıma bağlıdır.
- Beş sahne; başlık, alt metin, anlatım, görsel, renk, süre ve görsel dil düzenlenebilir.
- WebM/MP4 kaydı tarayıcı desteğine bağlıdır. Sekmeyi arka plana almak kaydı iptal eder. Eklenen ses sadece dışa aktarmada çalar; önizleme sessizdir.
- Beş PNG canlı renderer'ın sahne ortalarından alınır; mevcut video dosyasından çıkarılmaz.
- Proje kaydet/aç yalnızca JSON planını taşır. Medya ve anahtar dahil değildir.

## Gemini ve güvenlik

Gemini isteğe bağlıdır. Anahtar sadece sekmenin parola alanında tutulur; diske, localStorage'a veya projeye kaydedilmez. Brief ve küçültülmüş fotoğraflar onayın ardından doğrudan Google API'ye gönderilir; logo ve ses gönderilmez. Kota/ücret hesaba bağlıdır. Model yalnızca doğrulanan JSON üretir; modelden kod çalıştırılmaz. Anahtarı kendi cihazında kullan; ortak kullanımlı üretim uygulamasında kimlik doğrulamalı backend/anahtar yönetimi gerekir.

Yerel plan sabit örnek metin kullanır, brief/fotoğraf analizi yapmaz. API'siz düzenleme/render çevrimdışı çalışır. Dosya üzerinden API veya indirme engellenirse HTML'yi HTTPS barındırmada aç. WebGL 2 desteği olmayan cihazlarda 3B render devre dışıdır. Tarayıcı/dosya yöneticisi izinleri nedeniyle tüm tabletlerde doğrudan dosya açılışı garanti edilmez.

## Kaynak geliştirme

Kaynaklar okunabilir şekilde ayrı tutulur; **dağıtım tek HTML'dir**.

```sh
npm ci
npm run build
npm test
```

`template.html`, `style.css`, `app.js`, `plan.js`, `stage.js` → `scripts/build-web.mjs` → `index.html` ve `dist/frame-three-v1.2.0.html`. Derleme için Node/internet gerekir, son kullanıcı için gerekmez. Three.js MIT lisansı HTML içine gömülür. Üretilmiş index.html'yi elle düzenlemek yerine kaynakları değiştirip tekrar derle.

İsteğe bağlı canlı önizleme: `python3 web/serve.py --port 3000`. Sunucu sadece yerel geliştirme içindir. CSP, gömülü JavaScript'i SHA-256 hash'iyle yetkilendirir.

Testler: `npm test` plan, tek dosya bütünlüğü ve JavaScript sözdizimini kontrol eder. Sunucu açıkken `node scripts/web-smoke.mjs` tarayıcı testini çalıştırır; Linux Chromium sistem kütüphaneleri gerekir. `FRAME_URL=file:///tam/yol/web/index.html node scripts/web-smoke.mjs` doğrudan dosya testidir. Mock Gemini başarı/kota yanıtları test edilir; gerçek Gemini API ve gerçek tablet performansı ayrıca doğrulanmalıdır.
