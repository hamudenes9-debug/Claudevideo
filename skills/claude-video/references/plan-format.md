# Plan biçimi

UTF-8 JSON. Varlık yolları JSON dosyasının klasörüne göredir; mutlak yollar da desteklenir. Yalnızca güvendiğiniz yerel dosyaları kullanın.

| Alan | Varsayılan / anlam |
|---|---|
| size | [1920,1080]; çift sayılı 16:9; genişlik 320–3840 |
| fps | 24; 1–60 |
| brand | Üst bölüm marka adı; kısa tutun |
| background, accent | Pillow renk değeri, ör. #101c29 |
| font, font_bold | İsteğe bağlı lisanslı TTF yolları |
| title_size | 1920 genişlikte başlık pikseli; varsayılan 80 |
| logo | İsteğe bağlı şeffaf PNG; oran korunur |
| audio | İsteğe bağlı kullanıcı kaydı WAV/MP3; AAC olarak eklenir |
| scenes | 1–100 sahne, toplam en fazla 600 saniye |
| scenes[].duration | 0.5–60 saniye; varsayılan 4; fps'e yuvarlanır |
| scenes[].title, subtitle | Kısa başlık ve alt metin; taşma hata verir |
| scenes[].narration | Seslendirme metni; otomatik okunmaz |
| scenes[].drawing | abstract veya room; varsayılan abstract |
| scenes[].photo | Yerel resim; çizimin yerine kullanılır, merkezden kırpılır |

Fotoğraflarda %58 koyu renk katmanı metni okunur tutar. Kritik ürün/insan merkez kırpmasına sığmıyorsa renderer'ın kadrajını referansa göre değiştirin. Logo ve marka adı çok uzunsa görsel kalite kontrolünde küçültün. 4K render CPU/RAM açısından pahalıdır; önce 640×360 prova yapın.

Var olan videodan 5 kare:

```sh
.venv/bin/python scripts/render.py frames existing.mp4 --duration 20 --out output/frames
```

`--duration` gerçek video süresi olmalıdır. Kareler sürenin %10, %30, %50, %70 ve %90 noktalarından alınır. Araç mevcut çıktıları aynı isimle ezer; farklı çıktı klasörü kullanın.
