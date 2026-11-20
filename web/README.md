# Frame — yerel web video atölyesi

Türkçe, tablet uyumlu, vanilla HTML/CSS/JavaScript uygulaması. Build veya npm kurulumu gerektirmez.

## Başlat

Depo kökünde `python3 web/serve.py --port 3000` çalıştır. Tarayıcıda sunucunun adresini aç. Statik dosyalar `web/` dizininden sunulur; skill dosyaları, API anahtarları veya Python renderer sunulmaz. İnternetten erişimde HTTPS kullanın. Geliştirme sunucusu kimlik doğrulama içermez; genel kullanıma açılacak üretim sunucusu değildir.

## Kullanım

1. Marka, brief, görsel dil, renk ve 15/20/30 saniye süre seç.
2. En fazla 8 fotoğraf ekle. İşleme sırasında en uzun kenar 1600px'e küçültülür; kaynak dosya değiştirilmez. Fotoğraflar merkezden kırpılarak yakınlaştırılır. Logo ve isteğe bağlı ses kaydı ekleyebilirsin.
3. **Yerel sahne planı** sabit beş sahnelik örnek metin kullanır; brief veya fotoğraf analizi yapmaz. Başlıkları kendin düzenle veya Gemini kullan.
4. Sahne kartını seçerek başlık, alt metin, anlatım ve görsel eşleşmesini düzenle. Başlıklar alana sığmak için küçültülür; çok uzun sözcüklerde kısaltma olabilir. Önizlemede kontrol et.
5. 720p (önerilen) veya 1080p seçip videoyu oluştur. Kayıt gerçek zamanlıdır; sekmeyi açık tut. Arka plana geçiş kaydı iptal eder. Ekran kilidi engeli tarayıcı iznine bağlıdır.
6. WebM veya destekleniyorsa MP4 indir. İndirdiğin dosyayı oynatarak doğrula. Her tarayıcı video kaydı desteklemez; bu durumda kayıt düğmesi pasif olur. MP4'e sunucu üzerinde dönüştürme yapılmaz.

## Ses ve beş kare

Önizleme sessizdir. Yüklenen ses, Web Audio üzerinden dışa aktarılan kayda eklenir; kısa ses bitince sessizlik olur, uzun ses video sonunda kesilir. Otomatik konuşma/TTS veya ses klonlama yok. ElevenLabs butonu okuma metni ve ayrı yönlendirme içeren TXT indirir, servise istek yapmaz.

Beş PNG, **canlı sahne renderer'ının her sahnenin orta anından** üretilir; yüklenmiş/önceden render edilmiş bir video dosyasından çıkarılmaz. Tarayıcı çoklu indirmeye izin isteyebilir. Python skill'indeki `frames` komutu, gerçek MP4'ten kare çıkarmak için kullanılabilir.

## Gemini ve gizlilik

- İsteğe bağlı bölümde kendi anahtarını ve erişebildiğin modeli gir. Varsayılan model adı `gemini-2.5-flash`; erişim hesabına ve servise bağlıdır, garanti edilmez.
- İstek öncesi açık onay alınır. Brief/marka ve küçültülmüş fotoğraflar doğrudan Google Gemini API'ye gönderilir. Logo/ses gönderilmez. Kullanım kotası/faturalandırma Google hesabına aittir.
- Anahtar yalnızca parola alanında bu sekmenin belleğinde tutulur. localStorage, proje JSON'u veya sunucuya yazılmaz. Kendi cihazında kullan; üretim uygulamalarında kişisel anahtar yerine kimlik doğrulamalı bir backend/key vault gerekir. Kod içine anahtar gömmeyin.
- Arayüz, API'den **yalnızca doğrulanan JSON sahne planı** kabul eder. Kod çalıştırma/eval veya modelden gelen HTML'yi ekleme yoktur. Görsellerdeki gömülü talimatların uygulanmaması promptta belirtilir.
- API yokken uygulama çalışır. API isteği dışındaki render yereldir. Çevrimdışı açılabilen PWA/service worker bu sürümde yoktur; açık sekmede yerel düzenleme API'ye ihtiyaç duymaz.
- Projeyi kaydet/aç yalnızca planı taşır. Fotoğraf, logo, ses ve anahtar kaydedilmez; sayfayı yenilemeden önce planı indir. Otomatik kaydetme yoktur.

## Testler

`npm test` plan doğrulama testlerini çalıştırır. `node --check web/app.js` sözdizimini denetler.

Opsiyonel tarayıcı testi: `npm install --no-save @playwright/test @sparticuz/chromium`, ardından sunucu açıkken `node scripts/web-smoke.mjs`. Linux Chromium sistem kütüphaneleri gerekir. Test masaüstü/mobil yerleşim, yükleme, sahne düzenleme, proje indirme, gerçek video kaydı ve mock Gemini yanıtlarını kontrol eder. Gerçek API çağrısı/gerçek tablet performansı ayrıca doğrulanmalıdır.
