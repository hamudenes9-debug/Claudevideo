# Frame Web v1.1.0 — Tablet uyumlu video atölyesi

**Yeni web uygulaması. Claude skill yüklemesi gerektirmez.** Önceki skill sürümleri ayrı release'lerde duruyor.

## İndir ve çalıştır

**`frame-web-v1.1.0.zip`** dosyasını indirin ve çıkarın. Windows'ta Python 3.10+ kuruluysa `BASLAT.bat` dosyasını çalıştırıp tarayıcıda http://localhost:3000 adresini açın. macOS/Linux'ta `sh baslat.sh` kullanın. Python bağımlılığı veya npm kurulumu gerekmez.

Tabletten kullanım için aynı ağdaki bilgisayar sunucusuna bağlanabilir veya `web/` dizinini HTTPS statik site olarak yayınlayabilirsiniz. ZIP'i tablete indirmek ya da Claude'a yüklemek uygulamayı başlatmaz. Ayrıntılı Türkçe rehber ZIP'teki `BASLANGIC.md` dosyasındadır.

## İçerik

- Türkçe, tablet/mobil uyumlu arayüz; marka, brief, renk ve görsel dil seçimi.
- Fotoğraf/logo/ses yükleme; beş sahneli, düzenlenebilir 16:9 canlı önizleme.
- Yerel Canvas animasyonu ve tarayıcıda gerçek zamanlı video kaydı; 720p/1080p.
- Tarayıcı desteğine göre WebM veya MP4; beş PNG, ElevenLabs metni ve proje JSON'u indirme.
- İsteğe bağlı Gemini API ile görsel analizi ve JSON sahne planı. Model kodu çalıştırılmaz.
- Windows/macOS/Linux başlatma dosyaları, kaynak kodu ve MIT lisansı.
- `frame-web-SHA256SUMS.txt`: ZIP sağlama toplamı.

## Doğrulama ve sınırlar

Dört JavaScript plan testi ve mevcut dört Python testi geçti. Headless Chromium'da fotoğraf yükleme, sahne düzenleme, proje indirme, mobil taşma kontrolü, sesli video dışa aktarma ve mock Gemini başarı/kota hata akışları denendi. Üretilen 1280×720 WebM + Opus ses FFmpeg ile decode edildi. Gerçek tablet performansı, Windows başlatma dosyası ve gerçek Gemini API çağrısı bu ortamda test edilmedi.

Yerel şablon görsel analizi yapmaz; Gemini kendi anahtarınızı gerektirir, API kotası/ücreti hesabınıza aittir. Anahtar kaydedilmez. Gemini dışında render cihazda yapılır. Kayıtta sekme açık kalmalı; arka plana geçiş kaydı iptal eder. Önizleme sessizdir; yüklenen ses dışa aktarmada eklenir. Proje JSON'u medyayı içermez. Beş PNG mevcut bir MP4'ten değil canlı renderer'dan alınır. Bu sürüm çevrimdışı PWA veya otomatik barındırılan kalıcı bir site değildir.
