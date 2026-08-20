/** Add a language here, then add src/messages/{code}.json (can be a partial overlay). */
export const localeCatalog = [
  { code: "en", label: "English", english: "English", short: "EN", region: "gb", dir: "ltr" },
  { code: "th", label: "ไทย", english: "Thai", short: "TH", region: "th", dir: "ltr" },
  { code: "zh", label: "中文", english: "Chinese", short: "中文", region: "cn", dir: "ltr" },
  { code: "ja", label: "日本語", english: "Japanese", short: "日本語", region: "jp", dir: "ltr" },
  { code: "ko", label: "한국어", english: "Korean", short: "한국어", region: "kr", dir: "ltr" },
  { code: "ru", label: "Русский", english: "Russian", short: "RU", region: "ru", dir: "ltr" },
  { code: "de", label: "Deutsch", english: "German", short: "DE", region: "de", dir: "ltr" },
  { code: "fr", label: "Français", english: "French", short: "FR", region: "fr", dir: "ltr" },
  { code: "it", label: "Italiano", english: "Italian", short: "IT", region: "it", dir: "ltr" },
  { code: "es", label: "Español", english: "Spanish", short: "ES", region: "es", dir: "ltr" },
  { code: "pt", label: "Português", english: "Portuguese", short: "PT", region: "pt", dir: "ltr" },
  { code: "ar", label: "العربية", english: "Arabic", short: "AR", region: "sa", dir: "rtl" },
  { code: "hi", label: "हिन्दी", english: "Hindi", short: "HI", region: "in", dir: "ltr" },
  { code: "ms", label: "Melayu", english: "Malay", short: "MS", region: "my", dir: "ltr" },
  { code: "id", label: "Indonesia", english: "Indonesian", short: "ID", region: "id", dir: "ltr" },
  { code: "vi", label: "Tiếng Việt", english: "Vietnamese", short: "VI", region: "vn", dir: "ltr" },
  { code: "km", label: "ខ្មែរ", english: "Khmer", short: "KM", region: "kh", dir: "ltr" },
  { code: "lo", label: "ລາວ", english: "Lao", short: "LO", region: "la", dir: "ltr" },
  { code: "my", label: "မြန်မာ", english: "Burmese", short: "MY", region: "mm", dir: "ltr" },
  { code: "tl", label: "Filipino", english: "Filipino", short: "TL", region: "ph", dir: "ltr" },
  { code: "sv", label: "Svenska", english: "Swedish", short: "SV", region: "se", dir: "ltr" },
  { code: "nl", label: "Nederlands", english: "Dutch", short: "NL", region: "nl", dir: "ltr" },
  { code: "pl", label: "Polski", english: "Polish", short: "PL", region: "pl", dir: "ltr" },
  { code: "uk", label: "Українська", english: "Ukrainian", short: "UK", region: "ua", dir: "ltr" },
  { code: "tr", label: "Türkçe", english: "Turkish", short: "TR", region: "tr", dir: "ltr" },
  { code: "cs", label: "Čeština", english: "Czech", short: "CS", region: "cz", dir: "ltr" },
  { code: "el", label: "Ελληνικά", english: "Greek", short: "EL", region: "gr", dir: "ltr" },
  { code: "fi", label: "Suomi", english: "Finnish", short: "FI", region: "fi", dir: "ltr" },
  { code: "no", label: "Norsk", english: "Norwegian", short: "NO", region: "no", dir: "ltr" },
  { code: "da", label: "Dansk", english: "Danish", short: "DA", region: "dk", dir: "ltr" },
  { code: "ro", label: "Română", english: "Romanian", short: "RO", region: "ro", dir: "ltr" },
  { code: "hu", label: "Magyar", english: "Hungarian", short: "HU", region: "hu", dir: "ltr" },
  { code: "he", label: "עברית", english: "Hebrew", short: "HE", region: "il", dir: "rtl" },
  { code: "fa", label: "فارسی", english: "Persian", short: "FA", region: "ir", dir: "rtl" },
  { code: "bn", label: "বাংলা", english: "Bengali", short: "BN", region: "bd", dir: "ltr" },
] as const;

export type AppLocale = (typeof localeCatalog)[number]["code"];

export const localeCodes = localeCatalog.map((item) => item.code) as [
  AppLocale,
  ...AppLocale[],
];

export const localeLabels = Object.fromEntries(
  localeCatalog.map((item) => [item.code, item.label])
) as Record<AppLocale, string>;

export const localeDateCodes: Record<AppLocale, string> = {
  en: "en-GB",
  th: "th-TH",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
  pt: "pt-PT",
  ar: "ar-SA",
  hi: "hi-IN",
  ms: "ms-MY",
  id: "id-ID",
  vi: "vi-VN",
  km: "km-KH",
  lo: "lo-LA",
  my: "my-MM",
  tl: "fil-PH",
  sv: "sv-SE",
  nl: "nl-NL",
  pl: "pl-PL",
  uk: "uk-UA",
  tr: "tr-TR",
  cs: "cs-CZ",
  el: "el-GR",
  fi: "fi-FI",
  no: "nb-NO",
  da: "da-DK",
  ro: "ro-RO",
  hu: "hu-HU",
  he: "he-IL",
  fa: "fa-IR",
  bn: "bn-BD",
};

export function getLocaleMeta(code: string) {
  return localeCatalog.find((item) => item.code === code);
}

export function getDateLocale(code: string) {
  return localeDateCodes[code as AppLocale] ?? "en-GB";
}

export function matchesLocaleQuery(
  item: (typeof localeCatalog)[number],
  query: string
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    item.code.toLowerCase().includes(q) ||
    item.label.toLowerCase().includes(q) ||
    item.english.toLowerCase().includes(q) ||
    item.short.toLowerCase().includes(q)
  );
}
