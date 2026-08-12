import fs from "fs";

const transferExtras = {
  en: {
    faqTitle: "FAQ for this service",
    faqSubtitle: "Quick answers before you book.",
    reviewsTitle: "What travelers say",
    allReviews: "All reviews",
    allFaq: "All FAQ",
  },
  th: {
    faqTitle: "คำถามที่พบบ่อยของบริการนี้",
    faqSubtitle: "คำตอบสั้น ๆ ก่อนจอง",
    reviewsTitle: "เสียงจากผู้ใช้บริการ",
    allReviews: "รีวิวทั้งหมด",
    allFaq: "คำถามทั้งหมด",
  },
  zh: {
    faqTitle: "本服务常见问题",
    faqSubtitle: "预订前的快速解答。",
    reviewsTitle: "旅客怎么说",
    allReviews: "全部评价",
    allFaq: "全部问题",
  },
};

const faqs = {
  en: {
    "airport-transfer": {
      "1": {
        q: "What if my flight is delayed?",
        a: "We monitor flights for airport pickups and include about 60 minutes of free waiting from your actual landing time.",
      },
      "2": {
        q: "Do you offer meet & greet?",
        a: "Yes. Add your flight number when booking and request meet & greet — the driver can wait with a name sign at arrivals.",
      },
      "3": {
        q: "How much luggage can I bring?",
        a: "Economy sedans fit about 3 medium bags. For more luggage or a family, choose SUV, van, or VIP van on the booking form.",
      },
      "4": {
        q: "Can you pick up at Phuket Airport too?",
        a: "Yes. We cover Krabi (KBV) and selected Southern Thailand airports including Phuket, with private point-to-point fares.",
      },
    },
    "hotel-transfer": {
      "1": {
        q: "Will you drop me at the hotel lobby?",
        a: "Yes. Transfers are door-to-door to the lobby or villa gate. Add the hotel name or map pin in your booking notes.",
      },
      "2": {
        q: "Can I book a late-night hotel pickup?",
        a: "Yes. Private transfers run for early departures and late check-ins — choose your date and time when you book.",
      },
      "3": {
        q: "Is this a shared shuttle?",
        a: "No. Every booking is a private car for your group only, with no extra hotel stops.",
      },
      "4": {
        q: "Which vehicle is best for a resort stay?",
        a: "Premium sedan or Signature Class suits couples; VIP van is ideal for families and extra luggage.",
      },
    },
    "pier-transfer": {
      "1": {
        q: "How early should I arrive before the ferry?",
        a: "Plan to reach the pier 45–60 minutes before departure from Ao Nang or Krabi Town, especially in peak season.",
      },
      "2": {
        q: "Can the driver help with bags at the pier?",
        a: "Yes. Drivers assist with luggage to the pier entrance so you can check in for your boat more easily.",
      },
      "3": {
        q: "Do you connect to Phi Phi and Railay boats?",
        a: "Yes. Popular drops include Ao Nang Pier and links toward Phi Phi and Railay boat services.",
      },
      "4": {
        q: "Where can I check boat times?",
        a: "See our Boat Schedules page for sample ferry and speedboat times, then book your pier transfer to match.",
      },
    },
    "beach-transfer": {
      "1": {
        q: "Is the fare fixed to the beach?",
        a: "Yes. Private beach transfers use a fixed fare for your vehicle — no meter surprises at the curb.",
      },
      "2": {
        q: "How do I get to Railay Beach?",
        a: "Most guests ride to the Railay pier area, then take a short shared longtail. Tell us when you book if you need pier timing help.",
      },
      "3": {
        q: "Can you drop at beach resorts?",
        a: "Yes. We drop at beachfront hotels and agreed beach access points across Ao Nang, Railay links, and coastal areas.",
      },
      "4": {
        q: "What if I have kids and lots of bags?",
        a: "Choose SUV or van for extra space. Child seats can be requested in advance via booking notes or LINE.",
      },
    },
    "city-transfer": {
      "1": {
        q: "Can I make multiple stops in town?",
        a: "Yes, on request. List each stop in the booking notes so we can plan time and quote fairly.",
      },
      "2": {
        q: "Do you cover Trang and Surat Thani?",
        a: "Yes. City and town transfers include Krabi Town plus selected Southern cities for private point-to-point trips.",
      },
      "3": {
        q: "Is the car air-conditioned?",
        a: "All transfer vehicles are air-conditioned and suitable for daytime heat and longer town hops.",
      },
      "4": {
        q: "Can I book same-day in the city?",
        a: "Often yes, subject to availability. Book online as early as you can, or message us on LINE for urgent trips.",
      },
    },
    "attraction-transfer": {
      "1": {
        q: "Can the driver wait while we visit?",
        a: "Yes. Ask for wait-and-return when you book so the same car can take you back after Emerald Pool, temples, or hot springs.",
      },
      "2": {
        q: "Which sights do you cover?",
        a: "Popular drops include Emerald Pool, Tiger Cave Temple, hot springs, and other Krabi parks and viewpoints.",
      },
      "3": {
        q: "Is a van better for a day of sightseeing?",
        a: "For 4+ guests or wet clothes after swimming, a van or VIP van is more comfortable than a sedan.",
      },
      "4": {
        q: "Do entrance tickets come with the transfer?",
        a: "No. Transfer fares cover transport only. Park and temple tickets are paid on site unless you book a separate tour.",
      },
    },
    "inter-province-transfer": {
      "1": {
        q: "Which vehicle is best for long highway trips?",
        a: "SUV or van for comfort; VIP van or bus for larger groups and more luggage on Krabi–Phuket or Surat routes.",
      },
      "2": {
        q: "Is the price fixed between provinces?",
        a: "Yes. Inter-province transfers use a private fixed fare for your chosen vehicle, agreed before you pay.",
      },
      "3": {
        q: "How early should I book weekend trips?",
        a: "Weekends and holidays fill up early — reserve morning departures at least a day ahead when you can.",
      },
      "4": {
        q: "Are highway tolls included?",
        a: "Quoted transfer prices include standard tolls and parking related to the trip unless noted otherwise at booking.",
      },
    },
  },
  th: {
    "airport-transfer": {
      "1": {
        q: "ถ้าไฟลต์ดีเลย์ทำอย่างไร?",
        a: "เรามีการติดตามไฟลต์สำหรับการรับสนามบิน และรอฟรีประมาณ 60 นาทีนับจากเวลาลงจอดจริง",
      },
      "2": {
        q: "มีบริการพบที่จุดรับสัมภาระไหม?",
        a: "มีครับ ใส่หมายเลขไฟลต์ตอนจองและขอ meet & greet — คนขับถือป้ายชื่อรอได้",
      },
      "3": {
        q: "นำกระเป๋าได้เท่าไหร่?",
        a: "รถเก๋งประหยัดประมาณ 3 ใบ หากสัมภาระเยอะหรือไปเป็นครอบครัว เลือก SUV รถตู้ หรือ VIP ได้",
      },
      "4": {
        q: "รับที่สนามบินภูเก็ตได้ไหม?",
        a: "ได้ครับ ครอบคลุมสนามบินกระบี่ (KBV) และสนามบินภาคใต้ที่เลือก รวมภูเก็ต ด้วยราคาคงที่แบบส่วนตัว",
      },
    },
    "hotel-transfer": {
      "1": {
        q: "ส่งถึงล็อบบี้โรงแรมไหม?",
        a: "ส่งถึงล็อบบี้หรือทางเข้าวิลล่า ใส่ชื่อโรงแรมหรือพิกัดในหมายเหตุการจองได้",
      },
      "2": {
        q: "จองรับดึกหรือเช้ามืดได้ไหม?",
        a: "ได้ครับ บริการรับส่งส่วนตัวรองรับออกเช้าและเช็คอินดึก — เลือกวันเวลาตอนจอง",
      },
      "3": {
        q: "เป็นรถร่วมหรือเปล่า?",
        a: "ไม่ใช่ แต่ละการจองเป็นรถส่วนตัวของกลุ่มคุณเท่านั้น ไม่แวะโรงแรมอื่น",
      },
      "4": {
        q: "รถแบบไหนเหมาะกับรีสอร์ท?",
        a: "คู่รักเหมาะกับพรีเมียมหรือ Signature ส่วนครอบครัวและสัมภาระเยอะแนะนำ VIP van",
      },
    },
    "pier-transfer": {
      "1": {
        q: "ควรถึงท่าเรือก่อนกี่นาที?",
        a: "แนะนำถึงท่าก่อนเรือออก 45–60 นาที จากอ่าวนางหรือเมืองกระบี่ โดยเฉพาะช่วงไฮซีซัน",
      },
      "2": {
        q: "คนขับช่วยยกกระเป๋าที่ท่าไหม?",
        a: "ช่วยยกถึงทางเข้าท่า เพื่อให้คุณเช็คอินเรือได้สะดวกขึ้น",
      },
      "3": {
        q: "เชื่อมเรือไปพีพีและไร่เลย์ได้ไหม?",
        a: "ได้ครับ จุดยอดนิยมคือท่าอ่าวนาง และเส้นทางเชื่อมไปพีพีกับไร่เลย์",
      },
      "4": {
        q: "ดูตารางเรือได้ที่ไหน?",
        a: "ดูหน้าตารางเรือสำหรับตัวอย่างเวลาเฟอร์รี่และสปีดโบ๊ท แล้วจองรถรับส่งท่าให้ตรงรอบ",
      },
    },
    "beach-transfer": {
      "1": {
        q: "ราคาถึงชายหาดคงที่ไหม?",
        a: "คงที่ตามประเภทรถที่เลือก ไม่มีมิเตอร์เซอร์ไพรส์หน้าสนามบิน",
      },
      "2": {
        q: "ไปไร่เลย์อย่างไร?",
        a: "ส่วนใหญ่ส่งถึงโซนท่าไร่เลย์ แล้วต่อเรือหางยาวระยะสั้น แจ้งตอนจองได้ถ้าต้องการคำแนะนำเวลา",
      },
      "3": {
        q: "ส่งถึงรีสอร์ทริมหาดได้ไหม?",
        a: "ได้ครับ ส่งถึงโรงแรมริมหาดและจุดขึ้นลงที่ตกลงไว้ อ่าวนาง ไร่เลย์ และชายฝั่ง",
      },
      "4": {
        q: "มีเด็กและกระเป๋าเยอะทำอย่างไร?",
        a: "เลือก SUV หรือรถตู้ และขอคาร์ซีทล่วงหน้าผ่านหมายเหตุหรือ LINE ได้",
      },
    },
    "city-transfer": {
      "1": {
        q: "แวะหลายจุดในเมืองได้ไหม?",
        a: "ได้ตามคำขอ ระบุจุดแวะในหมายเหตุการจอง เพื่อวางแผนเวลาและราคาให้เหมาะสม",
      },
      "2": {
        q: "ไปตรังและสุราษฎร์ฯ ได้ไหม?",
        a: "ได้ครับ ครอบคลุมเมืองกระบี่และเมืองภาคใต้ที่เลือก สำหรับเดินทางจุดต่อจุด",
      },
      "3": {
        q: "รถมีแอร์ไหม?",
        a: "รถรับส่งทุกคันมีแอร์ เหมาะกับอากาศร้อนและเส้นทางในเมืองที่ยาวขึ้น",
      },
      "4": {
        q: "จองวันเดียวกันในเมืองได้ไหม?",
        a: "มักได้ขึ้นกับคิวรถ จองออนไลน์ให้เร็วที่สุด หรือทัก LINE หากเร่งด่วน",
      },
    },
    "attraction-transfer": {
      "1": {
        q: "คนขับรอระหว่างเที่ยวได้ไหม?",
        a: "ได้ครับ ขอแบบรอรับกลับตอนจอง เพื่อใช้คันเดิมกลับจากสระมรกต วัด หรือน้ำพุร้อน",
      },
      "2": {
        q: "ไปจุดไหนได้บ้าง?",
        a: "จุดยอดนิยมเช่น สระมรกต วัดถ้ำเสือ น้ำพุร้อน และอุทยาน/จุดชมวิวในกระบี่",
      },
      "3": {
        q: "ทัวร์วันเดียวควรใช้รถตู้ไหม?",
        a: "ถ้ามี 4 คนขึ้นไปหรือเสื้อผ้าเปียกหลังว่ายน้ำ รถตู้หรือ VIP สะดวกกว่ารถเก๋ง",
      },
      "4": {
        q: "ค่ารถรวมบัตรเข้าชมไหม?",
        a: "ไม่รวม ราคาเป็นค่าเดินทางเท่านั้น บัตรอุทยาน/วัดชำระหน้างาน เว้นแต่จองทัวร์แยก",
      },
    },
    "inter-province-transfer": {
      "1": {
        q: "รถแบบไหนเหมาะทางไกล?",
        a: "SUV หรือรถตู้สำหรับความสบาย VIP หรือบัสสำหรับกลุ่มใหญ่และสัมภาระบนเส้นทางกระบี่–ภูเก็ตหรือสุราษฎร์ฯ",
      },
      "2": {
        q: "ราคาข้ามจังหวัดคงที่ไหม?",
        a: "คงที่ตามประเภทรถที่เลือก ตกลงราคาก่อนชำระเงิน",
      },
      "3": {
        q: "สุดสัปดาห์ควรจองล่วงหน้าแค่ไหน?",
        a: "เสาร์–อาทิตย์และวันหยุดจองเต็มเร็ว แนะนำจองรอบเช้าอย่างน้อยล่วงหน้า 1 วัน",
      },
      "4": {
        q: "ค่าทางด่วนรวมไหม?",
        a: "ราคาที่แสดงรวมค่าทางด่วนและที่จอดมาตรฐานที่เกี่ยวข้อง เว้นแต่ระบุเป็นอย่างอื่นตอนจอง",
      },
    },
  },
  zh: {
    "airport-transfer": {
      "1": {
        q: "航班延误怎么办？",
        a: "机场接机我们会跟踪航班，并自实际落地起提供约 60 分钟免费等候。",
      },
      "2": {
        q: "提供接机举牌吗？",
        a: "可以。预订时填写航班号并申请接机服务，司机可在到达厅举牌等候。",
      },
      "3": {
        q: "可以带多少行李？",
        a: "经济轿车大约可放 3 件中号行李。行李较多或家庭出行请选择 SUV、面包车或 VIP。",
      },
      "4": {
        q: "普吉机场也能接吗？",
        a: "可以。覆盖甲米（KBV）及部分泰南机场（含普吉），私人点对点固定价。",
      },
    },
    "hotel-transfer": {
      "1": {
        q: "会送到酒店大堂吗？",
        a: "会送到大堂或别墅门口。请在备注中填写酒店名称或地图定位。",
      },
      "2": {
        q: "可以预订深夜或清晨接送吗？",
        a: "可以。私人接送支持早班出发与深夜入住，预订时选择日期和时间即可。",
      },
      "3": {
        q: "是拼车吗？",
        a: "不是。每次预订都是您的专车，不会额外停靠其他酒店。",
      },
      "4": {
        q: "住度假村选什么车？",
        a: "情侣适合高级轿车或 Signature；家庭与大件行李建议 VIP 面包车。",
      },
    },
    "pier-transfer": {
      "1": {
        q: "应提前多久到码头？",
        a: "建议在奥南或甲米镇开船前 45–60 分钟到达，旺季尤其如此。",
      },
      "2": {
        q: "司机会在码头帮忙搬行李吗？",
        a: "会协助行李至码头入口，方便您办理登船。",
      },
      "3": {
        q: "能衔接皮皮岛、莱利的船班吗？",
        a: "可以。热门落客点包括奥南码头，并可衔接前往皮皮与莱利的船班。",
      },
      "4": {
        q: "在哪里查看船班时间？",
        a: "请查看船班时刻页面了解渡轮与快艇参考时间，再预订匹配的码头接送。",
      },
    },
    "beach-transfer": {
      "1": {
        q: "到海滩是固定价格吗？",
        a: "是。私人海滩接送按所选车型固定计价，无路边计价器意外。",
      },
      "2": {
        q: "去莱利怎么走？",
        a: "多数客人送到莱利码头区域后换乘短程长尾船。预订时可告知我们以便安排时间。",
      },
      "3": {
        q: "可以送到海滨度假村吗？",
        a: "可以。送到海滨酒店及约定上下客点，覆盖奥南、莱利衔接与沿海区域。",
      },
      "4": {
        q: "有孩子且行李多怎么办？",
        a: "请选择 SUV 或面包车。可提前在备注或 LINE 申请儿童座椅。",
      },
    },
    "city-transfer": {
      "1": {
        q: "城里可以多站停靠吗？",
        a: "可以按需安排。请在备注列出各站，便于规划时间与报价。",
      },
      "2": {
        q: "去董里、素叻他尼可以吗？",
        a: "可以。城区接送覆盖甲米镇及部分泰南城镇的点对点行程。",
      },
      "3": {
        q: "车上有空调吗？",
        a: "所有接送车辆均配备空调，适合白天炎热与较长城区路程。",
      },
      "4": {
        q: "可以当天预订城区接送吗？",
        a: "多数情况下可以，视车辆空档而定。请尽早在线预订，紧急行程可 LINE 联系。",
      },
    },
    "attraction-transfer": {
      "1": {
        q: "参观时司机可以等候吗？",
        a: "可以。预订时选择等候返回，同一辆车可在翡翠池、寺庙或温泉结束后送回。",
      },
      "2": {
        q: "覆盖哪些景点？",
        a: "热门包括翡翠池、虎穴寺、温泉，以及甲米其他公园与观景点。",
      },
      "3": {
        q: "一日游更适合面包车吗？",
        a: "4 人以上或游泳后衣物潮湿时，面包车或 VIP 比轿车更舒适。",
      },
      "4": {
        q: "车费含门票吗？",
        a: "不含。接送仅含交通。公园与寺庙门票现场支付，除非另订行程套餐。",
      },
    },
    "inter-province-transfer": {
      "1": {
        q: "长途高速选什么车？",
        a: "舒适选 SUV 或面包车；大团体与行李多可选 VIP 或巴士（甲米–普吉、素叻等）。",
      },
      "2": {
        q: "跨省是固定价格吗？",
        a: "是。按所选车型提供私人固定价，付款前确认。",
      },
      "3": {
        q: "周末要提前多久订？",
        a: "周末与节假日易满位，建议尽量提前至少一天预订早班出发。",
      },
      "4": {
        q: "高速费包含吗？",
        a: "报价通常包含行程相关的标准过路费与停车费，除非预订时另有说明。",
      },
    },
  },
};

for (const loc of ["en", "th", "zh"]) {
  const p = `src/messages/${loc}.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  Object.assign(j.Transfer, transferExtras[loc]);
  for (const [pageKey, faq] of Object.entries(faqs[loc])) {
    if (!j.TransferPages[pageKey]) continue;
    j.TransferPages[pageKey].faq = faq;
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  console.log("ok", loc);
}
