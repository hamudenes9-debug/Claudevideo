# Frame Web v1.1.0 — başlangıç

**Bu bir web uygulamasıdır. ZIP'i Claude'un skill/eklenti ekranına yüklemeyin.**

## Windows

1. `frame-web-v1.1.0.zip` dosyasını tamamen çıkarın.
2. Bilgisayarda Python 3.10 veya üzeri kurulu olmalı. Başka Python paketi, npm veya API anahtarı yerel kullanım için gerekmez.
3. Çıkardığınız `frame-web` klasöründeki `BASLAT.bat` dosyasını çalıştırın.
4. Sunucu açıldığında tarayıcıda **http://localhost:3000** adresine gidin. Komut penceresini açık tutun; kapatmak için Ctrl+C kullanın.

## macOS / Linux

ZIP'i çıkarın. `frame-web` klasöründe terminal açıp `sh baslat.sh` çalıştırın. Python 3 gerekir. Tarayıcıda http://localhost:3000 adresini açın.

## Tablet

- Aynı güvenilir Wi-Fi ağındaki bilgisayarda sunucuyu çalıştırın. Tablette `http://BILGISAYARIN-YEREL-IP-ADRESI:3000` adresini açabilirsiniz. Güvenlik duvarında yalnızca özel ağınıza izin verin. Bilgisayar sadece dosyaları sunar; video tableti açtığınız tarayıcıda oluşturulur.
- Alternatif: ZIP içindeki `web/` klasörünü HTTPS destekli bir statik site barındırıcısına yayınlayın. Bu release otomatik kalıcı bir internet sitesi kurmaz.
- Dosyayı tablete indirmek tek başına uygulamayı çalıştırmaz. ES modülleri nedeniyle index.html dosyasına dosya yöneticisinden dokunmak yerine HTTP(S) üzerinden açın.
- Video kaydı tarayıcı/cihaza bağlıdır. HTTPS veya localhost önerilir; HTTP yerel ağda bazı tarayıcı özellikleri çalışmayabilir. Önce kısa bir kayıtla deneyin.

## Başlangıç akışı

Marka adı ve görselleri ekleyin → yerel sahne planı oluşturun → sahne başlıklarını düzenleyin → önizleyin → videoyu indirin. Varsayılan video sessizdir; isterseniz ses dosyası ekleyin. 720p ile başlayın. Kayıt süresince ekranı ve sekmeyi açık tutun.

Gemini analizi isteğe bağlıdır. Kendi API anahtarınızı uygulamadaki parola alanına girin; sohbette paylaşmayın. API kotası/ücreti hesabınıza aittir. Görseller ve brief ancak onayınızla Google'a gönderilir. Anahtar projeye veya diske kaydedilmez.

Proje JSON'u yalnızca sahne planını saklar; fotoğraf/logo/ses dosyalarını dahil etmez. Sayfayı yenilemeden önce kaydedin. Ayrıntılar için `web/README.md` dosyasını okuyun.

## Çıktılar ve sınırlar

- 16:9, 720p veya 1080p; tarayıcıya göre WebM veya MP4. MP4 her cihazda garanti edilmez.
- Beş PNG, sahnelerin ortasından canlı renderer ile hazırlanır; mevcut video dosyasından çıkarılmaz. Çoklu indirme izni gerekebilir.
- ElevenLabs için TXT; otomatik seslendirme veya ElevenLabs bağlantısı yoktur.
- Yerel plan şablondur; fotoğrafları anlamaz. Gemini planı ise gönderilen görsellerin analizini kullanır.
- Sunucu geliştirme/yerel kullanım içindir; genel internete doğrudan açmayın. Üretim için HTTPS statik barındırma ve uygun güvenlik yapılandırması kullanın.
