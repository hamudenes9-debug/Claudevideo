# Claude Video v1.0.0

Claude için Türkçe, kod çalıştırabilen ortamlarda kullanılmak üzere hazırlanmış 16:9 video skill'i.

## İndirilecek dosyalar
- **claude-video-v1.0.0.zip**: Claude'a yüklenecek skill, Python renderer, örnek plan ve rehberler.
- **claude-video-demo-v1.0.0.zip**: 20 saniyelik 1920×1080 / 24 fps **sessiz** örnek MP4, videodan beş PNG, seslendirme metni, ElevenLabs promptu ve manifest.
- **SHA256SUMS.txt**: ZIP dosyalarının sağlama toplamları.

## Özellikler
- Ücretsiz yerel Pillow + FFmpeg render; ücretli API veya anahtar gerektirmez.
- Fotoğrafta yakınlaşma, özgün geometrik çizim, temsili oda, logo ve Türkçe tipografi.
- Marka/fotoğraf analizi, mekân sürekliliği ve font seçimi için Claude iş akışı.
- Kullanıcının izinli ses kaydını videoya ekleme; ayrıca ElevenLabs yönlendirme metni.

## Doğrulama
Üç otomatik test geçti: geçersiz plan kontrolü, Türkçe glif/metin taşması, fotoğraf+logo+sesli MP4 render ve beş kare çıkarma. Sesli test videosu FFmpeg ile tamamen decode edildi. 1080p demo üretildi; beş karesi görsel olarak incelendi, başlıklar ve Türkçe karakterler okunur. Demo için marka referansı verilmediği için marka ve mekân örnektir.

## Kurulum ve sınırlar
ZIP'i özel skill destekleyen Claude ortamınıza yükleyin. Python 3.10+, bağımlılık kurulumu ve komut çalıştırma izni gerekir. README'deki yerel kullanım adımlarını da kullanabilirsiniz. Claude arayüzüne kurulum bu sandbox'ta denenmedi; hesap ve ortam yeteneklerine bağlıdır.

Fotoğraf analizi Claude tarafından yapılır; Python motoru görüntü tanıma veya fotogerçekçi üretken video modeli değildir. Mekân çizimi temsilidir. Varsayılan ses yoktur. ElevenLabs çağrılmaz, ücretsiz kotası garanti edilmez. Claude hesabı/harici servis maliyetleri dahil değildir. Kullanıcı varlıkları ve fontlar için kullanım hakkı gerekir.
