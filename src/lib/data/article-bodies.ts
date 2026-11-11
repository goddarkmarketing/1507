import type { ArticleBlock, ArticleFaq } from "@/lib/types";

export type ArticleBodyCopy = {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  coverAlt: string;
  blocks: ArticleBlock[];
  faqs: ArticleFaq[];
};

type LocaleCode = "th" | "en" | "zh";

/**
 * Rich SEO article bodies by slug + locale.
 * Old short articles stay on Articles.*.p1–p4 messages.
 */
export const articleBodies: Record<
  string,
  Partial<Record<LocaleCode, ArticleBodyCopy>>
> = {
  "krabi-airport-to-ao-nang-taxi": {
    th: {
      title: "แท็กซี่สนามบินกระบี่ไปอ่าวนาง ราคา เวลา และวิธีจอง",
      excerpt:
        "สรุปเส้นทางสนามบินกระบี่ (KBV) ไปอ่าวนาง ใช้เวลากี่นาที ราคาเริ่มต้นเท่าไหร่ เลือกประเภทรถยังไง และจองรถรับส่งส่วนตัวอย่างไรให้ชัวร์",
      metaTitle: "แท็กซี่สนามบินกระบี่ไปอ่าวนาง | ราคา เวลา จองออนไลน์",
      metaDescription:
        "คู่มือแท็กซี่สนามบินกระบี่ไปอ่าวนาง: ระยะทาง ประมาณเวลา ราคา ECO และวิธีจองรถรับส่งส่วนตัวพร้อม e-Voucher กับ Krabi Links Taxi",
      coverAlt:
        "รถรับส่งส่วนตัวจากสนามบินกระบี่ไปหาดอ่าวนาง",
      blocks: [
        {
          type: "p",
          text: "หลายคนค้นหาคำว่า “แท็กซี่สนามบินกระบี่ไปอ่าวนาง” ทันทีหลังจองโรงแรม เพราะอยากรู้ว่าราคาประมาณเท่าไหร่ ใช้เวลานานไหม และควรรีบจองล่วงหน้าหรือรอที่สนามบินก็พอ บทความนี้สรุปจากเส้นทางจริงในตารางราคาของ Krabi Links Taxi เพื่อให้วางแผนได้ชัดก่อนเดินทาง",
        },
        {
          type: "h2",
          text: "สนามบินกระบี่ไปอ่าวนาง ไกลแค่ไหน",
        },
        {
          type: "p",
          text: "จากสนามบินนานาชาติกระบี่ (KBV) ไปโซนหาดอ่าวนาง ระยะทางโดยประมาณราว 24 กิโลเมตร ใช้เวลาเดินทางประมาณ 50–55 นาทีในสภาพการจราจรปกติ ช่วงเย็นหรือวันหยุดอาจช้ากว่านี้เล็กน้อยเพราะรถแน่นบริเวณทางเข้าอ่าวนาง",
        },
        {
          type: "p",
          text: "อ่าวนางเป็นจุดพักยอดนิยมของนักท่องเที่ยวกระบี่ มีโรงแรม ร้านอาหาร และท่าเรือเชื่อมต่อไปไร่เลย์หรือเกาะต่าง ๆ การมีรถรับส่งส่วนตัวตั้งแต่สนามบินช่วยลดความเหนื่อยจากการลากกระเป๋าและต่อคิวรถสาธารณะ",
        },
        {
          type: "h2",
          text: "ราคาแท็กซี่สนามบินกระบี่ไปอ่าวนาง",
        },
        {
          type: "p",
          text: "ในตารางราคาอย่างเป็นทางการของเรา เส้นทางสนามบินกระบี่ ↔ อ่าวนาง เริ่มต้นที่รถ ECO ประมาณ ฿500 ต่อเที่ยว (ราคาอาจต่างตามประเภทรถ เช่น PREM, SUV, VAN) ราคารวมค่าทางด่วนและที่จอดตามเงื่อนไขบริการปกติ",
        },
        {
          type: "p",
          text: "หากรับช่วงกลางคืนเวลา 00:00–04:59 ตามเวลากรุงเทพฯ จะมีเซอร์วิสชาร์จคนขับเพิ่ม ฿200 ต่อออเดอร์ และควรจองล่วงหน้าอย่างน้อย 24 ชั่วโมงก่อนเวลารับ เพื่อให้ทีมจัดรถได้ทัน",
        },
        {
          type: "h3",
          text: "เลือกรถแบบไหนดี",
        },
        {
          type: "ul",
          items: [
            "คู่รักหรือเดินทาง 1–3 คนพร้อมกระเป๋าเล็ก: รถ ECO / PREM มักเพียงพอ",
            "ครอบครัวหรือกระเป๋าใหญ่: เลือกรถตู้ VAN จะจุได้สบายกว่า",
            "ต้องการเบาะเด็ก: แจ้งตอนจองได้ โดยราคาค่าโดยสารไม่เปลี่ยนจากจำนวนผู้ใหญ่/เด็ก",
          ],
        },
        {
          type: "h2",
          text: "จองล่วงหน้าดีกว่ารอแท็กซี่ที่สนามบินไหม",
        },
        {
          type: "p",
          text: "การจองรถรับส่งส่วนตัวล่วงหน้าเหมาะกับคนที่อยากล็อกราคาและจุดรับไว้ก่อน โดยเฉพาะเที่ยวบินดึก ครอบครัวที่มีเด็ก หรือผู้ที่ต้องการให้คนขับถือป้ายรอ เมื่อจองกับเรา คุณจะได้ e-Voucher แสดงเลขที่จองและรายละเอียดเส้นทาง ใช้ยืนยันกับคนขับได้ทันที",
        },
        {
          type: "p",
          text: "ถ้ายังไม่แน่ใจเวลารถไฟหรือโรงแรม สามารถเช็คราคาบนหน้าแรกหรือหน้าจองก่อน แล้วค่อยยืนยันเมื่อแผนชัดขึ้น แนะนำให้ใส่หมายเลขเที่ยวบินและชื่อโรงแรมตอนจอง เพื่อให้คนขับวางแผนจุดนัดพบได้ถูกต้อง",
        },
        {
          type: "h2",
          text: "จุดนัดพบที่สนามบินกระบี่",
        },
        {
          type: "p",
          text: "หลังลงเครื่องและรับกระเป๋าแล้ว ให้เดินไปยังประตูขาเข้าตามประเภทเที่ยวบิน (ในประเทศ/ต่างประเทศ) แล้วมองหาคนขับที่ถือป้ายชื่อตามที่ระบุในวอชเชอร์ หากไม่แน่ใจจุดพบ ดูคู่มือจุดพบลูกค้าบนเว็บไซต์หรือติดต่อเบอร์ในใบจองได้",
        },
        {
          type: "h2",
          text: "ขั้นตอนจองกับ Krabi Links Taxi",
        },
        {
          type: "ul",
          items: [
            "เลือกต้นทางสนามบินกระบี่ และปลายทางอ่าวนางหรือโรงแรมในโซนอ่าวนาง",
            "เลือกวันที่ เวลารับ และประเภทรถ แล้วกรอกข้อมูลติดต่อ",
            "เลือกแผนชำระเงิน (เช่น จ่ายตรงคนขับ หรือโอนตามเงื่อนไขที่แสดงในหน้าจอง)",
            "ยืนยันการจอง แล้วเก็บ e-Voucher ไว้แสดงตอนพบคนขับ",
          ],
        },
        {
          type: "p",
          text: "อ่านเพิ่มเติมเกี่ยวกับภาพรวมการรับที่สนามบินได้ที่บทความ [คู่มือรับส่งสนามบินกระบี่](/articles/krabi-airport-transfer-guide) และดูบริการ [รับส่งสนามบิน](/airport-transfer) โดยตรง หากต้องการราคาเส้นทางอื่น เปิด [ตารางราคา](/price-list) หรือใช้ฟอร์มเช็คราคาบนหน้าแรกได้ทันที ข้อมูลท่องเที่ยวกระบี่เพิ่มเติมดูได้จาก [การท่องเที่ยวแห่งประเทศไทย](https://www.tourismthailand.org/Destinations/Provinces/Krabi/219)",
        },
        {
          type: "h2",
          text: "สรุปสั้น ๆ",
        },
        {
          type: "p",
          text: "แท็กซี่สนามบินกระบี่ไปอ่าวนางเป็นเส้นทางสั้นที่ใช้เวลาประมาณหนึ่งชั่วโมง ราคาเริ่มต้นชัดเจนในตาราง ECO และจองออนไลน์ช่วยให้มีคนขับรอตรงเวลา โดยเฉพาะช่วงไฮซีซันหรือเที่ยวบินดึก หากพร้อมเดินทาง กดจองได้ที่ [หน้าจองรถรับส่ง](/booking)",
        },
      ],
      faqs: [
        {
          question: "จากสนามบินกระบี่ไปอ่าวนางใช้เวลากี่นาที?",
          answer:
            "โดยปกติราว 50–55 นาที จากระยะทางประมาณ 24 กิโลเมตร ขึ้นกับสภาพการจราจร",
        },
        {
          question: "ราคาเริ่มต้นเท่าไหร่?",
          answer:
            "ตามตารางราคาของเรา รถ ECO เริ่มต้นประมาณ ฿500 ต่อเที่ยว สายอื่นราคาสูงกว่าตามประเภทรถ ดูรายละเอียดใน [ตารางราคา](/price-list)",
        },
        {
          question: "ต้องจองล่วงหน้าไหม?",
          answer:
            "แนะนำจองล่วงหน้าอย่างน้อย 24 ชั่วโมง โดยเฉพาะกลางคืนและช่วงเทศกาล เพื่อล็อกรถและราคาไว้ก่อน จองได้ที่ [หน้าจอง](/booking)",
        },
        {
          question: "มีค่าบริการกลางคืนไหม?",
          answer:
            "หากเวลารับอยู่ในช่วง 00:00–04:59 ตามเวลากรุงเทพฯ มีเซอร์วิสชาร์จคนขับ ฿200 ต่อออเดอร์ อ่านเพิ่มในบทความ [รถรับส่งสนามบินกระบี่กลางคืน](/articles/krabi-airport-night-transfer)",
        },
      ],
    },
    en: {
      title: "Krabi Airport to Ao Nang Taxi: Price, Time & How to Book",
      excerpt:
        "A clear guide to the Krabi Airport (KBV) to Ao Nang route: distance, travel time, starting ECO fare, vehicle choice, and how to book a private transfer.",
      metaTitle: "Krabi Airport to Ao Nang Taxi | Price, Time, Online Booking",
      metaDescription:
        "Plan your Krabi Airport to Ao Nang taxi: about 24 km, ~53 minutes, ECO from ฿500, and how to book a private transfer with an e-Voucher.",
      coverAlt: "Private transfer from Krabi Airport to Ao Nang Beach",
      blocks: [
        {
          type: "p",
          text: "Many travelers search for “Krabi Airport to Ao Nang taxi” right after booking a hotel. They want a realistic price, travel time, and whether to pre-book or take a car at the terminal. This guide follows Krabi Links Taxi’s published route sheet so you can plan with clear numbers.",
        },
        {
          type: "h2",
          text: "How far is Krabi Airport from Ao Nang?",
        },
        {
          type: "p",
          text: "Krabi International Airport (KBV) to the Ao Nang beach area is about 24 km. Typical travel time is around 50–55 minutes in normal traffic. Evenings and holidays can take a little longer near the Ao Nang approach roads.",
        },
        {
          type: "p",
          text: "Ao Nang is a popular base for hotels, restaurants, and boat links to Railay and nearby islands. A private airport transfer means you skip queues and go door-to-door with your luggage.",
        },
        {
          type: "h2",
          text: "Krabi Airport to Ao Nang taxi price",
        },
        {
          type: "p",
          text: "On our official tariff, Krabi Airport ↔ Ao Nang starts at about ฿500 one way for ECO. PREM, SUV, and VAN rates are higher by vehicle class. Tolls and parking are included under standard service terms.",
        },
        {
          type: "p",
          text: "Pickups between 00:00 and 04:59 Bangkok time add a ฿200 night driver surcharge per order. Please book at least 24 hours before pickup so we can assign a car.",
        },
        {
          type: "h3",
          text: "Which vehicle should you choose?",
        },
        {
          type: "ul",
          items: [
            "1–3 adults with light bags: ECO or PREM is usually enough",
            "Families or bulky luggage: choose a VAN",
            "Need a child seat: request it when booking — the transfer fare does not change for adult/child counts",
          ],
        },
        {
          type: "h2",
          text: "Pre-book vs waiting at the airport",
        },
        {
          type: "p",
          text: "Pre-booking locks the route price and meeting details. It helps most for late flights, families with children, or anyone who wants a name-sign meet & greet. After you book, you receive an e-Voucher with the booking number to show your driver.",
        },
        {
          type: "p",
          text: "If your flight or hotel is still flexible, check the price on the homepage or booking form first, then confirm when the plan is fixed. Add your flight number and hotel name so the driver can prepare the right meeting point.",
        },
        {
          type: "h2",
          text: "Meeting point at Krabi Airport",
        },
        {
          type: "p",
          text: "After baggage claim, follow the arrivals doors for domestic or international flights and look for your driver with the name sign on your voucher. If you need orientation, open the airport meeting-point guide on our site or call the number on the booking.",
        },
        {
          type: "h2",
          text: "How to book with Krabi Links Taxi",
        },
        {
          type: "ul",
          items: [
            "Set pickup as Krabi Airport and drop-off as Ao Nang or your Ao Nang hotel",
            "Choose date, pickup time, and vehicle, then enter contact details",
            "Select a payment plan shown on the booking page",
            "Confirm and keep the e-Voucher for pickup",
          ],
        },
        {
          type: "p",
          text: "For a broader airport arrival checklist, read our [Krabi Airport Transfer Guide](/articles/krabi-airport-transfer-guide). Airport transfer services are listed under [Airport Transfer](/airport-transfer). For other routes, use the [price list](/price-list) or the homepage price checker. Destination background: [Tourism Authority of Thailand – Krabi](https://www.tourismthailand.org/Destinations/Provinces/Krabi/219).",
        },
        {
          type: "h2",
          text: "Quick summary",
        },
        {
          type: "p",
          text: "Krabi Airport to Ao Nang is a short private transfer—about an hour—with a clear ECO starting fare on our sheet. Online booking is the simplest way to have a driver waiting, especially in peak season or at night. Ready to go? Start from our [booking page](/booking).",
        },
      ],
      faqs: [
        {
          question: "How long is Krabi Airport to Ao Nang?",
          answer:
            "About 50–55 minutes for roughly 24 km, depending on traffic.",
        },
        {
          question: "What is the starting price?",
          answer:
            "ECO starts at about ฿500 one way on our tariff. Other classes cost more. See the [price list](/price-list).",
        },
        {
          question: "Do I need to book ahead?",
          answer:
            "We recommend booking at least 24 hours ahead, especially for night pickups and holidays. Book via the [booking page](/booking).",
        },
        {
          question: "Is there a night surcharge?",
          answer:
            "Yes. Pickups from 00:00–04:59 Bangkok time add ฿200 night driver surcharge per order. Details: [Krabi Airport night transfer](/articles/krabi-airport-night-transfer).",
        },
      ],
    },
    zh: {
      title: "甲米机场到奥南打车：价格、时间与预订方式",
      excerpt:
        "甲米国际机场（KBV）到奥南海滩的接送说明：路程、时间、ECO起步价、车型选择以及如何预订私人接送。",
      metaTitle: "甲米机场到奥南打车 | 价格、时间、在线预订",
      metaDescription:
        "甲米机场到奥南私人接送指南：约24公里、约53分钟、ECO约฿500起，并可在线预订获取电子凭证。",
      coverAlt: "从甲米机场前往奥南海滩的私人接送车辆",
      blocks: [
        {
          type: "p",
          text: "很多旅客在订好酒店后会立刻搜索“甲米机场到奥南打车”，想先确认价格、车程，以及是否需要提前预订。本文依据 Krabi Links Taxi 的正式价目表整理，方便你行前做好准备。",
        },
        {
          type: "h2",
          text: "甲米机场到奥南有多远？",
        },
        {
          type: "p",
          text: "甲米国际机场（KBV）到奥南一带约 24 公里，正常路况大约 50–55 分钟。傍晚或节假日接近奥南入口时可能会稍慢一些。",
        },
        {
          type: "h2",
          text: "价格说明",
        },
        {
          type: "p",
          text: "官方价目中，机场 ↔ 奥南 ECO 单程约 ฿500 起，其他车型按等级递增。常规服务含过路与停车相关费用（以预订页条件为准）。00:00–04:59（曼谷时间）取车另加夜间司机服务费 ฿200，并建议至少提前 24 小时预订。",
        },
        {
          type: "h2",
          text: "如何预订",
        },
        {
          type: "ul",
          items: [
            "上车点选甲米机场，下车点选奥南或奥南酒店",
            "选择日期、时间与车型并填写联系方式",
            "确认后保存电子凭证（e-Voucher）给司机核验",
          ],
        },
        {
          type: "p",
          text: "更多机场到达说明可阅读 [甲米机场接送指南](/articles/krabi-airport-transfer-guide)。也可打开 [机场接送](/airport-transfer) 或 [价格表](/price-list)。准备好后前往 [预订页](/booking)。",
        },
      ],
      faqs: [
        {
          question: "需要多久？",
          answer: "约 50–55 分钟，路程大约 24 公里，视路况而定。",
        },
        {
          question: "起步价多少？",
          answer: "ECO 约 ฿500/单程，其他车型更高。详见 [价格表](/price-list)。",
        },
        {
          question: "有夜间加价吗？",
          answer:
            "曼谷时间 00:00–04:59 取车加收夜间司机服务费 ฿200。详见 [夜间接送](/articles/krabi-airport-night-transfer)。",
        },
      ],
    },
  },

  "krabi-to-koh-lanta-transfer": {
    th: {
      title: "รถรับส่งกระบี่ไปเกาะลันตา วางแผนเส้นทางและราคา",
      excerpt:
        "เตรียมตัวก่อนไปเกาะลันตาจากสนามบินกระบี่หรืออ่าวนาง ระยะเวลาโดยประมาณ โซนราคา และเคล็ดลับจองรถรับส่งส่วนตัวให้ตรงโรงแรม",
      metaTitle: "รถรับส่งกระบี่ไปเกาะลันตา | เวลา ราคา จองส่วนตัว",
      metaDescription:
        "คู่มือรถรับส่งกระบี่–เกาะลันตา จากสนามบินกระบี่หรืออ่าวนาง เวลาเดินทาง ราคาตามโซน และวิธีจองรถส่วนตัวกับ Krabi Links Taxi",
      coverAlt: "รถรับส่งส่วนตัวเส้นทางกระบี่ไปเกาะลันตา",
      blocks: [
        {
          type: "p",
          text: "เกาะลันตาเป็นจุดหมายที่หลายคนอยากไปพักต่อจากกระบี่ แต่เส้นทางยาวกว่าอ่าวนางและมีหลายโซนโรงแรม การค้นหา “รถรับส่งกระบี่ไปเกาะลันตา” จึงมักต้องการทั้งเวลาคร่าว ๆ ราคา และวิธีบอกจุดส่งให้ถูกโซน บทความนี้ช่วยจัดลำดับข้อมูลก่อนกดจอง",
        },
        {
          type: "h2",
          text: "จากสนามบินกระบี่ไปเกาะลันตาใช้เวลานานแค่ไหน",
        },
        {
          type: "p",
          text: "จากสนามบินกระบี่ไปเกาะลันตาโซน 1 ระยะทางโดยประมาณราว 78 กิโลเมตร ใช้เวลาประมาณ 2 ชั่วโมง 50 นาทีในสภาพปกติ (ตามตารางระยะ/เวลาของเรา) เส้นทางรวมสะพานและเส้นทางบนเกาะ ควรเผื่อเวลาหากเดินทางช่วงเย็นหรือฝนตก",
        },
        {
          type: "p",
          text: "หากออกจากอ่าวนางไปลันตาโซน 1 ระยะทางประมาณ 95 กิโลเมตร ใช้เวลาราว 2 ชั่วโมง ราคาและเวลาจะต่างจากเส้นสนามบินเล็กน้อย เพราะจุดเริ่มต้นไม่เหมือนกัน",
        },
        {
          type: "h2",
          text: "โซนเกาะลันตาสำคัญอย่างไรตอนจอง",
        },
        {
          type: "p",
          text: "บนเกาะลันตามีหลายโซน เช่น โซน 1 (พื้นที่อย่างศาลาด่านและหาดใกล้สะพาน) โซน 2 และโซน 3 ทางตอนใต้ไกลขึ้น ราคาในตารางของเราแยกตามโซน เพราะระยะทางไม่เท่ากัน ตอนจองควรระบุชื่อโรงแรมให้ชัด หรือเลือกโซนที่ตรงกับที่พัก",
        },
        {
          type: "ul",
          items: [
            "สนามบินกระบี่ → ลันตาโซน 1: ECO เริ่มต้นประมาณ ฿2,000",
            "อ่าวนาง → ลันตาโซน 1: ECO เริ่มต้นประมาณ ฿2,200",
            "โซน 2–3 ราคาสูงกว่าโซน 1 ตามระยะทางในตาราง",
          ],
        },
        {
          type: "h2",
          text: "ควรเลือกรถแบบไหนไปลันตา",
        },
        {
          type: "p",
          text: "เส้นทางนี้ยาวกว่าทริปชายหาดใกล้สนามบิน การนั่งรถตู้หรือรถที่นั่งสบายกว่ามักเหมาะกับครอบครัวและกระเป๋าหลายใบ หากมีทารกหรือเด็กเล็ก แจ้งเบาะนิรภัยตอนจองได้ ราคาค่าเส้นทางยังคิดตามประเภทรถและโซน ไม่ได้คิดเพิ่มจากจำนวนผู้โดยสารแบบแชร์รถ",
        },
        {
          type: "h2",
          text: "รถรับส่งส่วนตัวต่างจากรถร่วมอย่างไร",
        },
        {
          type: "p",
          text: "รถรับส่งส่วนตัวพาคุณจากจุดรับไปจุดส่งโดยตรง ไม่ต้องรอรวมผู้โดยสารหลายโรงแรม ข้อดีคือคุมเวลาเช็คอินได้ดีกว่า โดยเฉพาะถ้าต้องการถึงลันตาก่อนมืดหรือเชื่อมต่อเรือ/กิจกรรมต่อเนื่อง ข้อแลกเปลี่ยนคือราคาต่อเที่ยวมักสูงกว่ารถร่วม แต่คุ้มสำหรับกลุ่มหรือผู้ที่ต้องการความแน่นอน",
        },
        {
          type: "h2",
          text: "เคล็ดลับจองให้ตรงโรงแรม",
        },
        {
          type: "ul",
          items: [
            "ใส่ชื่อโรงแรมเต็มในช่องจุดส่ง และเลือกโซนให้ตรงตารางราคา",
            "แจ้งเวลารับที่สมจริงหลังลงเครื่อง รวมเวลารับกระเป๋า",
            "ถ้าบินดึก ตรวจเงื่อนไขค่ากลางคืนและเวลาจองล่วงหน้า 24 ชั่วโมง",
            "จองไป-กลับในใบเดียวได้ หากเช็คเอาต์แล้วกลับกระบี่หรือสนามบิน",
          ],
        },
        {
          type: "p",
          text: "ดูบริการรับส่งข้ามพื้นที่เพิ่มในหน้า [รับส่งข้ามจังหวัด](/inter-province-transfer) และเปรียบเทียบเส้นทางใกล้ชายหาดใน [รับส่งชายหาด](/beach-transfer) หากมาจากสนามบิน แนะนำอ่าน [คู่มือรับส่งสนามบินกระบี่](/articles/krabi-airport-transfer-guide) ก่อนเพื่อรู้จุดพบคนขับ",
        },
        {
          type: "h2",
          text: "สรุป",
        },
        {
          type: "p",
          text: "รถรับส่งกระบี่ไปเกาะลันตาเป็นทริประยะกลางที่ควรวางแผนโซนโรงแรมและเวลาให้ชัด ราคาเริ่มต้นในตารางขึ้นกับต้นทาง (สนามบินหรืออ่าวนาง) และโซนบนเกาะ การจองส่วนตัวช่วยให้เดินทางตรงและคุมเวลาได้ดี เมื่อพร้อมแล้วใช้ [หน้าจอง](/booking) เลือกเส้นทางและประเภทรถได้ทันที",
        },
      ],
      faqs: [
        {
          question: "จากสนามบินกระบี่ไปลันตาใช้เวลากี่ชั่วโมง?",
          answer:
            "ไปโซน 1 โดยประมาณราว 2 ชั่วโมง 50 นาที (ประมาณ 78 กม.) ขึ้นกับสภาพถนนและจุดส่งบนเกาะ",
        },
        {
          question: "ราคาเริ่มต้นเท่าไหร่?",
          answer:
            "สนามบินกระบี่–ลันตาโซน 1 รถ ECO เริ่มต้นประมาณ ฿2,000 ตามตารางราคาของเรา ดูเพิ่มใน [ตารางราคา](/price-list)",
        },
        {
          question: "ต้องระบุโซนโรงแรมไหม?",
          answer:
            "ควรระบุ เพราะโซน 1–3 ราคาและระยะต่างกัน การใส่ชื่อโรงแรมช่วยให้คิดราคาและนำทางถูกต้อง",
        },
        {
          question: "จองไป-กลับได้ไหม?",
          answer:
            "ได้ สามารถจองแบบไป-กลับใน [หน้าจอง](/booking) ใบเดียว แล้วได้ e-Voucher สำหรับทั้งสองเที่ยว",
        },
      ],
    },
    en: {
      title: "Krabi to Koh Lanta Transfer: Route Time, Zones & Fares",
      excerpt:
        "Plan your Krabi to Koh Lanta private transfer from the airport or Ao Nang—travel time, zone pricing, and booking tips for the right hotel drop-off.",
      metaTitle: "Krabi to Koh Lanta Transfer | Time, Zones, Private Car",
      metaDescription:
        "Krabi–Koh Lanta transfer guide: airport or Ao Nang start points, zone-based fares, travel time, and how to book a private car with Krabi Links Taxi.",
      coverAlt: "Private transfer vehicle on the Krabi to Koh Lanta route",
      blocks: [
        {
          type: "p",
          text: "Koh Lanta is a popular next stop after Krabi, but the ride is longer than Ao Nang and hotels sit across different zones. Searches for “Krabi to Koh Lanta transfer” usually need time, price, and how to name the drop-off correctly. This article organizes those points before you book.",
        },
        {
          type: "h2",
          text: "How long from Krabi Airport to Koh Lanta?",
        },
        {
          type: "p",
          text: "Krabi Airport to Koh Lanta Zone 1 is about 78 km and roughly 2 hours 50 minutes in normal conditions on our sheet. The route includes bridges and island roads—allow extra time in rain or evening traffic.",
        },
        {
          type: "p",
          text: "From Ao Nang to Lanta Zone 1 is about 95 km and around 2 hours. Time and fare differ from the airport start because the origin changes.",
        },
        {
          type: "h2",
          text: "Why Lanta zones matter when booking",
        },
        {
          type: "p",
          text: "Koh Lanta is priced by zone (Zone 1 near Saladan and northern beaches, then Zone 2 and Zone 3 further south). Our tariff follows those zones. Enter the full hotel name or pick the matching zone so the quote matches the real drop-off.",
        },
        {
          type: "ul",
          items: [
            "Krabi Airport → Lanta Zone 1: ECO from about ฿2,000",
            "Ao Nang → Lanta Zone 1: ECO from about ฿2,200",
            "Zones 2–3 cost more than Zone 1 on the same sheet",
          ],
        },
        {
          type: "h2",
          text: "Best vehicle for the Lanta run",
        },
        {
          type: "p",
          text: "This is a longer ride than short beach hops. A van is often more comfortable for families and multiple bags. Child seats can be requested when booking; the route fare still follows vehicle class and zone, not a shared per-seat model.",
        },
        {
          type: "h2",
          text: "Private transfer vs shared vans",
        },
        {
          type: "p",
          text: "A private transfer goes point to point without collecting other hotels. That helps if you need a fixed check-in time or arrive close to sunset. Shared options can cost less per person, but private cars trade price for timing control—useful for groups.",
        },
        {
          type: "h2",
          text: "Booking tips",
        },
        {
          type: "ul",
          items: [
            "Put the full hotel name in the drop-off field and match the tariff zone",
            "Set a realistic pickup after landing, including baggage time",
            "For late flights, check night surcharge rules and the 24-hour advance booking window",
            "Round-trip is available in one booking if you return to Krabi later",
          ],
        },
        {
          type: "p",
          text: "See [inter-province transfer](/inter-province-transfer) for longer corridor options, and [beach transfer](/beach-transfer) for coastal routes. If you start at KBV, read the [Krabi Airport Transfer Guide](/articles/krabi-airport-transfer-guide) for meeting-point basics.",
        },
        {
          type: "h2",
          text: "Summary",
        },
        {
          type: "p",
          text: "Krabi to Koh Lanta is a mid-distance private transfer—plan the hotel zone and departure point carefully. Sheet prices depend on origin (airport or Ao Nang) and island zone. [Book online](/booking) when ready to lock the car and timing.",
        },
      ],
      faqs: [
        {
          question: "How long is airport to Lanta?",
          answer:
            "About 2 hours 50 minutes to Zone 1 (~78 km), depending on traffic and the exact hotel.",
        },
        {
          question: "Starting fare?",
          answer:
            "Airport–Lanta Zone 1 ECO starts around ฿2,000 on our tariff. See the [price list](/price-list).",
        },
        {
          question: "Do I need the hotel zone?",
          answer:
            "Yes. Zones 1–3 have different distances and prices. The hotel name helps route and quote correctly.",
        },
        {
          question: "Can I book round trip?",
          answer:
            "Yes. One [booking](/booking) can cover outbound and return with a single e-Voucher flow.",
        },
      ],
    },
    zh: {
      title: "甲米到兰塔岛接送：路线时间、分区与价格",
      excerpt:
        "从甲米机场或奥南前往兰塔岛的私人接送说明：车程、分区计价与预订时如何填写酒店。",
      metaTitle: "甲米到兰塔岛接送 | 时间、分区、私人用车",
      metaDescription:
        "甲米–兰塔私人接送指南：机场或奥南出发、按分区计价、车程说明，以及如何在线预订。",
      coverAlt: "甲米前往兰塔岛的私人接送车辆",
      blocks: [
        {
          type: "p",
          text: "兰塔岛常作为甲米之后的下一站，但路程比奥南更长，且酒店分布在不同分区。搜索“甲米到兰塔接送”时，通常需要时间、价格和正确的下车分区信息。",
        },
        {
          type: "h2",
          text: "车程与价格",
        },
        {
          type: "p",
          text: "甲米机场到兰塔 1 区约 78 公里、约 2 小时 50 分钟。奥南到 1 区约 95 公里、约 2 小时。价目按分区区分：机场→1 区 ECO 约 ฿2,000 起；奥南→1 区 ECO 约 ฿2,200 起。",
        },
        {
          type: "h2",
          text: "预订提示",
        },
        {
          type: "ul",
          items: [
            "填写完整酒店名并选择对应分区",
            "预留取行李时间，夜班注意夜间加价与提前 24 小时预订",
            "可在同一订单预订往返",
          ],
        },
        {
          type: "p",
          text: "更多跨区域线路见跨府接送页面；从机场出发可先阅读甲米机场接送指南。",
        },
      ],
      faqs: [
        {
          question: "机场到兰塔要多久？",
          answer: "到 1 区大约 2 小时 50 分钟，视路况与酒店位置而定。",
        },
        {
          question: "起步价？",
          answer: "机场–兰塔 1 区 ECO 约 ฿2,000 起。",
        },
        {
          question: "必须选分区吗？",
          answer: "建议选择，因为 1–3 区距离与价格不同。",
        },
      ],
    },
  },

  "private-car-with-driver-krabi": {
    th: {
      title: "เช่ารถพร้อมคนขับกระบี่ เหมาะกับทริปแบบไหน",
      excerpt:
        "สรุปความต่างระหว่างรถรับส่งจุดต่อจุด กับเช่ารถพร้อมคนขับรายวัน/รายชั่วโมง ในกระบี่ เมื่อไหร่คุ้ม และจองอย่างไร",
      metaTitle: "เช่ารถพร้อมคนขับกระบี่ | รายวัน รายชั่วโมง จองออนไลน์",
      metaDescription:
        "คู่มือเช่ารถพร้อมคนขับกระบี่: ต่างจากแท็กซี่จุดต่อจุดอย่างไร เหมาะกับทัวร์หลายจุดไหม และวิธีจองเหมาวันหรือเหมาชั่วโมงกับ Krabi Links Taxi",
      coverAlt: "บริการเช่ารถพร้อมคนขับในจังหวัดกระบี่",
      blocks: [
        {
          type: "p",
          text: "คำว่า “เช่ารถพร้อมคนขับกระบี่” มักถูกค้นหาเมื่อแผนเที่ยวมีหลายจุดในวันเดียว เช่น สนามบิน → วัด/น้ำพุร้อน → ชายหาด → ร้านอาหาร แล้วกลับโรงแรม การจองแค่เที่ยวเดียวอาจไม่ยืดหยุ่นพอ บทความนี้ช่วยแยกให้ชัดว่ารถรับส่งจุดต่อจุดกับรถเช่าเหมาต่างกันอย่างไร",
        },
        {
          type: "h2",
          text: "รถรับส่งจุดต่อจุด กับ เช่ารถพร้อมคนขับ",
        },
        {
          type: "p",
          text: "รถรับส่งจุดต่อจุดคิดราคาตามเส้นทางในตาราง เช่น สนามบินไปอ่าวนาง เหมาะเมื่อรู้จุดรับ–ส่งชัดและไม่แวะหลายที่ ขณะที่เช่ารถพร้อมคนขับแบบเหมาวันหรือเหมาชั่วโมงเหมาะเมื่อต้องการให้รถอยู่กับคุณในช่วงเวลาหนึ่ง เพื่อแวะหลายจุดโดยไม่ต้องจองทีละเที่ยว",
        },
        {
          type: "h3",
          text: "เมื่อไหร่ควรเลือกเหมาวัน/ชั่วโมง",
        },
        {
          type: "ul",
          items: [
            "มีแผนเที่ยวหลายสถานที่ในวันเดียว",
            "ต้องการให้คนขับรอระหว่างเข้าชมหรือทานอาหาร",
            "กลุ่มครอบครัวที่อยากคุมตารางเองโดยไม่ต่อรถหลายครั้ง",
            "วันเช็คอิน/เช็คเอาต์ที่กระเป๋าเยอะและตารางแน่น",
          ],
        },
        {
          type: "h2",
          text: "รูปแบบที่จองได้บนเว็บไซต์",
        },
        {
          type: "p",
          text: "ในฟอร์มจองของ Krabi Links Taxi มีตัวเลือกประเภทการจองรวมถึงเที่ยวเดียว ไป-กลับ หลายเส้นทาง หลายวัน เช่าเหมาวัน และเช่าเหมาชั่วโมง สำหรับเหมาวันมักใช้วางแผนทริปเต็มวัน ส่วนเหมาชั่วโมงเหมาะกับช่วงสั้นที่ต้องการความยืดหยุ่นหลังรับจากสนามบินหรือก่อนส่งท่าเรือ",
        },
        {
          type: "p",
          text: "เงื่อนไขเวลาขั้นต่ำและรายละเอียดรถแสดงในหน้าจองตามประเภทที่เลือก แนะนำให้ระบุจุดแวะคร่าว ๆ ในช่องคำขอพิเศษ เพื่อให้ทีมจัดประเภทรถและประเมินความเหมาะสมได้ถูกต้อง โดยไม่ต้องเดารายละเอียดเอง",
        },
        {
          type: "h2",
          text: "เลือกรถอย่างไรให้เหมาะกับกลุ่ม",
        },
        {
          type: "p",
          text: "ดูจำนวนผู้ใหญ่ เด็ก และกระเป๋าเป็นหลัก คู่รักอาจใช้รถเก๋งได้ ขณะที่ครอบครัวหรือกลุ่มเพื่อนมักเหมาะกับรถตู้ หากต้องการเบาะเด็ก แจ้งในฟอร์มได้ ราคาแพ็กเกจหรือเส้นทางยังยึดตามประเภทรถที่เลือก ไม่ได้คิดแบบแชร์รายคน",
        },
        {
          type: "h2",
          text: "เช่ารถขับเอง กับ รถพร้อมคนขับ",
        },
        {
          type: "p",
          text: "เว็บไซต์มีทั้งบริการรับส่ง/รถพร้อมคนขับ และแพ็กเกจเช่ารถขับเองในหมวดที่เกี่ยวข้อง การเช่ารถขับเองเหมาะกับผู้มีใบขับขี่และมั่นใจเส้นทาง ส่วนรถพร้อมคนขับเหมาะกับผู้ที่เพิ่งถึงไทย ไม่อยากขับฝั่งซ้าย หรือต้องการพักผ่อนระหว่างทางโดยมีคนขับมืออาชีพดูแล",
        },
        {
          type: "h2",
          text: "วิธีเริ่มจอง",
        },
        {
          type: "ol",
          items: [
            "เข้าหน้าจอง แล้วเลือกประเภท เช่าเหมาวัน หรือ เช่าเหมาชั่วโมง",
            "ระบุวันที่ เวลา และประเภทรถ จากนั้นกรอกข้อมูลลูกค้า",
            "ใส่จุดรับหลักและจุดที่อยากแวะในคำขอพิเศษ",
            "ยืนยันการจองและเก็บ e-Voucher ไว้ติดต่อคนขับ",
          ],
        },
        {
          type: "p",
          text: "หากยังต้องการแค่ส่งจุดเดียว เช่น สนามบินไปโรงแรม ใช้บริการ [รับส่งสนามบิน](/airport-transfer) หรือเช็คราคาเส้นทางจะตรงกว่า สำหรับดูรถรุ่นต่าง ๆ เปิดหน้า [รถของเรา](/fleet) ได้ก่อนตัดสินใจ",
        },
        {
          type: "h2",
          text: "สรุป",
        },
        {
          type: "p",
          text: "เช่ารถพร้อมคนขับกระบี่เหมาะกับทริปที่ยืดหยุ่นและมีหลายจุดหมายในวันเดียว ส่วนแท็กซี่/รถรับส่งจุดต่อจุดเหมาะกับเส้นทางชัดเจนหนึ่งเที่ยว เลือกตามแผนจริงแล้ว [จองผ่านเว็บ](/booking) เพื่อล็อกคิวคนขับล่วงหน้า",
        },
      ],
      faqs: [
        {
          question: "เหมาวันต่างจากจองเที่ยวเดียวอย่างไร?",
          answer:
            "เที่ยวเดียวคิดตามเส้นทางจุดต่อจุด ส่วนเหมาวัน/ชั่วโมงจองช่วงเวลาให้รถอยู่กับคุณเพื่อแวะหลายจุดได้ยืดหยุ่นกว่า",
        },
        {
          question: "ต้องบอกรายละเอียดจุดแวะไหม?",
          answer:
            "ควรระบุคร่าว ๆ ในคำขอพิเศษ เพื่อให้ทีมจัดรถและประเมินความเหมาะสมได้ถูกต้อง",
        },
        {
          question: "มีเบาะเด็กไหม?",
          answer:
            "แจ้งตอนจองได้ โดยใช้สำหรับความปลอดภัยของเด็ก ไม่ได้คิดราคาแยกแบบตั๋วเด็ก",
        },
        {
          question: "จองล่วงหน้ากี่ชั่วโมง?",
          answer:
            "แนะนำอย่างน้อย 24 ชั่วโมงก่อนเวลารับ ตามเงื่อนไขการจองทั่วไป จองได้ที่ [หน้าจอง](/booking)",
        },
      ],
    },
    en: {
      title: "Private Car with Driver in Krabi: When It Makes Sense",
      excerpt:
        "How charter-by-day or by-hour differs from point-to-point taxis in Krabi, who it suits, and how to book with a driver.",
      metaTitle: "Private Car with Driver Krabi | Day & Hourly Hire",
      metaDescription:
        "Compare Krabi private car with driver vs single-route transfers. See when day/hourly hire fits multi-stop days and how to book online.",
      coverAlt: "Private car with driver service in Krabi",
      blocks: [
        {
          type: "p",
          text: "People search “private car with driver Krabi” when the day includes several stops—airport, temple or hot spring, beach, dinner, then hotel. One fixed transfer may feel too rigid. This article separates point-to-point transfers from timed charter hire.",
        },
        {
          type: "h2",
          text: "Point-to-point transfer vs car with driver",
        },
        {
          type: "p",
          text: "Point-to-point pricing follows a route sheet (for example airport to Ao Nang). It fits a clear pickup and drop-off. Day or hourly hire fits when you want the car available for a block of time and multiple stops without booking each leg separately.",
        },
        {
          type: "h3",
          text: "When charter hire is a better fit",
        },
        {
          type: "ul",
          items: [
            "Several sightseeing stops in one day",
            "You need the driver to wait while you visit or eat",
            "Families who want one schedule without changing cars",
            "Busy check-in/out days with lots of luggage",
          ],
        },
        {
          type: "h2",
          text: "Booking types on our site",
        },
        {
          type: "p",
          text: "The Krabi Links Taxi booking form includes one-way, round-trip, multi-route, multi-day, daily charter, and hourly charter. Daily charter suits a full sightseeing day; hourly charter suits shorter flexible windows after landing or before a pier drop-off.",
        },
        {
          type: "p",
          text: "Minimum hours and vehicle details appear on the booking page for the type you select. Add planned stops in special requests so the team can match the right vehicle—without guessing your itinerary.",
        },
        {
          type: "h2",
          text: "Choosing a vehicle",
        },
        {
          type: "p",
          text: "Start from passenger count and bags. Couples often use a sedan; families usually prefer a van. Child seats can be requested in the form. Pricing still follows the selected vehicle product, not a shared per-person ticket model.",
        },
        {
          type: "h2",
          text: "Self-drive rental vs car with driver",
        },
        {
          type: "p",
          text: "The site also lists self-drive rental packages where available. Self-drive suits licensed drivers who want full control. A car with driver suits arrivals who prefer not to drive on the left or want to rest while a professional handles the road.",
        },
        {
          type: "h2",
          text: "How to start",
        },
        {
          type: "ul",
          items: [
            "Open Booking and choose daily or hourly charter",
            "Set date, time, and vehicle, then enter passenger details",
            "Describe main pickup and planned stops in notes",
            "Confirm and keep the e-Voucher for driver contact",
          ],
        },
        {
          type: "p",
          text: "If you only need one drop—airport to hotel—use [airport transfer](/airport-transfer) or the price checker instead. Browse the [fleet](/fleet) page if you want to compare vehicle types first.",
        },
        {
          type: "h2",
          text: "Summary",
        },
        {
          type: "p",
          text: "A private car with driver in Krabi fits flexible multi-stop days. Point-to-point taxis fit single clear routes. Match the product to your real plan, then [book online](/booking) to reserve the driver early.",
        },
      ],
      faqs: [
        {
          question: "Day hire vs one-way transfer?",
          answer:
            "One-way is priced per route. Day/hourly hire reserves the car for a time window so you can make multiple stops more flexibly.",
        },
        {
          question: "Should I list my stops?",
          answer:
            "Yes—add a short outline in special requests so we can match the vehicle properly.",
        },
        {
          question: "Are child seats available?",
          answer:
            "Request them when booking. They support child safety and are not priced like a separate child ticket.",
        },
        {
          question: "How far ahead to book?",
          answer:
            "At least 24 hours before pickup under our usual booking rules. Start on the [booking page](/booking).",
        },
      ],
    },
    zh: {
      title: "甲米包车带司机：适合什么行程",
      excerpt:
        "说明甲米“点对点接送”与“按天/按小时包车带司机”的差异、适合人群，以及如何在线预订。",
      metaTitle: "甲米包车带司机 | 日租/小时租 在线预订",
      metaDescription:
        "甲米包车带司机指南：与单程接送有何不同、何时更适合多点行程，以及如何在 Krabi Links Taxi 预订。",
      coverAlt: "甲米包车带司机服务",
      blocks: [
        {
          type: "p",
          text: "当一天要去多个地点时，旅客常搜索“甲米包车带司机”。点对点接送适合明确的上车与下车点；按天或按小时包车则适合需要司机在一段时间内跟随行程、多次停靠的安排。",
        },
        {
          type: "h2",
          text: "如何选择",
        },
        {
          type: "ul",
          items: [
            "多景点、需要等候：优先日租/小时租",
            "机场到酒店一趟：用机场接送或线路估价即可",
            "预订时在备注中简要列出计划停留点",
          ],
        },
        {
          type: "p",
          text: "可在预订页选择日租或小时租，并查看车队页面比较车型。单程线路请使用接送服务页面。",
        },
      ],
      faqs: [
        {
          question: "包车和单程有什么区别？",
          answer:
            "单程按线路计价；包车按时间段保留车辆，更适合多点行程。",
        },
        {
          question: "需要提前多久订？",
          answer: "建议至少提前 24 小时。",
        },
        {
          question: "可以要儿童座椅吗？",
          answer: "可以在预订时备注需求。",
        },
      ],
    },
  },

  "krabi-airport-night-transfer": {
    th: {
      title: "รถรับส่งสนามบินกระบี่กลางคืน ต้องรู้อะไรบ้าง",
      excerpt:
        "ลงเครื่องดึกที่ KBV แล้วต้องเตรียมอะไร ค่าเซอร์วิสชาร์จกลางคืน เงื่อนไขจองล่วงหน้า และวิธีนัดคนขับให้ชัด",
      metaTitle: "รถรับส่งสนามบินกระบี่กลางคืน | ค่าดึก จองล่วงหน้า",
      metaDescription:
        "คู่มือรถรับส่งสนามบินกระบี่ช่วงกลางคืน: เวลาที่มีเซอร์วิสชาร์จ ฿200 การจองล่วงหน้า 24 ชม. และจุดพบคนขับที่ KBV",
      coverAlt: "บริการรับส่งสนามบินกระบี่ช่วงค่ำถึงดึก",
      blocks: [
        {
          type: "p",
          text: "เที่ยวบินสู่กระบี่บางไฟลต์ถึงช่วงดึก การค้นหา “รถรับส่งสนามบินกระบี่กลางคืน” จึงมักเกี่ยวกับความปลอดภัย ความแน่นอนของคนขับ และค่าใช้จ่ายเพิ่มตอนดึก บทความนี้สรุปเงื่อนไขที่ใช้จริงบนระบบจองของเรา โดยไม่เกินข้อมูลที่มีในกฎการให้บริการ",
        },
        {
          type: "h2",
          text: "ช่วงเวลาที่นับเป็นรับกลางคืน",
        },
        {
          type: "p",
          text: "ตามกฎการจองของ Krabi Links Taxi การรับในช่วง 00:00–04:59 ตามเวลากรุงเทพฯ นับเป็นช่วงที่มีเซอร์วิสชาร์จคนขับกลางคืน ฿200 ต่อหนึ่งออเดอร์ หากเวลารับเป็น 05:00 เป็นต้นไป จะไม่อยู่ในหน้าต่างค่าดึกนี้",
        },
        {
          type: "p",
          text: "ตัวอย่างเช่น เครื่องลง 01:30 และนัดรับ 02:00 จะเข้าเงื่อนไขค่าดึก ส่วนไฟลต์ที่วางแผนรับ 06:00 จะคิดตามราคาเส้นทางปกติโดยไม่มีเซอร์วิสชาร์จกลางคืนตามกฎนี้",
        },
        {
          type: "h2",
          text: "ทำไมควรจองล่วงหน้าเมื่อลงดึก",
        },
        {
          type: "p",
          text: "ช่วงดึกตัวเลือกขนส่งหน้าร้านอาจน้อยกว่ากลางวัน การจองล่วงหน้าอย่างน้อย 24 ชั่วโมงช่วยให้มีคิวคนขับชัดเจน และคุณมีเลขที่จอง/วอชเชอร์ไว้ยืนยันตัวตน แนะนำให้ใส่หมายเลขเที่ยวบินเพื่อให้ทีมติดตามความล่าช้าเบื้องต้นได้ตามกระบวนการปกติของบริการรับสนามบิน",
        },
        {
          type: "h2",
          text: "จุดพบและการติดต่อตอนกลางคืน",
        },
        {
          type: "p",
          text: "ใช้จุดพบตามประเภทเที่ยวบินในคู่มือสนามบินกระบี่ หลังรับกระเป๋าให้เดินไปยังประตูที่ระบุ แล้วหาคนขับถือป้ายชื่อ เก็บเบอร์ในใบจองไว้ในมือถือกรณีต้องการยืนยันจุดพบหลังออกจากเกต",
        },
        {
          type: "h3",
          text: "เช็คลิสต์ก่อนเดินทางดึก",
        },
        {
          type: "ul",
          items: [
            "จองอย่างน้อย 24 ชั่วโมงก่อนเวลารับ",
            "ตรวจว่าเวลารับอยู่ในช่วงค่าดึกหรือไม่",
            "กรอกชื่อโรงแรม/จุดส่งให้ครบ",
            "บันทึก e-Voucher และเบอร์ติดต่อไว้ออฟไลน์หากเป็นไปได้",
          ],
        },
        {
          type: "h2",
          text: "ราคาเส้นทางตอนกลางคืนคิดอย่างไร",
        },
        {
          type: "p",
          text: "ราคาพื้นฐานยังยึดตารางเส้นทางตามปลายทาง เช่น ไปเหนือคลอง ไปอ่าวนาง หรือตัวเมือง จากนั้นหากเวลารับเข้าเงื่อนไขกลางคืน จะเพิ่มเซอร์วิสชาร์จ ฿200 ตามกฎ ตัวเลขรวมแสดงในขั้นตอนจองเมื่อเลือกเวลาแล้ว จึงควรเช็คราคาด้วยเวลาจริงก่อนยืนยัน",
        },
        {
          type: "h2",
          text: "เชื่อมโยงบริการที่เกี่ยวข้อง",
        },
        {
          type: "p",
          text: "สำหรับภาพรวมการรับที่ KBV อ่าน [คู่มือรับส่งสนามบินกระบี่](/articles/krabi-airport-transfer-guide) หากไปอ่าวนางโดยเฉพาะ ดูบทความ [แท็กซี่สนามบินกระบี่ไปอ่าวนาง](/articles/krabi-airport-to-ao-nang-taxi) และเปิดหน้า [รับส่งสนามบิน](/airport-transfer) เพื่อเข้าสู่บริการโดยตรง เมื่อพร้อมแล้วจองผ่าน [หน้าจอง](/booking) โดยเลือกเวลาให้ตรงไฟลต์",
        },
        {
          type: "h2",
          text: "สรุป",
        },
        {
          type: "p",
          text: "รถรับส่งสนามบินกระบี่กลางคืนทำได้ตามปกติเมื่อจองล่วงหน้า และควรรู้หน้าต่างเวลา 00:00–04:59 ที่เพิ่มเซอร์วิสชาร์จ ฿200 การมีวอชเชอร์และจุดพบชัดเจนช่วยให้ลงเครื่องดึกแล้วยังไปต่อโรงแรมได้ราบรื่น",
        },
      ],
      faqs: [
        {
          question: "ค่ารถดึกคิดเพิ่มเท่าไหร่?",
          answer:
            "เซอร์วิสชาร์จคนขับ ฿200 ต่อออเดอร์ หากเวลารับอยู่ในช่วง 00:00–04:59 ตามเวลากรุงเทพฯ",
        },
        {
          question: "รับ 05:00 มีค่าดึกไหม?",
          answer:
            "ตามกฎปัจจุบัน หน้าต่างค่าดึกสิ้นสุดก่อน 05:00 ดังนั้น 05:00 เป็นต้นไปไม่เข้าเงื่อนไขนี้",
        },
        {
          question: "ต้องจองก่อนกี่ชั่วโมง?",
          answer:
            "แนะนำอย่างน้อย 24 ชั่วโมงก่อนเวลารับ โดยเฉพาะไฟลต์ดึก จองได้ที่ [หน้าจอง](/booking)",
        },
        {
          question: "ถ้าไฟลต์ดีเลย์ทำอย่างไร?",
          answer:
            "ใส่หมายเลขเที่ยวบินตอนจอง และใช้เบอร์ในวอชเชอร์ติดต่อทีม/คนขับตามช่องทางที่ระบุในใบจอง",
        },
      ],
    },
    en: {
      title: "Krabi Airport Night Transfer: What to Know Before You Land",
      excerpt:
        "Late arrival at KBV? Learn the night surcharge window, advance booking rule, and how to meet your driver after dark.",
      metaTitle: "Krabi Airport Night Transfer | Surcharge & Booking Tips",
      metaDescription:
        "Krabi Airport night transfer guide: 00:00–04:59 ฿200 driver surcharge, 24-hour advance booking, and clear KBV meeting tips.",
      coverAlt: "Night-time private airport transfer in Krabi",
      blocks: [
        {
          type: "p",
          text: "Some flights reach Krabi late. Searches for “Krabi Airport night transfer” are usually about certainty, meeting the driver, and any night fee. This article sticks to the rules used in our booking system.",
        },
        {
          type: "h2",
          text: "When is a pickup counted as night?",
        },
        {
          type: "p",
          text: "Under Krabi Links Taxi booking rules, pickups from 00:00 to 04:59 Bangkok time include a ฿200 night driver surcharge per order. From 05:00 onward, that night window does not apply.",
        },
        {
          type: "p",
          text: "Example: a 01:30 landing with a 02:00 pickup is inside the night window. A planned 06:00 pickup uses the normal route fare without this night surcharge.",
        },
        {
          type: "h2",
          text: "Why pre-book for late flights",
        },
        {
          type: "p",
          text: "Late hours mean fewer walk-up options. Booking at least 24 hours ahead reserves a driver and gives you a voucher number to verify identity. Add your flight number so the team can follow basic delay updates as part of normal airport pickup handling.",
        },
        {
          type: "h2",
          text: "Meeting point after dark",
        },
        {
          type: "p",
          text: "Follow the Krabi Airport meeting-point guide for domestic vs international doors. After baggage claim, look for the name sign. Keep the booking phone number handy if you need a quick confirmation outside the gate.",
        },
        {
          type: "h3",
          text: "Late-arrival checklist",
        },
        {
          type: "ul",
          items: [
            "Book at least 24 hours before pickup",
            "Check whether your pickup time falls in the night window",
            "Enter the full hotel / drop-off name",
            "Save the e-Voucher and contact number on your phone",
          ],
        },
        {
          type: "h2",
          text: "How night pricing combines with the route fare",
        },
        {
          type: "p",
          text: "The base fare still follows the destination tariff (for example Nuea Khlong, Ao Nang, or Krabi Town). If pickup time is inside the night window, the ฿200 surcharge is added. Check the live total on the booking form with your real time before confirming.",
        },
        {
          type: "h2",
          text: "Related pages",
        },
        {
          type: "p",
          text: "Read the [Krabi Airport Transfer Guide](/articles/krabi-airport-transfer-guide) for arrival basics, and the [Krabi Airport to Ao Nang taxi](/articles/krabi-airport-to-ao-nang-taxi) article for that route. Services are listed under [Airport Transfer](/airport-transfer). Book from the [booking page](/booking) with the correct pickup clock time.",
        },
        {
          type: "h2",
          text: "Summary",
        },
        {
          type: "p",
          text: "Night transfers from Krabi Airport work smoothly when you pre-book and know the 00:00–04:59 surcharge window. A clear voucher and meeting point make late landings far easier.",
        },
      ],
      faqs: [
        {
          question: "How much is the night fee?",
          answer:
            "฿200 night driver surcharge per order for pickups 00:00–04:59 Bangkok time.",
        },
        {
          question: "Is 05:00 charged as night?",
          answer:
            "Under current rules, the night window ends before 05:00, so 05:00 onward is outside that surcharge.",
        },
        {
          question: "How far ahead to book?",
          answer:
            "At least 24 hours before pickup, especially for late flights. Use the [booking page](/booking).",
        },
        {
          question: "What if the flight is delayed?",
          answer:
            "Add the flight number when booking and use the voucher contact channel to coordinate as needed.",
        },
      ],
    },
    zh: {
      title: "甲米机场夜间接送：落地前要知道什么",
      excerpt:
        "红眼航班抵达 KBV 时如何准备：夜间服务费时段、提前预订要求，以及如何与司机会合。",
      metaTitle: "甲米机场夜间接送 | 夜间加价与预订提示",
      metaDescription:
        "甲米机场夜间接送说明：曼谷时间 00:00–04:59 加收司机夜间服务费 ฿200、需提前 24 小时预订，并确认会合点。",
      coverAlt: "甲米机场夜间私人接送",
      blocks: [
        {
          type: "p",
          text: "部分航班深夜抵达甲米。搜索“甲米机场夜间接送”时，重点通常是能否准时接到、如何会合，以及是否有夜间费用。本文仅说明我们预订系统中的既有规则。",
        },
        {
          type: "h2",
          text: "夜间时段与费用",
        },
        {
          type: "p",
          text: "曼谷时间 00:00–04:59 取车加收夜间司机服务费 ฿200/订单；05:00 起不适用该夜间加价。建议至少提前 24 小时预订，并填写航班号与酒店名称。",
        },
        {
          type: "h2",
          text: "会合建议",
        },
        {
          type: "ul",
          items: [
            "按机场会合指南前往对应到达口",
            "保存电子凭证与联系电话",
            "在预订页用真实取车时间查看含夜间费的总价",
          ],
        },
        {
          type: "p",
          text: "可先阅读甲米机场接送指南；去奥南可参考甲米机场到奥南打车一文。",
        },
      ],
      faqs: [
        {
          question: "夜间加多少？",
          answer: "曼谷时间 00:00–04:59 取车加 ฿200。",
        },
        {
          question: "05:00 算夜间吗？",
          answer: "按现行规则，夜间窗口在 05:00 前结束。",
        },
        {
          question: "要提前多久订？",
          answer: "建议至少提前 24 小时。",
        },
      ],
    },
  },
};

export function getArticleBody(
  slug: string,
  locale: string
): ArticleBodyCopy | undefined {
  const entry = articleBodies[slug];
  if (!entry) return undefined;
  const key = (locale === "th" || locale === "zh" ? locale : "en") as LocaleCode;
  return entry[key] ?? entry.en ?? entry.th;
}
