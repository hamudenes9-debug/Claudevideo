export const DEFAULT_SCENES = [
  {
    title: "Mekânın ötesinde,\nbir his.",
    subtitle: "Düşünülmüş detaylar. Yaşayan mekânlar.",
    narration: "Bir mekân, yalnızca dört duvardan ibaret değildir.",
    photo: -1,
  },
  {
    title: "Işığa yer aç.",
    subtitle: "Doğal olanla yeniden buluş.",
    narration: "Doğal ışık ve sıcak malzemelerle yeni bir başlangıç.",
    photo: -1,
  },
  {
    title: "Her detayın\nbir anlamı var.",
    subtitle: "Sade, dengeli, sana ait.",
    narration: "Her detayda dengeyi, her dokuda karakteri keşfet.",
    photo: -1,
  },
  {
    title: "Birlikte hayal et.",
    subtitle: "Fikirden yaşama uzanan bir yolculuk.",
    narration: "Birlikte düşünelim, birlikte tasarlayalım.",
    photo: -1,
  },
  {
    title: "Yeni hikâyen\nburada başlasın.",
    subtitle: "Güzel bir başlangıca.",
    narration: "Senin hikâyen burada başlasın.",
    photo: -1,
  },
];
export function validatePlan(raw, photoCount = 0) {
  if (
    !raw ||
    typeof raw !== "object" ||
    !Array.isArray(raw.scenes) ||
    raw.scenes.length !== 5
  )
    throw new Error("Plan tam olarak 5 sahne içermeli.");
  const text = (v, max, required = false) => {
    if (typeof v !== "string" || v.length > max || (required && !v.trim()))
      throw new Error("Plan metinleri eksik veya çok uzun.");
    return v.trim();
  };
  return {
    brand: text(raw.brand ?? "FORMA STUDIO", 45, true),
    brief: text(raw.brief ?? "", 2000),
    accent: /^#[0-9a-f]{6}$/i.test(raw.accent) ? raw.accent : "#d5ad72",
    style: ["editorial", "bold", "minimal"].includes(raw.style)
      ? raw.style
      : "editorial",
    duration: [15, 20, 30].includes(Number(raw.duration))
      ? Number(raw.duration)
      : 20,
    scenes: raw.scenes.map((s) => {
      if (!s || typeof s !== "object") throw new Error("Geçersiz sahne.");
      return {
        title: text(s.title, 90, true),
        subtitle: text(s.subtitle ?? "", 140),
        narration: text(s.narration ?? "", 350),
        photo:
          Number.isInteger(s.photo) && s.photo >= 0 && s.photo < photoCount
            ? s.photo
            : -1,
      };
    }),
  };
}
export function localPlan(brand, brief, style, duration, accent, photoCount) {
  return validatePlan(
    {
      brand,
      brief,
      style,
      duration,
      accent,
      scenes: DEFAULT_SCENES.map((s, i) => ({
        ...s,
        photo: photoCount ? i % photoCount : -1,
      })),
    },
    photoCount,
  );
}
export function elevenlabsText(plan) {
  return `SESLENDİRME YÖNLENDİRMESİ (bu bölümü okutma)\nDil: Türkçe. Ton: doğal, sıcak ve sakin. Marka: ${plan.brand}. Hedef video süresi: ${plan.duration} saniye. Özel isimlerin telaffuzunu doğrula. Süreye sığması için okuma hızını kontrol et.\n\nOKUNACAK METİN\n${plan.scenes
    .map((s) => s.narration)
    .filter(Boolean)
    .join(
      "\n\n",
    )}\n\nNot: Ses otomatik üretilmedi. ElevenLabs ayrı hizmettir; kendi kotası/lisansı geçerlidir.\n`;
}
