import { writeFileSync, existsSync, readFileSync } from "node:fs";

function deepMerge(base, overlay) {
  if (!overlay || typeof overlay !== "object" || Array.isArray(overlay)) return overlay ?? base;
  if (!base || typeof base !== "object" || Array.isArray(base)) return overlay;
  const next = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    next[key] =
      typeof next[key] === "object" && next[key] && !Array.isArray(next[key]) &&
      typeof value === "object" && value && !Array.isArray(value)
        ? deepMerge(next[key], value)
        : value;
  }
  return next;
}

const chrome = {
  pt: {
    LocaleSwitcher: { label: "Idioma", search: "Pesquisar idioma", empty: "Nenhum idioma correspondente" },
    Nav: { home: "Início", transfers: "Transfers", travel: "Viagem", airportTransfer: "Aeroporto", hotelTransfer: "Hotel", pierTransfer: "Cais", beachTransfer: "Praia", cityTransfer: "Cidade", attractionTransfer: "Atrações", interProvince: "Interprovíncias", fleet: "Frota", priceList: "Preços", tours: "Passeios", boatSchedules: "Horários de barco", travelInfo: "Info de viagem", articles: "Artigos", faq: "FAQ", reviews: "Avaliações", contact: "Contacto", booking: "Reserva", bookNow: "Reservar", services: "Serviços", more: "Mais", menu: "Menu" },
    MobileNav: { home: "Início", fleet: "Frota", book: "Reservar", prices: "Preços", call: "Ligar" },
    Footer: { services: "Serviços", travel: "Viagem", contact: "Contacto", rights: "All rights reserved." },
    Common: { callNow: "Ligar agora", chatOnLine: "Falar no LINE", viewAll: "Ver tudo", learnMore: "Saber mais", startBooking: "Começar reserva", allFaq: "Todas as FAQ", allReviews: "Todas as avaliações", loading: "A carregar...", book: "Reservar", explore: "Explorar", read: "Ler", min: "min", bookVehicle: "Reservar {name}", allArticles: "Todos os artigos" },
    Home: { privateTransfer: "Transfer privado", startFrom: "START", contactTitle: "Contacte-nos", contactBody: "Reserve um transfer ou peça um percurso personalizado. Telefone, LINE ou e-mail a qualquer hora.", ctaTitle: "Pronto para explorar o sul da Tailândia?", ctaBody: "Reserve agora e receba um e-Voucher com QR code de imediato.", bookNow: "Reservar" },
    PriceChecker: { title: "Consulta de preço", oneWay: "Só ida", roundTrip: "Ida e volta", from: "Partida", to: "Destino", vehicle: "Veículo", estimated: "Preço estimado", bookNow: "Reservar" },
    Booking: { title: "Reserve o seu transfer", confirmBooking: "Confirmar reserva", bankTransfer: "Transferência bancária", card: "Cartão", promptpay: "PromptPay", cash: "Dinheiro ao motorista" },
    Pages: { fleet: "A nossa frota", priceList: "Lista de preços", contact: "Contacte-nos" },
    Payment: { bankTransfer: "Transferência bancária", card: "Cartão de crédito / débito", promptpay: "PromptPay", cash: "Dinheiro ao motorista" },
  },
  hi: {
    LocaleSwitcher: { label: "भाषा", search: "भाषा खोजें", empty: "कोई भाषा नहीं मिली" },
    Nav: { home: "होम", transfers: "ट्रांसफर", travel: "यात्रा", airportTransfer: "एयरपोर्ट", hotelTransfer: "होटल", pierTransfer: "घाट", beachTransfer: "बीच", cityTransfer: "शहर", attractionTransfer: "दर्शनीय स्थल", interProvince: "अंतर-प्रांत", fleet: "फ्लीट", priceList: "मूल्य सूची", tours: "टूर", boatSchedules: "नाव समय", travelInfo: "यात्रा जानकारी", articles: "लेख", faq: "FAQ", reviews: "समीक्षा", contact: "संपर्क", booking: "बुकिंग", bookNow: "अभी बुक करें", services: "सेवाएँ", more: "और", menu: "मेनू" },
    MobileNav: { home: "होम", fleet: "फ्लीट", book: "बुक", prices: "कीमत", call: "कॉल" },
    Footer: { services: "सेवाएँ", travel: "यात्रा", contact: "संपर्क", rights: "All rights reserved." },
    Common: { callNow: "अभी कॉल करें", chatOnLine: "LINE पर चैट", viewAll: "सभी देखें", startBooking: "बुकिंग शुरू करें", book: "बुक करें", min: "मिनट", bookVehicle: "{name} बुक करें" },
    Home: { privateTransfer: "प्राइवेट ट्रांसफर", contactTitle: "संपर्क करें", ctaTitle: "दक्षिणी थाईलैंड घूमने के लिए तैयार?" },
    Booking: { title: "अपना ट्रांसफर बुक करें", confirmBooking: "बुकिंग पुष्टि करें" },
  },
  km: {
    LocaleSwitcher: { label: "ភាសា", search: "ស្វែងរកភាសា", empty: "រកមិនឃើញភាសា" },
    Nav: { home: "ទំព័រដើម", transfers: "ដឹកជញ្ជូន", travel: "ទេសចរណ៍", airportTransfer: "ព្រលានយន្តហោះ", hotelTransfer: "សណ្ឋាគារ", pierTransfer: "កំពង់ផែ", beachTransfer: "ឆ្នេរ", cityTransfer: "ទីក្រុង", attractionTransfer: "ទីតាំងទេសចរណ៍", interProvince: "ឆ្លងខេត្ត", fleet: "គ្រឿងយន្ត", priceList: "តារាងតម្លៃ", tours: "ដំណើរកម្សាន្ត", boatSchedules: "កាលវិភាគទូក", travelInfo: "ព័ត៌មានធ្វើដំណើរ", articles: "អត្ថបទ", faq: "FAQ", reviews: "មតិ", contact: "ទំនាក់ទំនង", booking: "កក់", bookNow: "កក់ឥឡូវ", services: "សេវា", more: "ច្រើនទៀត", menu: "ម៉ឺនុយ" },
    MobileNav: { home: "ដើម", fleet: "យានយន្ត", book: "កក់", prices: "តម្លៃ", call: "ហៅ" },
    Common: { callNow: "ហៅឥឡូវ", startBooking: "ចាប់ផ្តើមកក់", book: "កក់" },
    Home: { privateTransfer: "ដឹកជញ្ជូនឯកជន", contactTitle: "ទំនាក់ទំនង" },
  },
  lo: {
    LocaleSwitcher: { label: "ພາສາ", search: "ຄົ້ນຫາພາສາ", empty: "ບໍ່ພົບພາສາ" },
    Nav: { home: "ໜ້າຫຼັກ", transfers: "ຮັບສົ່ງ", travel: "ທ່ອງທ່ຽວ", airportTransfer: "ສະໜາບິນ", hotelTransfer: "ໂຮງແຮມ", pierTransfer: "ທ່າເຮືອ", beachTransfer: "ຫາດ", cityTransfer: "ເມືອງ", attractionTransfer: "ສະຖານທີ່ທ່ອງທ່ຽວ", interProvince: "ຂ້າມແຂວງ", fleet: "ລົດ", priceList: "ລາຄາ", tours: "ທัวร์", boatSchedules: "ຕາຕະລາງເຮືອ", travelInfo: "ຂໍ້ມູນການເດີນທາງ", articles: "ບົດຄວາມ", faq: "FAQ", reviews: "ຣີວິວ", contact: "ຕິດຕໍ່", booking: "ຈອງ", bookNow: "ຈອງດຽວນີ້", services: "ບໍລິການ", more: "ເພີ່ມ", menu: "ເມນູ" },
    MobileNav: { home: "ໜ້າຫຼັກ", fleet: "ລົດ", book: "ຈອງ", prices: "ລາຄາ", call: "ໂທ" },
    Common: { callNow: "ໂທດຽວນີ້", startBooking: "ເລີ່ມຈອງ", book: "ຈອງ" },
  },
  my: {
    LocaleSwitcher: { label: "ဘာသာစကား", search: "ဘာသာစကားရှာရန်", empty: "မတွေ့ပါ" },
    Nav: { home: "ပင်မ", transfers: "ပို့ဆောင်", travel: "ခရီး", airportTransfer: "လေဆိပ်", hotelTransfer: "ဟိုတယ်", pierTransfer: "ဆိပ်ကမ်း", beachTransfer: "ကမ်းခြေ", cityTransfer: "မြို့", attractionTransfer: "နေရာများ", interProvince: "ပြည်နယ်ချင်း", fleet: "ယာဉ်", priceList: "စျေးနှုန်း", tours: "ခရီးစဉ်", boatSchedules: "သင်္ဘောအချိန်", travelInfo: "ခရီးသတင်း", articles: "ဆောင်းပါး", faq: "FAQ", reviews: "သုံးသပ်ချက်", contact: "ဆက်သွယ်", booking: "ဘုکینگ", bookNow: "ယခုဘုက", services: "ဝန်ဆောင်မှု", more: "ပို", menu: "မီနူး" },
    Common: { callNow: "ယခုခေါ်", startBooking: "ဘုकिंगစတင်", book: "ဘুক" },
  },
  tl: {
    LocaleSwitcher: { label: "Wika", search: "Maghanap ng wika", empty: "Walang tumugmang wika" },
    Nav: { home: "Home", transfers: "Transfer", travel: "Biyahe", airportTransfer: "Airport", hotelTransfer: "Hotel", pierTransfer: "Pier", beachTransfer: "Beach", cityTransfer: "Lungsod", attractionTransfer: "Attraction", interProvince: "Inter-province", fleet: "Sasakyan", priceList: "Presyo", tours: "Tours", boatSchedules: "Iskedyul ng barko", travelInfo: "Travel info", articles: "Mga artikulo", faq: "FAQ", reviews: "Reviews", contact: "Contact", booking: "Booking", bookNow: "Mag-book ngayon", services: "Serbisyo", more: "More", menu: "Menu" },
    MobileNav: { home: "Home", fleet: "Fleet", book: "Book", prices: "Presyo", call: "Tawag" },
    Common: { callNow: "Tumawag ngayon", startBooking: "Simulan ang booking", book: "Mag-book" },
    Home: { privateTransfer: "Pribadong transfer", contactTitle: "Makipag-ugnayan", ctaTitle: "Handa ka na bang tuklasin ang Timog Thailand?" },
  },
  pl: {
    LocaleSwitcher: { label: "Język", search: "Szukaj języka", empty: "Brak pasującego języka" },
    Nav: { home: "Strona główna", transfers: "Transfery", travel: "Podróż", airportTransfer: "Lotnisko", hotelTransfer: "Hotel", pierTransfer: "Przystań", beachTransfer: "Plaża", cityTransfer: "Miasto", attractionTransfer: "Atrakcje", interProvince: "Międzyprowincjalny", fleet: "Flota", priceList: "Cennik", tours: "Wycieczki", boatSchedules: "Rozkład łodzi", travelInfo: "Informacje", articles: "Artykuły", faq: "FAQ", reviews: "Opinie", contact: "Kontakt", booking: "Rezerwacja", bookNow: "Rezerwuj", services: "Usługi", more: "Więcej", menu: "Menu" },
    MobileNav: { home: "Start", fleet: "Flota", book: "Rezerwuj", prices: "Ceny", call: "Zadzwoń" },
    Common: { callNow: "Zadzwoń teraz", startBooking: "Rozpocznij rezerwację", book: "Rezerwuj" },
    Home: { privateTransfer: "Prywatny transfer", contactTitle: "Kontakt", ctaTitle: "Gotowi odkrywać południową Tajlandię?" },
  },
  uk: {
    LocaleSwitcher: { label: "Мова", search: "Пошук мови", empty: "Мову не знайдено" },
    Nav: { home: "Головна", transfers: "Трансфери", travel: "Подорож", airportTransfer: "Аеропорт", hotelTransfer: "Готель", pierTransfer: "Пірс", beachTransfer: "Пляж", cityTransfer: "Місто", attractionTransfer: "Пам’ятки", interProvince: "Між провінціями", fleet: "Автопарк", priceList: "Ціни", tours: "Тури", boatSchedules: "Розклад човнів", travelInfo: "Інформація", articles: "Статті", faq: "FAQ", reviews: "Відгуки", contact: "Контакти", booking: "Бронювання", bookNow: "Забронювати", services: "Послуги", more: "Більше", menu: "Меню" },
    Common: { callNow: "Зателефонувати", startBooking: "Почати бронювання", book: "Бронювати" },
    Home: { privateTransfer: "Приватний трансфер", contactTitle: "Зв’язатися з нами" },
  },
  tr: {
    LocaleSwitcher: { label: "Dil", search: "Dil ara", empty: "Eşleşen dil yok" },
    Nav: { home: "Ana sayfa", transfers: "Transferler", travel: "Seyahat", airportTransfer: "Havalimanı", hotelTransfer: "Otel", pierTransfer: "İskele", beachTransfer: "Plaj", cityTransfer: "Şehir", attractionTransfer: "Gezilecek yerler", interProvince: "İller arası", fleet: "Filo", priceList: "Fiyat listesi", tours: "Turlar", boatSchedules: "Tekne saatleri", travelInfo: "Seyahat bilgisi", articles: "Yazılar", faq: "SSS", reviews: "Yorumlar", contact: "İletişim", booking: "Rezervasyon", bookNow: "Hemen rezervasyon", services: "Hizmetler", more: "Daha fazla", menu: "Menü" },
    Common: { callNow: "Şimdi ara", startBooking: "Rezervasyona başla", book: "Rezervasyon" },
    Home: { privateTransfer: "Özel transfer", contactTitle: "Bize ulaşın", ctaTitle: "Güney Tayland’ı keşfetmeye hazır mısınız?" },
  },
  cs: {
    LocaleSwitcher: { label: "Jazyk", search: "Hledat jazyk", empty: "Žádný odpovídající jazyk" },
    Nav: { home: "Domů", transfers: "Transfery", travel: "Cestování", airportTransfer: "Letiště", hotelTransfer: "Hotel", pierTransfer: "Molo", beachTransfer: "Pláž", cityTransfer: "Město", attractionTransfer: "Památky", interProvince: "Mezi provinciemi", fleet: "Vozový park", priceList: "Ceník", tours: "Výlety", boatSchedules: "Jízdní řád lodí", travelInfo: "Informace", articles: "Články", faq: "FAQ", reviews: "Recenze", contact: "Kontakt", booking: "Rezervace", bookNow: "Rezervovat", services: "Služby", more: "Více", menu: "Menu" },
    Common: { callNow: "Zavolat", startBooking: "Začít rezervaci", book: "Rezervovat" },
  },
  el: {
    LocaleSwitcher: { label: "Γλώσσα", search: "Αναζήτηση γλώσσας", empty: "Δεν βρέθηκε γλώσσα" },
    Nav: { home: "Αρχική", transfers: "Μεταφορές", travel: "Ταξίδι", airportTransfer: "Αεροδρόμιο", hotelTransfer: "Ξενοδοχείο", pierTransfer: "Προβλήτα", beachTransfer: "Παραλία", cityTransfer: "Πόλη", attractionTransfer: "Αξιοθέατα", interProvince: "Διαεπαρχιακά", fleet: "Στόλος", priceList: "Τιμές", tours: "Εκδρομές", boatSchedules: "Δρομολόγια πλοίων", travelInfo: "Πληροφορίες", articles: "Άρθρα", faq: "FAQ", reviews: "Κριτικές", contact: "Επικοινωνία", booking: "Κράτηση", bookNow: "Κράτηση τώρα", services: "Υπηρεσίες", more: "Περισσότερα", menu: "Μενού" },
    Common: { callNow: "Καλέστε τώρα", startBooking: "Έναρξη κράτησης", book: "Κράτηση" },
  },
  fi: {
    LocaleSwitcher: { label: "Kieli", search: "Hae kieltä", empty: "Ei vastaavaa kieltä" },
    Nav: { home: "Koti", transfers: "Kuljetukset", travel: "Matkailu", airportTransfer: "Lentokenttä", hotelTransfer: "Hotelli", pierTransfer: "Laituri", beachTransfer: "Ranta", cityTransfer: "Kaupunki", attractionTransfer: "Nähtävyydet", interProvince: "Maakuntien välillä", fleet: "Kalusto", priceList: "Hinnasto", tours: "Retket", boatSchedules: "Veneaikataulut", travelInfo: "Matkatieto", articles: "Artikkelit", faq: "UKK", reviews: "Arvostelut", contact: "Yhteystiedot", booking: "Varaus", bookNow: "Varaa nyt", services: "Palvelut", more: "Lisää", menu: "Valikko" },
    Common: { callNow: "Soita nyt", startBooking: "Aloita varaus", book: "Varaa" },
  },
  no: {
    LocaleSwitcher: { label: "Språk", search: "Søk språk", empty: "Ingen treff" },
    Nav: { home: "Hjem", transfers: "Transfer", travel: "Reise", airportTransfer: "Flyplass", hotelTransfer: "Hotell", pierTransfer: "Kai", beachTransfer: "Strand", cityTransfer: "By", attractionTransfer: "Severdigheter", interProvince: "Mellom provinser", fleet: "Kjøretøy", priceList: "Prisliste", tours: "Turer", boatSchedules: "Båttider", travelInfo: "Reiseinfo", articles: "Artikler", faq: "FAQ", reviews: "Anmeldelser", contact: "Kontakt", booking: "Bestilling", bookNow: "Bestill nå", services: "Tjenester", more: "Mer", menu: "Meny" },
    Common: { callNow: "Ring nå", startBooking: "Start bestilling", book: "Bestill" },
  },
  da: {
    LocaleSwitcher: { label: "Sprog", search: "Søg sprog", empty: "Intet matchende sprog" },
    Nav: { home: "Hjem", transfers: "Transfer", travel: "Rejse", airportTransfer: "Lufthavn", hotelTransfer: "Hotel", pierTransfer: "Kaj", beachTransfer: "Strand", cityTransfer: "By", attractionTransfer: "Seværdigheder", interProvince: "Mellem provinser", fleet: "Køretøjer", priceList: "Prisliste", tours: "Ture", boatSchedules: "Bådtider", travelInfo: "Rejseinfo", articles: "Artikler", faq: "FAQ", reviews: "Anmeldelser", contact: "Kontakt", booking: "Booking", bookNow: "Book nu", services: "Ydelser", more: "Mere", menu: "Menu" },
    Common: { callNow: "Ring nu", startBooking: "Start booking", book: "Book" },
  },
  ro: {
    LocaleSwitcher: { label: "Limbă", search: "Caută limba", empty: "Nicio limbă găsită" },
    Nav: { home: "Acasă", transfers: "Transferuri", travel: "Călătorie", airportTransfer: "Aeroport", hotelTransfer: "Hotel", pierTransfer: "Dană", beachTransfer: "Plajă", cityTransfer: "Oraș", attractionTransfer: "Atracții", interProvince: "Între provincii", fleet: "Flotă", priceList: "Prețuri", tours: "Tururi", boatSchedules: "Program bărci", travelInfo: "Info călătorie", articles: "Articole", faq: "FAQ", reviews: "Recenzii", contact: "Contact", booking: "Rezervare", bookNow: "Rezervă acum", services: "Servicii", more: "Mai mult", menu: "Meniu" },
    Common: { callNow: "Sună acum", startBooking: "Începe rezervarea", book: "Rezervă" },
  },
  hu: {
    LocaleSwitcher: { label: "Nyelv", search: "Nyelv keresése", empty: "Nincs találat" },
    Nav: { home: "Kezdőlap", transfers: "Transzferek", travel: "Utazás", airportTransfer: "Reptér", hotelTransfer: "Szálloda", pierTransfer: "Móló", beachTransfer: "Strand", cityTransfer: "Város", attractionTransfer: "Látnivalók", interProvince: "Tartományok között", fleet: "Flotta", priceList: "Árlista", tours: "Túrák", boatSchedules: "Hajómenetrend", travelInfo: "Utazási infó", articles: "Cikkek", faq: "GYIK", reviews: "Vélemények", contact: "Kapcsolat", booking: "Foglalás", bookNow: "Foglalás most", services: "Szolgáltatások", more: "Több", menu: "Menü" },
    Common: { callNow: "Hívás most", startBooking: "Foglalás indítása", book: "Foglalás" },
  },
  he: {
    LocaleSwitcher: { label: "שפה", search: "חיפוש שפה", empty: "לא נמצאה שפה" },
    Nav: { home: "בית", transfers: "העברות", travel: "טיול", airportTransfer: "שדה תעופה", hotelTransfer: "מלון", pierTransfer: "מזח", beachTransfer: "חוף", cityTransfer: "עיר", attractionTransfer: "אטרקציות", interProvince: "בין מחוזות", fleet: "צי", priceList: "מחירון", tours: "סיורים", boatSchedules: "לוח סירות", travelInfo: "מידע למטייל", articles: "כתבות", faq: "שאלות", reviews: "ביקורות", contact: "צור קשר", booking: "הזמנה", bookNow: "הזמינו עכשיו", services: "שירותים", more: "עוד", menu: "תפריט" },
    Common: { callNow: "התקשרו עכשיו", startBooking: "התחלת הזמנה", book: "הזמנה" },
    Home: { privateTransfer: "הסעה פרטית", contactTitle: "צרו קשר" },
  },
  fa: {
    LocaleSwitcher: { label: "زبان", search: "جستجوی زبان", empty: "زبانی یافت نشد" },
    Nav: { home: "خانه", transfers: "ترانسفر", travel: "سفر", airportTransfer: "فرودگاه", hotelTransfer: "هتل", pierTransfer: "اسکله", beachTransfer: "ساحل", cityTransfer: "شهر", attractionTransfer: "جاذبه‌ها", interProvince: "بین استان‌ها", fleet: "ناوگان", priceList: "لیست قیمت", tours: "تور", boatSchedules: "برنامه قایق", travelInfo: "اطلاعات سفر", articles: "مقالات", faq: "سؤالات", reviews: "نظرات", contact: "تماس", booking: "رزرو", bookNow: "همین حالا رزرو", services: "خدمات", more: "بیشتر", menu: "منو" },
    Common: { callNow: "اکنون تماس بگیرید", startBooking: "شروع رزرو", book: "رزرو" },
  },
  bn: {
    LocaleSwitcher: { label: "ভাষা", search: "ভাষা খুঁজুন", empty: "কোনো ভাষা মেলেনি" },
    Nav: { home: "হোম", transfers: "ট্রান্সফার", travel: "ভ্রমণ", airportTransfer: "বিমানবন্দর", hotelTransfer: "হোটেল", pierTransfer: "ঘাট", beachTransfer: "সমুদ্র সৈকত", cityTransfer: "শহর", attractionTransfer: "দর্শনীয় স্থান", interProvince: "আন্তঃপ্রদেশ", fleet: "গাড়িবহর", priceList: "মূল্য তালিকা", tours: "ট্যুর", boatSchedules: "নৌকা সময়সূচি", travelInfo: "ভ্রমণ তথ্য", articles: "লেখা", faq: "FAQ", reviews: "রিভিউ", contact: "যোগাযোগ", booking: "বুকিং", bookNow: "এখনই বুক করুন", services: "সেবা", more: "আরও", menu: "মেনু" },
    Common: { callNow: "এখনই কল করুন", startBooking: "বুকিং শুরু", book: "বুক" },
  },
};

const extraPublic = {
  ja: {
    MeetingPoint: { title: "お出迎え場所", domesticLabel: "国内線", internationalLabel: "国際線", door: "ゲート {n}", feature1: "出迎え", feature3: "プライベート送迎" },
    PriceChecker: { title: "料金検索", subtitle: "乗車地・目的地・車両を選ぶと料金がすぐに表示されます", oneWay: "片道", roundTrip: "往復", from: "乗車地", to: "目的地", vehicle: "車両", estimated: "概算料金", bookNow: "今すぐ予約", tolls: "高速・駐車料金込み" },
    Booking: { title: "送迎を予約", subtitle: "片道・往復・複数区間・複数日・チャーターを1件で。", confirm: "確認", typeTitle: "予約タイプ", pickup: "乗車地", dropoff: "降車地", date: "日付", vehicle: "車両", customerTitle: "お客様情報", paymentTitle: "お支払い", total: "合計", confirmBooking: "予約を確定", bankTransfer: "銀行振込", card: "クレジットカード", promptpay: "PromptPay", cash: "運転手に現金払い" },
    Pages: { fleet: "車両一覧", priceList: "料金表", faq: "FAQ", reviews: "お客様の声", contact: "お問い合わせ" },
    Payment: { bankTransfer: "銀行振込", card: "クレジット / デビット", promptpay: "PromptPay", cash: "運転手に現金" },
    Voucher: { confirmed: "eバウチャー確定", print: "バウチャーを印刷", pickup: "乗車", dropoff: "降車", vehicle: "車両" },
    Contact: { title: "お問い合わせ", send: "送信", phone: "電話", address: "住所" },
    Transfer: { book: "予約", popularRoutes: "人気ルート", startBooking: "予約を始める" },
  },
  ko: {
    MeetingPoint: { title: "미팅 장소", domesticLabel: "국내선", internationalLabel: "국제선", door: "출구 {n}" },
    PriceChecker: { title: "요금 조회", oneWay: "편도", roundTrip: "왕복", from: "출발", to: "도착", vehicle: "차량", estimated: "예상 요금", bookNow: "지금 예약" },
    Booking: { title: "픽업 예약", confirm: "확인", pickup: "출발지", dropoff: "도착지", date: "날짜", vehicle: "차량", paymentTitle: "결제", total: "합계", confirmBooking: "예약 확정", bankTransfer: "계좌이체", card: "카드", promptpay: "PromptPay", cash: "기사에게 현금" },
    Pages: { fleet: "차량", priceList: "요금표", contact: "문의" },
    Payment: { bankTransfer: "계좌이체", card: "신용/체크카드", promptpay: "PromptPay", cash: "기사에게 현금" },
    Contact: { title: "문의", send: "보내기", phone: "전화" },
  },
  ru: {
    MeetingPoint: { title: "Место встречи", domesticLabel: "Внутренние рейсы", internationalLabel: "Международные" },
    PriceChecker: { title: "Проверка цены", oneWay: "В одну сторону", roundTrip: "Туда-обратно", from: "Откуда", to: "Куда", vehicle: "Авто", estimated: "Ориентировочная цена", bookNow: "Забронировать" },
    Booking: { title: "Бронирование трансфера", confirm: "Подтвердить", pickup: "Посадка", dropoff: "Высадка", date: "Дата", vehicle: "Авто", paymentTitle: "Оплата", total: "Итого", confirmBooking: "Подтвердить бронь", bankTransfer: "Банковский перевод", card: "Карта", cash: "Наличные водителю" },
    Payment: { bankTransfer: "Банковский перевод", card: "Карта", promptpay: "PromptPay", cash: "Наличные водителю" },
    Contact: { title: "Контакты", send: "Отправить", phone: "Телефон" },
  },
  de: {
    MeetingPoint: { title: "Treffpunkt", domesticLabel: "Inland", internationalLabel: "International" },
    PriceChecker: { title: "Preisrechner", oneWay: "Einfach", roundTrip: "Hin und zurück", from: "Abfahrt", to: "Ziel", vehicle: "Fahrzeug", estimated: "Geschätzter Preis", bookNow: "Jetzt buchen" },
    Booking: { title: "Transfer buchen", confirm: "Bestätigen", pickup: "Abholung", dropoff: "Ziel", date: "Datum", vehicle: "Fahrzeug", paymentTitle: "Zahlung", total: "Gesamt", confirmBooking: "Buchung bestätigen", bankTransfer: "Überweisung", card: "Karte", cash: "Bar an den Fahrer" },
    Payment: { bankTransfer: "Überweisung", card: "Kredit-/Debitkarte", promptpay: "PromptPay", cash: "Bar an den Fahrer" },
    Contact: { title: "Kontakt", send: "Senden", phone: "Telefon" },
  },
  fr: {
    MeetingPoint: { title: "Point de rendez-vous", domesticLabel: "Domestic", internationalLabel: "International" },
    PriceChecker: { title: "Vérifier le prix", oneWay: "Aller simple", roundTrip: "Aller-retour", from: "Départ", to: "Arrivée", vehicle: "Véhicule", estimated: "Prix estimé", bookNow: "Réserver" },
    Booking: { title: "Réserver votre transfert", confirm: "Confirmer", pickup: "Prise en charge", dropoff: "Dépose", date: "Date", vehicle: "Véhicule", paymentTitle: "Paiement", total: "Total", confirmBooking: "Confirmer la réservation", bankTransfer: "Virement", card: "Carte", cash: "Espèces au chauffeur" },
    Payment: { bankTransfer: "Virement bancaire", card: "Carte bancaire", promptpay: "PromptPay", cash: "Espèces au chauffeur" },
    Contact: { title: "Contact", send: "Envoyer", phone: "Téléphone" },
  },
  it: {
    MeetingPoint: { title: "Punto d'incontro", domesticLabel: "Nazionali", internationalLabel: "Internazionali" },
    PriceChecker: { title: "Calcola prezzo", oneWay: "Solo andata", roundTrip: "Andata e ritorno", from: "Partenza", to: "Destinazione", vehicle: "Veicolo", estimated: "Prezzo stimato", bookNow: "Prenota" },
    Booking: { title: "Prenota il transfer", confirm: "Conferma", pickup: "Ritiro", dropoff: "Consegna", date: "Data", vehicle: "Veicolo", paymentTitle: "Pagamento", total: "Totale", confirmBooking: "Conferma prenotazione", bankTransfer: "Bonifico", card: "Carta", cash: "Contanti all'autista" },
    Payment: { bankTransfer: "Bonifico", card: "Carta di credito / debito", promptpay: "PromptPay", cash: "Contanti all'autista" },
    Contact: { title: "Contatti", send: "Invia", phone: "Telefono" },
  },
  es: {
    MeetingPoint: { title: "Punto de encuentro", domesticLabel: "Nacional", internationalLabel: "Internacional" },
    PriceChecker: { title: "Consultar precio", oneWay: "Solo ida", roundTrip: "Ida y vuelta", from: "Origen", to: "Destino", vehicle: "Vehículo", estimated: "Precio estimado", bookNow: "Reservar" },
    Booking: { title: "Reserve su traslado", confirm: "Confirmar", pickup: "Recogida", dropoff: "Destino", date: "Fecha", vehicle: "Vehículo", paymentTitle: "Pago", total: "Total", confirmBooking: "Confirmar reserva", bankTransfer: "Transferencia", card: "Tarjeta", cash: "Efectivo al conductor" },
    Payment: { bankTransfer: "Transferencia bancaria", card: "Tarjeta", promptpay: "PromptPay", cash: "Efectivo al conductor" },
    Contact: { title: "Contacto", send: "Enviar", phone: "Teléfono" },
  },
  ar: {
    MeetingPoint: { title: "نقطة اللقاء", domesticLabel: "محلي", internationalLabel: "دولي", door: "الباب {n}" },
    PriceChecker: { title: "حساب السعر", oneWay: "اتجاه واحد", roundTrip: "ذهاب وعودة", from: "من", to: "إلى", vehicle: "المركبة", estimated: "السعر التقريبي", bookNow: "احجز الآن" },
    Booking: { title: "احجز النقل", confirm: "تأكيد", pickup: "نقطة الانطلاق", dropoff: "الوصول", date: "التاريخ", vehicle: "المركبة", paymentTitle: "الدفع", total: "الإجمالي", confirmBooking: "تأكيد الحجز", bankTransfer: "تحويل بنكي", card: "بطاقة", cash: "نقداً للسائق" },
    Payment: { bankTransfer: "تحويل بنكي", card: "بطاقة", promptpay: "PromptPay", cash: "نقداً للسائق" },
    Contact: { title: "اتصل بنا", send: "إرسال", phone: "هاتف" },
  },
  ms: {
    PriceChecker: { title: "Semak harga", oneWay: "Sehala", roundTrip: "Pergi balik", from: "Dari", to: "Ke", vehicle: "Kenderaan", estimated: "Anggaran harga", bookNow: "Tempah sekarang" },
    Booking: { title: "Tempah transfer anda", confirmBooking: "Sahkan tempahan", bankTransfer: "Pindahan bank", card: "Kad", cash: "Tunai kepada pemandu" },
    Payment: { bankTransfer: "Pindahan bank", card: "Kad kredit / debit", promptpay: "PromptPay", cash: "Tunai kepada pemandu" },
  },
  vi: {
    PriceChecker: { title: "Kiểm tra giá", oneWay: "Một chiều", roundTrip: "Khứ hồi", from: "Điểm đón", to: "Điểm đến", vehicle: "Xe", estimated: "Giá ước tính", bookNow: "Đặt ngay" },
    Booking: { title: "Đặt xe đưa đón", confirmBooking: "Xác nhận đặt xe", bankTransfer: "Chuyển khoản", card: "Thẻ", cash: "Tiền mặt cho tài xế" },
    Payment: { bankTransfer: "Chuyển khoản", card: "Thẻ tín dụng / ghi nợ", promptpay: "PromptPay", cash: "Tiền mặt cho tài xế" },
  },
  id: {
    PriceChecker: { title: "Cek harga", oneWay: "Sekali jalan", roundTrip: "Pulang pergi", from: "Jemput", to: "Tujuan", vehicle: "Kendaraan", estimated: "Perkiraan harga", bookNow: "Pesan sekarang" },
    Booking: { title: "Pesan transfer Anda", confirmBooking: "Konfirmasi pemesanan", bankTransfer: "Transfer bank", card: "Kartu", cash: "Tunai ke pengemudi" },
    Payment: { bankTransfer: "Transfer bank", card: "Kartu kredit / debit", promptpay: "PromptPay", cash: "Tunai ke pengemudi" },
  },
  sv: {
    PriceChecker: { title: "Priskoll", oneWay: "Enkel resa", roundTrip: "Tur och retur", from: "Från", to: "Till", vehicle: "Fordon", estimated: "Beräknat pris", bookNow: "Boka nu" },
    Booking: { title: "Boka din transfer", confirmBooking: "Bekräfta bokning", bankTransfer: "Banköverföring", card: "Kort", cash: "Kontant till föraren" },
    Payment: { bankTransfer: "Banköverföring", card: "Kredit-/betalkort", promptpay: "PromptPay", cash: "Kontant till föraren" },
  },
  nl: {
    PriceChecker: { title: "Prijscheck", oneWay: "Enkele reis", roundTrip: "Retour", from: "Van", to: "Naar", vehicle: "Voertuig", estimated: "Geschatte prijs", bookNow: "Nu boeken" },
    Booking: { title: "Boek uw transfer", confirmBooking: "Boeking bevestigen", bankTransfer: "Overschrijving", card: "Kaart", cash: "Contant aan de chauffeur" },
    Payment: { bankTransfer: "Overschrijving", card: "Credit-/debitcard", promptpay: "PromptPay", cash: "Contant aan de chauffeur" },
  },
};

for (const pack of [chrome, extraPublic]) {
  for (const [code, data] of Object.entries(pack)) {
    const path = `src/messages/${code}.json`;
    const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
    writeFileSync(path, `${JSON.stringify(deepMerge(existing, data), null, 2)}\n`);
    console.log("wrote", code);
  }
}
