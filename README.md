# Frame — Web Video Atölyesi

**Yeni:** Tabletten kullanılabilen, cihazda render yapan web uygulaması `web/` dizininde.

**[Web uygulamasını indir — v1.1.0](https://github.com/hamudenes9-debug/Claudevideo/releases/tag/v1.1.0)** · [Hızlı başlangıç](WEB_QUICKSTART.md)

Bu ZIP bir Claude skill’i değildir; çıkarıp yerel sunucuyla veya HTTPS statik barındırmayla açılır.

```sh
python3 web/serve.py --port 3000
```

Fotoğraf/logo/ses yükleme, beş sahneli 16:9 önizleme, sahne düzenleme, 720p/1080p video kaydı (tarayıcıya göre WebM/MP4), beş PNG, ElevenLabs metni ve proje JSON'u desteklenir. İsteğe bağlı Gemini planlaması kendi API anahtarınızı gerektirir; ücret/kota hesaba bağlıdır. Anahtarsız yerel şablon kullanılabilir. [Web uygulaması kullanım ve gizlilik notları](web/README.md).

---

# Brand Video Skill (Claude için)

Claude'a **16:9 marka videosunu kod çalıştırarak üretme** iş akışı kazandıran Türkçe skill. Ücretsiz yerel Pillow + FFmpeg motoru; API anahtarı gerektirmez.

## Çıktılar

- 1920×1080 MP4; özgün geometrik/temsili mekân çizimleri veya fotoğraflarda yakınlaşma animasyonu
- Videodan farklı zamanlarda alınmış **5 PNG kare**
- Seslendirme metni ve **ElevenLabs için yönlendirme promptu**
- Logo, marka renkleri, Türkçe fontlar ve isteğe bağlı ses dosyası
- Claude'un yapacağı fotoğraf/marka/mekân analizini ve kalite kontrolünü tanımlayan SKILL.md

Bu bir üretken fotogerçekçi video modeli değildir. Fotoğraf analizi Claude tarafından, render Python tarafından yapılır. Örnek sessizdir. ElevenLabs otomasyonu/aboneliği dahil değildir; harici servis veya Claude hesabının ücretsiz olacağı garanti edilmez.

## Claude'a yükleme

**v1.0.1 düzeltmesi:** Eski `claude-video` skill adı ayrılmış `claude` sözcüğü nedeniyle reddediliyordu. Yeni ad `brand-video`. Eski ZIP yerine aşağıdaki yeni kurulum ZIP'ini kullanın. **Demo ZIP'i yüklemeyin.**


[Releases](https://github.com/hamudenes9-debug/Claudevideo/releases) sayfasından `brand-video-v1.0.1.zip` indirin. Skill/dosya yüklemesi ve kod çalıştırma destekleyen Claude ortamınızda özel skill olarak yükleyin. Arayüz, plan ve yönetici ayarlarına bağlı olarak skill desteği değişebilir. ZIP'in kökünde `brand-video/SKILL.md` bulunur. Manuel kurulum için bu klasörü ortamınızın skill dizinine kopyalayın. Çalıştırma izni olmayan sohbet yalnızca plan üretebilir.

Örnek istek:

> Bu marka logosu ve mekân fotoğraflarıyla 20 saniyelik 16:9 tanıtım videosu oluştur. Önce renkleri, tipografiyi ve mekânı analiz et. Fotoğrafları bozmadan animasyon yap, gereken çizimleri kodla oluştur. MP4, videodan 5 kare, anlatım metni ve ElevenLabs promptunu teslim et. Ücretli servis kullanma.

## Yerel kullanım (Python 3.10+)

```sh
python -m venv .venv
.venv/bin/python -m pip install -r skills/brand-video/requirements.txt
.venv/bin/python skills/brand-video/scripts/render.py render skills/brand-video/examples/brand-demo.json --out output/demo
.venv/bin/python -m unittest discover -s tests -v
```

Windows'ta `.venv/bin/python` yerine `.venv\Scripts\python.exe` kullanın. Linux'ta DejaVu Sans yoksa plana `font` ve `font_bold` TTF yollarını ekleyin. İlk paket kurulumu internet ister; sonrasında render yereldir. imageio-ffmpeg desteklenmeyen platformlarda sistem FFmpeg kurun (PATH üzerinde `ffmpeg`).

Kişiselleştirmek için örnek JSON'u kopyalayın; `photo`, `logo`, `font`, `font_bold`, `audio` yolları JSON konumuna göredir. [Plan formatı](skills/brand-video/references/plan-format.md) ve [iş akışı](skills/brand-video/references/workflow.md). Çıktı klasörü aynı adlarla üzerine yazılır; farklı projelere ayrı klasör seçin.

## Ses

Varsayılan video sessizdir. ElevenLabs'te yalnızca `narration.txt` metnini okutun; `elevenlabs-prompt.txt` ses yönlendirmesidir. Kullanım kotası ve lisansı servisten kontrol edin. İzinli ses dosyasını JSON'a `"audio": "voice.wav"` olarak ekleyip yeniden çalıştırın. Kısa ses sessizlikle tamamlanır, uzun ses kesilir; teslimden önce dinleyin. Ücretsiz seçenek kendi kaydınız veya kurulu yerel TTS'dir.

## Sınırlar ve lisans

Metin taşıyorsa renderer hata verir; kısa metin/font boyutu ile düzeltin. Mekân çizimi stilizedir; gerçek mimari doğruluğu için referans fotoğrafı veya özel çizim kodu gerekir. Hazır motor kesmeler, yakınlaşma ve geometrik hareket sunar, gelişmiş karakter animasyonu sunmaz. CPU ile çalışır; önce düşük çözünürlükte prova önerilir. Kaynak kod MIT; kullanıcı varlıkları, fontlar ve bağımlılıklar kendi lisanslarına tabidir. FFmpeg dağıtım/lisans bilgileri için [imageio-ffmpeg](https://github.com/imageio/imageio-ffmpeg) belgelerine bakın; bu release FFmpeg ikilisi içermez.
