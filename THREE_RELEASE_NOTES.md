# Frame Three.js v1.2.0 — tek HTML

**İndirilecek uygulama: `frame-three-v1.2.0.html`. ZIP veya Claude skill'i değil.**

İndirip güncel tarayıcıda aç. Three.js, CSS, JavaScript ve lisanslar dosyanın içindedir. CDN, Python, npm veya harici dosya gerekmez. Kaynak geliştirmede modüller korunmuştur; son kullanıcıya verilen uygulama tek HTML'dir.

## Yenilikler
- Three.js WebGL 2 motoruyla gerçek 3B oda, mobilyalar, ışıklar ve perspektif kamera hareketi.
- Fotoğraflarda Three.js dokulu düzlem üzerinde yakınlaşma; fotoğraftan 3B rekonstrüksiyon yapılmaz.
- Tek GPU bağlamı, sınırlı çözünürlük ve kaldırılan fotoğraflar için GPU doku temizliği.
- Marka/logo/ses, beş sahne, 16:9 önizleme, 720p/1080p, video kaydı, PNG, ElevenLabs metni ve proje JSON'u korunuyor.
- İsteğe bağlı Gemini API planlama. Ücret/kota hesaba bağlı; gerçek API çağrısı doğrulanmadı.

## Doğrulama
Altı otomatik JavaScript testi geçti. Headless Chromium'da hem HTTP üzerinden hem doğrudan `file://` ile sahne düzenleme, fotoğraf yükleme, proje indirme, mobil taşma kontrolü, sesli video kaydı ve mock Gemini akışları denendi. Tek HTML açılışında harici dosya isteği yapılmadığı ve gerçek 3B sahnenin çizildiği kontrol edildi. Gerçek tablet performansı ayrıca denenmelidir.

## Sınırlar
WebGL 2 gerekir. Tarayıcı destekliyorsa MP4, aksi halde WebM. Kayıt sırasında sekme açık kalmalı. Video önizlemesi sessiz; yüklenen ses dışa aktarmada eklenir. Beş kare canlı renderer'dan hazırlanır. Proje JSON'u medyayı/anahtarı içermez. Yerel şablon analiz yapmaz. Yerel dosyadan açma/API/indirme tablet tarayıcısında kısıtlanırsa aynı HTML'yi HTTPS üzerinde kullanın. Gemini için internet ve kendi anahtarınız gerekir; yerel render çevrimdışı çalışır.
