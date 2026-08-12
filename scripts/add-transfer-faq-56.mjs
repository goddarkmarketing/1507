import fs from "fs";

const extra = {
  en: {
    "airport-transfer": {
      "5": {
        q: "How do I pay for airport transfer?",
        a: "Pay online by bank transfer, card, or PromptPay when you book. Cash to the driver can be arranged in advance if needed.",
      },
      "6": {
        q: "When do I get driver details?",
        a: "Driver name, phone, and car details are shared before pickup — usually within 24 hours of your transfer time.",
      },
    },
    "hotel-transfer": {
      "5": {
        q: "Can I change the hotel drop-off after booking?",
        a: "Yes, if the new hotel is nearby. Message us on LINE with your booking number as early as possible.",
      },
      "6": {
        q: "Do you wait if check-in is delayed?",
        a: "Short waits at the hotel are fine. For longer delays, tell us on LINE so the driver can adjust.",
      },
    },
    "pier-transfer": {
      "5": {
        q: "What if my boat is cancelled?",
        a: "Contact us right away. We can reschedule the transfer or help adjust the drop-off when boat operators change times.",
      },
      "6": {
        q: "Can I book hotel → pier → hotel the same day?",
        a: "Yes. Add both legs in one booking as multi-route, or book two one-way transfers with matching times.",
      },
    },
    "beach-transfer": {
      "5": {
        q: "Do you go to quieter beaches as well?",
        a: "Yes, where road access allows. Add the beach or resort name in notes and we’ll confirm the best drop-off point.",
      },
      "6": {
        q: "Is round-trip to the beach cheaper?",
        a: "Round-trip bookings include a small discount versus two separate one-ways. Use the price checker to compare.",
      },
    },
    "city-transfer": {
      "5": {
        q: "Can I keep the car for a few hours in town?",
        a: "For waiting or hourly use, choose hourly charter or note wait time when you book so we can quote correctly.",
      },
      "6": {
        q: "Do you pick up from bus or train stations?",
        a: "Yes, where listed in our locations. Select the station as pickup or drop-off on the booking form.",
      },
    },
    "attraction-transfer": {
      "5": {
        q: "Can we visit more than one attraction?",
        a: "Yes. List the order of stops in booking notes, or book a multi-route / day charter for a full sightseeing loop.",
      },
      "6": {
        q: "What time should we leave for morning sights?",
        a: "For popular spots like Emerald Pool, an early start helps avoid heat and crowds — we can suggest a pickup time when you book.",
      },
    },
    "inter-province-transfer": {
      "5": {
        q: "Are rest stops included on long routes?",
        a: "Drivers can stop briefly for toilets or snacks on long highway trips. Mention preferred breaks in your notes.",
      },
      "6": {
        q: "Can you do Krabi to Phuket with hotel drop-off?",
        a: "Yes. Choose your Phuket hotel or airport as the drop-off — private point-to-point, not a shared bus.",
      },
    },
  },
  th: {
    "airport-transfer": {
      "5": {
        q: "ชำระค่าบริการรับส่งสนามบินอย่างไร?",
        a: "ชำระออนไลน์ผ่านโอนเงิน บัตร หรือพร้อมเพย์ตอนจอง หากต้องการจ่ายเงินสดให้คนขับ แจ้งล่วงหน้าได้",
      },
      "6": {
        q: "เมื่อไหร่จะได้ข้อมูลคนขับ?",
        a: "ชื่อคนขับ เบอร์โทร และข้อมูลรถส่งก่อนเวลารับ โดยทั่วไปภายใน 24 ชั่วโมงก่อนเดินทาง",
      },
    },
    "hotel-transfer": {
      "5": {
        q: "เปลี่ยนโรงแรมปลายทางหลังจองได้ไหม?",
        a: "ได้หากโรงแรมใหม่อยู่ใกล้กัน ทัก LINE พร้อมเลขที่จองให้เร็วที่สุด",
      },
      "6": {
        q: "ถ้ารอเช็คอินนาน คนขับรอได้ไหม?",
        a: "รอสั้น ๆ ที่โรงแรมได้ หากล่าช้ามาก แจ้งทาง LINE เพื่อให้คนขับปรับเวลา",
      },
    },
    "pier-transfer": {
      "5": {
        q: "ถ้าเรือยกเลิกทำอย่างไร?",
        a: "ติดต่อเราทันที สามารถเลื่อนเวลารับส่ง หรือปรับจุดส่งเมื่อผู้ให้บริการเรือเปลี่ยนเวลา",
      },
      "6": {
        q: "จองโรงแรม→ท่า→โรงแรมวันเดียวได้ไหม?",
        a: "ได้ เพิ่มสองช่วงในจองเดียวแบบหลายเส้นทาง หรือจองขาไป-ขากลับแยกให้เวลาตรงกัน",
      },
    },
    "beach-transfer": {
      "5": {
        q: "ไปชายหาดที่เงียบกว่าได้ไหม?",
        a: "ได้หากเข้าถึงทางถนนได้ ใส่ชื่อหาดหรือรีสอร์ทในหมายเหตุ เราจะยืนยันจุดส่งที่เหมาะสม",
      },
      "6": {
        q: "จองไป-กลับชายหาดถูกกว่าไหม?",
        a: "การจองไป-กลับมีส่วนลดเล็กน้อยเทียบกับจองขาเดียวสองครั้ง ใช้ตัวเช็คราคาเปรียบเทียบได้",
      },
    },
    "city-transfer": {
      "5": {
        q: "จองรถรอในเมืองสองสามชั่วโมงได้ไหม?",
        a: "ถ้าต้องการรอหรือเช่ารายชั่วโมง เลือกแบบเช่ารายชั่วโมง หรือระบุเวลารอตอนจองเพื่อให้เสนอราคาถูกต้อง",
      },
      "6": {
        q: "รับจากสถานีรถทัวร์หรือรถไฟได้ไหม?",
        a: "ได้หากมีในรายการจุดรับ-ส่งของเรา เลือกสถานีเป็นต้นทางหรือปลายทางในฟอร์มจอง",
      },
    },
    "attraction-transfer": {
      "5": {
        q: "เที่ยวหลายจุดในวันเดียวได้ไหม?",
        a: "ได้ ระบุลำดับจุดแวะในหมายเหตุ หรือจองหลายเส้นทาง/เช่ารายวันสำหรับลูปท่องเที่ยว",
      },
      "6": {
        q: "ควรออกกี่โมงสำหรับเที่ยวเช้า?",
        a: "จุดยอดนิยมอย่างสระมรกต แนะนำออกเช้าเพื่อเลี่ยงแดดและคนเยอะ — แนะนำเวลารับตอนจองได้",
      },
    },
    "inter-province-transfer": {
      "5": {
        q: "ทางไกลแวะพักได้ไหม?",
        a: "คนขับแวะสั้น ๆ เพื่อเข้าห้องน้ำหรือซื้อของว่างได้ ระบุจุดพักที่ต้องการในหมายเหตุ",
      },
      "6": {
        q: "กระบี่ไปภูเก็ตแล้วส่งโรงแรมได้ไหม?",
        a: "ได้ เลือกโรงแรมหรือสนามบินภูเก็ตเป็นปลายทาง — เป็นรถส่วนตัวจุดต่อจุด ไม่ใช่รถร่วม",
      },
    },
  },
  zh: {
    "airport-transfer": {
      "5": {
        q: "机场接送如何付款？",
        a: "预订时可在线通过银行转账、银行卡或 PromptPay 付款。如需向司机付现金，请提前说明。",
      },
      "6": {
        q: "什么时候能收到司机信息？",
        a: "司机姓名、电话与车辆信息会在上车前发送，通常在行程前 24 小时内。",
      },
    },
    "hotel-transfer": {
      "5": {
        q: "预订后可以更改酒店落客点吗？",
        a: "若新酒店距离相近可以。请尽快通过 LINE 提供订单号联系我们。",
      },
      "6": {
        q: "入住延误时司机会等候吗？",
        a: "酒店短时等候没问题。若延误较长，请通过 LINE 告知以便司机调整。",
      },
    },
    "pier-transfer": {
      "5": {
        q: "船班取消怎么办？",
        a: "请立即联系我们。可改期接送，或在船公司调整时间后协助更改落客安排。",
      },
      "6": {
        q: "可以同一天酒店→码头→酒店吗？",
        a: "可以。在一笔订单中添加多段行程，或分别预订去程与回程并对齐时间。",
      },
    },
    "beach-transfer": {
      "5": {
        q: "也能去较安静的海滩吗？",
        a: "道路可达即可。请在备注填写海滩或度假村名称，我们会确认合适落客点。",
      },
      "6": {
        q: "海滩往返会更便宜吗？",
        a: "往返预订通常比两笔单程略有优惠。可用价格查询工具比较。",
      },
    },
    "city-transfer": {
      "5": {
        q: "可以在城里包车等候几小时吗？",
        a: "如需等候或按小时用车，请选择按小时包车，或在预订时注明等候时间以便报价。",
      },
      "6": {
        q: "可以从汽车站或火车站接吗？",
        a: "可以，若地点在我们的列表中。在预订表单选择车站为上车或下车点即可。",
      },
    },
    "attraction-transfer": {
      "5": {
        q: "一天可以去多个景点吗？",
        a: "可以。在备注列出停靠顺序，或预订多段行程/日包车完成观光环线。",
      },
      "6": {
        q: "早上去景点建议几点出发？",
        a: "热门景点如翡翠池建议早出发，避开酷热与人潮 — 预订时可帮您建议上车时间。",
      },
    },
    "inter-province-transfer": {
      "5": {
        q: "长途可以中途休息吗？",
        a: "长途高速可短暂停车上厕所或买零食。请在备注写明希望的休息安排。",
      },
      "6": {
        q: "甲米到普吉可以送到酒店吗？",
        a: "可以。选择普吉酒店或机场作为下车点 — 私人点对点，非拼车巴士。",
      },
    },
  },
};

for (const loc of ["en", "th", "zh"]) {
  const p = `src/messages/${loc}.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const [page, items] of Object.entries(extra[loc])) {
    Object.assign(j.TransferPages[page].faq, items);
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  console.log("ok", loc);
}
