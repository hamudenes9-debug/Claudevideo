# Claude Video Skill

Claude'a **16:9 marka videosunu kod çalıştırarak üretme** iş akışı kazandıran Türkçe skill. Ücretsiz yerel Pillow + FFmpeg motoru; API anahtarı gerektirmez.

## Çıktılar

- 1920×1080 MP4; özgün geometrik/temsili mekân çizimleri veya fotoğraflarda yakınlaşma animasyonu
- Videodan farklı zamanlarda alınmış **5 PNG kare**
- Seslendirme metni ve **ElevenLabs için yönlendirme promptu**
- Logo, marka renkleri, Türkçe fontlar ve isteğe bağlı ses dosyası
- Claude'un yapacağı fotoğraf/marka/mekân analizini ve kalite kontrolünü tanımlayan SKILL.md

Bu bir üretken fotogerçekçi video modeli değildir. Fotoğraf analizi Claude tarafından, render Python tarafından yapılır. Örnek sessizdir. ElevenLabs otomasyonu/aboneliği dahil değildir; harici servis veya Claude hesabının ücretsiz olacağı garanti edilmez.

## Claude'a yükleme

[Releases](https://github.com/hamudenes9-debug/Claudevideo/releases) sayfasından `claude-video-v1.0.0.zip` indirin. Skill/dosya yüklemesi ve kod çalıştırma destekleyen Claude ortamınızda özel skill olarak yükleyin. Arayüz, plan ve yönetici ayarlarına bağlı olarak skill desteği değişebilir. ZIP'in kökünde `claude-video/SKILL.md` bulunur. Manuel kurulum için bu klasörü ortamınızın skill dizinine kopyalayın. Çalıştırma izni olmayan sohbet yalnızca plan üretebilir.

Örnek istek:

> Bu marka logosu ve mekân fotoğraflarıyla 20 saniyelik 16:9 tanıtım videosu oluştur. Önce renkleri, tipografiyi ve mekânı analiz et. Fotoğrafları bozmadan animasyon yap, gereken çizimleri kodla oluştur. MP4, videodan 5 kare, anlatım metni ve ElevenLabs promptunu teslim et. Ücretli servis kullanma.

## Yerel kullanım (Python 3.10+)

```sh
python -m venv .venv
.venv/bin/python -m pip install -r skills/claude-video/requirements.txt
.venv/bin/python skills/claude-video/scripts/render.py render skills/claude-video/examples/brand-demo.json --out output/demo
.venv/bin/python -m unittest discover -s tests -v
```

Windows'ta `.venv/bin/python` yerine `.venv\Scripts\python.exe` kullanın. Linux'ta DejaVu Sans yoksa plana `font` ve `font_bold` TTF yollarını ekleyin. İlk paket kurulumu internet ister; sonrasında render yereldir. imageio-ffmpeg desteklenmeyen platformlarda sistem FFmpeg kurun (PATH üzerinde `ffmpeg`).

Kişiselleştirmek için örnek JSON'u kopyalayın; `photo`, `logo`, `font`, `font_bold`, `audio` yolları JSON konumuna göredir. [Plan formatı](skills/claude-video/references/plan-format.md) ve [iş akışı](skills/claude-video/references/workflow.md). Çıktı klasörü aynı adlarla üzerine yazılır; farklı projelere ayrı klasör seçin.

## Ses

Varsayılan video sessizdir. ElevenLabs'te yalnızca `narration.txt` metnini okutun; `elevenlabs-prompt.txt` ses yönlendirmesidir. Kullanım kotası ve lisansı servisten kontrol edin. İzinli ses dosyasını JSON'a `"audio": "voice.wav"` olarak ekleyip yeniden çalıştırın. Kısa ses sessizlikle tamamlanır, uzun ses kesilir; teslimden önce dinleyin. Ücretsiz seçenek kendi kaydınız veya kurulu yerel TTS'dir.

## Sınırlar ve lisans

Metin taşıyorsa renderer hata verir; kısa metin/font boyutu ile düzeltin. Mekân çizimi stilizedir; gerçek mimari doğruluğu için referans fotoğrafı veya özel çizim kodu gerekir. Hazır motor kesmeler, yakınlaşma ve geometrik hareket sunar, gelişmiş karakter animasyonu sunmaz. CPU ile çalışır; önce düşük çözünürlükte prova önerilir. Kaynak kod MIT; kullanıcı varlıkları, fontlar ve bağımlılıklar kendi lisanslarına tabidir. FFmpeg dağıtım/lisans bilgileri için [imageio-ffmpeg](https://github.com/imageio/imageio-ffmpeg) belgelerine bakın; bu release FFmpeg ikilisi içermez.
