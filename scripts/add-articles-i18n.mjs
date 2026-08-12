import fs from "fs";

const categories = {
  en: {
    Airport: "Airport",
    Beach: "Beach",
    Pier: "Pier",
    "Inter Province": "Inter Province",
  },
  th: {
    Airport: "สนามบิน",
    Beach: "ชายหาด",
    Pier: "ท่าเรือ",
    "Inter Province": "ข้ามจังหวัด",
  },
  zh: {
    Airport: "机场",
    Beach: "海滩",
    Pier: "码头",
    "Inter Province": "跨府",
  },
};

const items = {
  en: {
    "krabi-airport-transfer-guide": {
      title: "Krabi Airport Transfer Guide: Smooth Arrival at KBV",
      excerpt:
        "What to expect after landing at Krabi International Airport, how meet & greet works, and how to book a private transfer with an e-Voucher.",
      p1: "Landing at Krabi International Airport (KBV) is the start of your Southern Thailand trip. A private airport transfer helps you skip taxi queues and go straight to your hotel, beach, or pier.",
      p2: "With Krabi Links Taxi, your driver tracks the flight and includes free waiting time for airport pickups. You receive an e-Voucher with a QR code right after booking — show it at the meeting point.",
      p3: "Popular routes from KBV include Ao Nang Beach, Railay, Centara Grand, and Krabi Town. Choose Economy Sedan for couples or a Van if you travel with family and luggage.",
      p4: "Tip: Share your flight number and hotel name when booking so the driver can prepare a name sign and plan the best route around evening traffic.",
    },
    "ao-nang-railay-beach-transfer": {
      title: "Ao Nang & Railay Beach Transfer Tips",
      excerpt:
        "How to move between Ao Nang, Railay, and nearby resorts with private cars, piers, and the right vehicle for beach bags.",
      p1: "Ao Nang is the hub for many Krabi beach stays, while Railay is reached via short pier connections. Planning your transfer in advance keeps the day simple.",
      p2: "From the airport or Krabi Town, book a private drop-off to Ao Nang Beach or your hotel. For Railay, we can take you to the pier and help time your boat connection.",
      p3: "If you carry snorkel gear or large bags, an SUV or Standard Van gives more space than a sedan. Round-trip bookings also save time on checkout day.",
      p4: "Evening returns from the beach can get busy — reserve your pickup time early, especially on weekends and public holidays.",
    },
    "pier-transfer-to-phi-phi": {
      title: "Pier Transfer to Phi Phi: What Travelers Should Know",
      excerpt:
        "A practical checklist for hotel-to-pier transfers, ferry timing, and luggage tips before heading to Phi Phi.",
      p1: "Island days start on land. A reliable pier transfer from your hotel or the airport means you reach Ao Nang Pier or other departure points without rushing.",
      p2: "Build in buffer time for check-in and boarding. We recommend arriving at the pier at least 45–60 minutes before ferry departure during peak season.",
      p3: "Private vans are ideal for groups sharing the same ferry. Families can request child seats free of charge when booking.",
      p4: "After your island trip, book a return pier pickup so a driver is ready when the boat docks — especially useful if you arrive after dark.",
    },
    "krabi-to-phuket-inter-province": {
      title: "Krabi to Phuket Inter-Province Transfer",
      excerpt:
        "Compare comfort and timing for the Krabi–Phuket corridor, vehicle options, and when a private transfer beats shared vans.",
      p1: "The Krabi–Phuket route is one of the most requested inter-province transfers in Southern Thailand. Private cars give door-to-door timing without multiple stops.",
      p2: "Typical journeys connect KBV or Krabi Town with Phuket Airport or Patong. Travel time depends on traffic and whether you start from the airport or town.",
      p3: "For longer rides, VIP Van or Mini Bus options offer more space and comfort. Prices are all-inclusive of tolls and parking unless you add waiting time.",
      p4: "Book round-trip if you fly into one province and out of the other — one reservation covers both legs with a single e-Voucher flow.",
    },
  },
  th: {
    "krabi-airport-transfer-guide": {
      title: "คู่มือรับส่งสนามบินกระบี่: ถึง KBV อย่างราบรื่น",
      excerpt:
        "หลังจากลงจอดที่สนามบินนานาชาติกระบี่ต้องรู้อะไร บริการรับถึงที่ทำงานอย่างไร และจองรถรับส่งส่วนตัวพร้อม e-Voucher อย่างไร",
      p1: "การลงจอดที่สนามบินนานาชาติกระบี่ (KBV) คือจุดเริ่มต้นทริปภาคใต้ รถรับส่งสนามบินส่วนตัวช่วยให้คุณไม่ต้องต่อคิวแท็กซี่ และไปโรงแรม ชายหาด หรือท่าเรือได้ทันที",
      p2: "กับ Krabi Links Taxi คนขับติดตามเที่ยวบินและมีเวลารอฟรีสำหรับการรับที่สนามบิน คุณจะได้รับ e-Voucher พร้อม QR Code ทันทีหลังจอง — แสดงที่จุดนัดพบ",
      p3: "เส้นทางยอดนิยมจาก KBV ได้แก่ หาดอ่าวนาง ไร่เลย์ Centara Grand และตัวเมืองกระบี่ เลือกรถเก๋งประหยัดสำหรับคู่รัก หรือรถตู้หากเดินทางกับครอบครัวและสัมภาระ",
      p4: "เคล็ดลับ: แจ้งหมายเลขเที่ยวบินและชื่อโรงแรมตอนจอง เพื่อให้คนขับเตรียมป้ายชื่อและวางแผนเส้นทางเลี่ยงรถติดช่วงเย็น",
    },
    "ao-nang-railay-beach-transfer": {
      title: "เคล็ดลับรับส่งหาดอ่าวนางและไร่เลย์",
      excerpt:
        "วิธีเดินทางระหว่างอ่าวนาง ไร่เลย์ และรีสอร์ทใกล้เคียงด้วยรถส่วนตัว ท่าเรือ และประเภทรถที่เหมาะกับกระเป๋าชายหาด",
      p1: "อ่าวนางเป็นศูนย์กลางของที่พักชายหาดหลายแห่งในกระบี่ ส่วนไร่เลย์เข้าถึงผ่านท่าเรือระยะสั้น การวางแผนรับส่งล่วงหน้าทำให้วันนั้นง่ายขึ้น",
      p2: "จากสนามบินหรือตัวเมืองกระบี่ จองส่งตรงไปหาดอ่าวนางหรือโรงแรม สำหรับไร่เลย์ เราพาไปท่าเรือและช่วยจับเวลาเชื่อมต่อเรือได้",
      p3: "ถ้ามีอุปกรณ์ดำน้ำหรือกระเป๋าใหญ่ รถ SUV หรือรถตู้มาตรฐานให้พื้นที่มากกว่าเก๋ง การจองไป-กลับยังช่วยประหยัดเวลาวันเช็คเอาท์",
      p4: "เที่ยวกลับช่วงเย็นจากชายหาดอาจแน่น — จองเวลารับล่วงหน้า โดยเฉพาะสุดสัปดาห์และวันหยุดนักขัตฤกษ์",
    },
    "pier-transfer-to-phi-phi": {
      title: "รับส่งท่าเรือไปพีพี: สิ่งที่นักท่องเที่ยวควรรู้",
      excerpt:
        "เช็คลิสต์จริงจังสำหรับรับส่งโรงแรม–ท่าเรือ จังหวะเรือเฟอร์รี่ และเคล็ดลับสัมภาระก่อนไปพีพี",
      p1: "วันเที่ยวเกาะเริ่มบนบก รถรับส่งท่าเรือที่เชื่อถือได้จากโรงแรมหรือสนามบินช่วยให้ถึงท่าเรืออ่าวนางหรือจุดออกเดินทางอื่นโดยไม่เร่งรีบ",
      p2: "เผื่อเวลาเช็คอินและขึ้นเรือ แนะนำถึงท่าเรืออย่างน้อย 45–60 นาทีก่อนเรือออกในช่วงไฮซีซัน",
      p3: "รถตู้ส่วนตัวเหมาะกับกลุ่มที่ขึ้นเรือเฟอร์รี่รอบเดียวกัน ครอบครัวขอคาร์ซีทเด็กได้ฟรีตอนจอง",
      p4: "หลังเที่ยวเกาะ จองรับกลับที่ท่าเรือให้คนขับรอเมื่อเรือเทียบท่า — มีประโยชน์มากหากถึงหลังมืด",
    },
    "krabi-to-phuket-inter-province": {
      title: "รับส่งข้ามจังหวัดกระบี่–ภูเก็ต",
      excerpt:
        "เทียบความสะดวกและเวลาบนเส้นทางกระบี่–ภูเก็ต ตัวเลือกรถ และเมื่อไหร่ที่รถรับส่งส่วนตัวดีกว่าแวนรวม",
      p1: "เส้นทางกระบี่–ภูเก็ตเป็นหนึ่งในรับส่งข้ามจังหวัดที่ยอดนิยมที่สุดในภาคใต้ รถส่วนตัวให้บริการถึงที่โดยไม่แวะหลายจุด",
      p2: "ทริปทั่วไปเชื่อม KBV หรือตัวเมืองกระบี่กับสนามบินภูเก็ตหรือป่าตอง เวลาเดินทางขึ้นกับรถติดและจุดเริ่มต้น",
      p3: "สำหรับทางไกล รถตู้ VIP หรือมินิบัสให้พื้นที่และความสะดวกสบายมากขึ้น ราคารวมค่าทางด่วนและที่จอด เว้นแต่เพิ่มเวลารอ",
      p4: "จองไป-กลับหากบินเข้าจังหวัดหนึ่งและออกอีกจังหวัด — ใบจองเดียวครอบคลุมทั้งสองเที่ยวพร้อม e-Voucher",
    },
  },
  zh: {
    "krabi-airport-transfer-guide": {
      title: "甲米机场接送指南：顺利抵达 KBV",
      excerpt:
        "落地甲米国际机场后会经历什么、举牌迎接如何运作，以及如何预订含电子凭证的私人接送。",
      p1: "抵达甲米国际机场（KBV）是您泰国南部行程的开始。私人机场接送可跳过出租车排队，直达酒店、海滩或码头。",
      p2: "使用 Krabi Links Taxi，司机跟踪航班，机场接机含免费等候。预订后立即获得含二维码的电子凭证 — 在会合点出示即可。",
      p3: "从 KBV 热门路线包括奥南海滩、莱利、Centara Grand 和甲米市区。情侣可选经济型轿车，家庭与行李较多可选商务车。",
      p4: "提示：预订时提供航班号和酒店名称，方便司机准备名牌并避开晚高峰规划路线。",
    },
    "ao-nang-railay-beach-transfer": {
      title: "奥南与莱利海滩接送贴士",
      excerpt:
        "如何用私家车、码头与合适车型，在奥南、莱利及附近度假村之间便捷往返。",
      p1: "奥南是许多甲米海滩住宿的枢纽，莱利则需经短途码头衔接。提前安排接送能让一天更轻松。",
      p2: "从机场或甲米市区预订直达奥南海滩或酒店。前往莱利时，我们可送您到码头并协助衔接船班。",
      p3: "若携带浮潜装备或大件行李，SUV 或标准商务车比轿车更宽敞。往返预订也能节省退房日时间。",
      p4: "傍晚从海滩返回可能较忙 — 请尽早预订上车时间，尤其在周末和公共假期。",
    },
    "pier-transfer-to-phi-phi": {
      title: "前往皮皮岛的码头接送：旅客须知",
      excerpt:
        "酒店到码头接送、渡轮时间与行李的实用清单，助您顺利前往皮皮岛。",
      p1: "海岛行程从陆地开始。可靠的码头接送从酒店或机场出发，让您从容抵达奥南码头或其他出发点。",
      p2: "预留值机与登船缓冲时间。旺季建议至少提前 45–60 分钟到达码头。",
      p3: "私人商务车适合同乘一班渡轮的团体。家庭可在预订时免费申请儿童座椅。",
      p4: "海岛行程结束后预订回程码头接机，船靠岸时司机已在等候 — 尤其适合天黑后到达。",
    },
    "krabi-to-phuket-inter-province": {
      title: "甲米至普吉跨府接送",
      excerpt:
        "比较甲米–普吉走廊的舒适度与时间、车型选择，以及何时私人接送优于拼车。",
      p1: "甲米–普吉是泰国南部最受欢迎的跨府接送之一。私家车提供门到门服务，无需多次停靠。",
      p2: "常见行程连接 KBV 或甲米市区与普吉机场或芭东。车程取决于路况以及是否从机场或市区出发。",
      p3: "较长路程可选 VIP 商务车或中巴，空间更舒适。价格含过路费与停车费，除非另加等候时间。",
      p4: "若飞入一府、飞出另一府，可预订往返 — 一笔订单覆盖两段行程并使用同一电子凭证流程。",
    },
  },
};

const ctaCheck = {
  en: "Check live prices and book a private car with instant e-Voucher.",
  th: "เช็คราคาแบบเรียลไทม์แล้วจองรถส่วนตัว พร้อม e-Voucher ทันที",
  zh: "查看实时价格并预订私人用车，即时获取电子凭证。",
};

for (const locale of ["en", "th", "zh"]) {
  const file = `src/messages/${locale}.json`;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.Articles = {
    categories: categories[locale],
    items: items[locale],
  };
  if (!data.Listing) data.Listing = {};
  data.Listing.ctaArticlesBody = ctaCheck[locale];
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log("articles i18n ->", file);
}
