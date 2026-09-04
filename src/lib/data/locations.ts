import type { Location } from "@/lib/types";

export const locations: Location[] = [
  {
    "id": "kbv-airport",
    "name": "Krabi International Airport (KBV)",
    "nameTh": "ท่าอากาศยานกระบี่",
    "type": "airport",
    "province": "Krabi",
    "connections": [
      "krabi-town",
      "krabi-bus-terminal",
      "chao-fah-pier",
      "klong-jilad-pier",
      "ao-nam-mao",
      "ao-nang-beach",
      "klong-muang",
      "tubkaak-beach",
      "ao-tha-lane",
      "had-yao-krabi",
      "laem-kruat-pier",
      "boat-lagoon-krabi",
      "hua-hin-pier",
      "koh-lanta-z1",
      "koh-lanta-z2",
      "koh-lanta-z3",
      "pak-meng-pier",
      "kuan-tung-ku-pier",
      "hat-yao-pier-trang",
      "trang-airport",
      "trang-railway",
      "trang-town",
      "ratchaprapha-pier",
      "khao-sok",
      "thap-lamu-pier",
      "khao-lak-z1",
      "khao-lak-z2",
      "natai-beach",
      "mai-khao-beach",
      "samet-nangshe",
      "phuket-airport",
      "nai-yang-beach",
      "laguna-phuket",
      "kamala-beach",
      "phuket-town",
      "patong-beach",
      "kata-beach",
      "karon-beach",
      "chalong",
      "rawai-beach",
      "surat-airport",
      "surat-railway",
      "surat-thani",
      "tapee-pier",
      "lomprayah-donsak",
      "donsak-pier",
      "khanom",
      "pak-bara-pier",
      "satun-town",
      "tammalang-pier",
      "wang-prachan",
      "hat-yai-airport",
      "hat-yai-bus",
      "hat-yai-town",
      "dan-nok"
    ]
  },
  {
    "id": "krabi-town",
    "name": "Krabi Town",
    "nameTh": "ตัวเมืองกระบี่",
    "type": "city",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "krabi-bus-terminal",
    "name": "Krabi Bus Terminal",
    "nameTh": "สถานีขนส่งกระบี่",
    "type": "bus_station",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "chao-fah-pier",
    "name": "Chao Fah Pier",
    "nameTh": "ท่าเรือเจ้าฟ้า",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "klong-jilad-pier",
    "name": "Klong Jilad Pier",
    "nameTh": "ท่าเรือคลองจิหลาด",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "ao-nam-mao",
    "name": "Ao Nam Mao",
    "nameTh": "อ่าวน้ำเมา",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "ao-nang-beach",
    "name": "Ao Nang",
    "nameTh": "อ่าวนาง",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport",
      "phuket-airport",
      "koh-lanta-z1",
      "koh-lanta-z2",
      "koh-lanta-z3"
    ]
  },
  {
    "id": "klong-muang",
    "name": "Klong Muang",
    "nameTh": "คลองม่วง",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "tubkaak-beach",
    "name": "Tubkaak Beach",
    "nameTh": "หาดทับแขก",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "ao-tha-lane",
    "name": "Ao Tha Lane",
    "nameTh": "อ่าวท่าเลน",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "had-yao-krabi",
    "name": "Had Yao",
    "nameTh": "หาดยาว",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "laem-kruat-pier",
    "name": "Laem Kruat Pier",
    "nameTh": "ท่าเรือแหลมกรวด",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "boat-lagoon-krabi",
    "name": "Boat Lagoon Krabi",
    "nameTh": "โบ๊ทลากูน กระบี่",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "hua-hin-pier",
    "name": "Hua Hin Pier",
    "nameTh": "ท่าเรือหัวหิน",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "koh-lanta-z1",
    "name": "Koh Lanta Zone 1 (Saladan, Koh Kwang, Klong Dao, Phra Ae / Long Beach, Klong Khong)",
    "nameTh": "เกาะลันตา โซน 1 (ศาลาด่าน, เกาะกวาง, คลองดาว, พระแอะ/ลองบีช, คลองโขง)",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport",
      "phuket-airport",
      "ao-nang-beach"
    ]
  },
  {
    "id": "koh-lanta-z2",
    "name": "Koh Lanta Zone 2 (Klong Nin, Old Town, Kantiang)",
    "nameTh": "เกาะลันตา โซน 2 (คลองนิน, เมืองเก่าลันตา, กันเตียง)",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport",
      "phuket-airport",
      "ao-nang-beach"
    ]
  },
  {
    "id": "koh-lanta-z3",
    "name": "Koh Lanta Zone 3 (Nui Bay, Klong Jak, National Park)",
    "nameTh": "เกาะลันตา โซน 3 (นุ้ยเบย์, คลองจาก, อุทยานแห่งชาติ)",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport",
      "phuket-airport",
      "ao-nang-beach"
    ]
  },
  {
    "id": "pak-meng-pier",
    "name": "Pak Meng Pier",
    "nameTh": "ท่าเรือปากเมง",
    "type": "pier",
    "province": "Trang",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "kuan-tung-ku-pier",
    "name": "Kuan Tung Ku Pier",
    "nameTh": "ท่าเรือควนตุ้งกู",
    "type": "pier",
    "province": "Trang",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "hat-yao-pier-trang",
    "name": "Hat Yao Pier, Trang",
    "nameTh": "ท่าเรือหาดยาว จ.ตรัง",
    "type": "pier",
    "province": "Trang",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "trang-airport",
    "name": "Trang Airport",
    "nameTh": "สนามบินตรัง",
    "type": "airport",
    "province": "Trang",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "trang-railway",
    "name": "Trang Railway Station",
    "nameTh": "สถานีรถไฟตรัง",
    "type": "train_station",
    "province": "Trang",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "trang-town",
    "name": "Trang Town",
    "nameTh": "ตัวเมืองตรัง",
    "type": "city",
    "province": "Trang",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "ratchaprapha-pier",
    "name": "Cheow Lan Dam Pier / Ratchaprapha Pier",
    "nameTh": "ท่าเรือเขื่อนเชี่ยวหลาน / ท่าเรือราชประภา",
    "type": "pier",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "khao-sok",
    "name": "Khao Sok",
    "nameTh": "เขาสก",
    "type": "park",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "thap-lamu-pier",
    "name": "Thap Lamu Pier",
    "nameTh": "ท่าเรือทับละมุ",
    "type": "pier",
    "province": "Phang Nga",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "khao-lak-z1",
    "name": "Khao Lak Zone 1 (South Khao Lak, Nang Thong, Bang Niang)",
    "nameTh": "เขาหลัก โซน 1 (เขาหลักใต้, นางทอง, บางเนียง)",
    "type": "beach",
    "province": "Phang Nga",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "khao-lak-z2",
    "name": "Khao Lak Zone 2 (Khuk Khak, Coral Cape, Pak Weep, Bang Sak)",
    "nameTh": "เขาหลัก โซน 2 (คึกคัก, แหลมปะการัง, ปากวีป, บางสัก)",
    "type": "beach",
    "province": "Phang Nga",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "natai-beach",
    "name": "Natai Beach",
    "nameTh": "หาดนาใต้",
    "type": "beach",
    "province": "Phang Nga",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "mai-khao-beach",
    "name": "Mai Khao Beach",
    "nameTh": "หาดไม้ขาว",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "samet-nangshe",
    "name": "Samet Nangshe",
    "nameTh": "เสม็ดนางชี",
    "type": "viewpoint",
    "province": "Phang Nga",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "phuket-airport",
    "name": "Phuket Airport",
    "nameTh": "สนามบินภูเก็ต",
    "type": "airport",
    "province": "Phuket",
    "connections": [
      "kbv-airport",
      "ao-nang-beach",
      "koh-lanta-z1",
      "koh-lanta-z2",
      "koh-lanta-z3"
    ]
  },
  {
    "id": "nai-yang-beach",
    "name": "Nai Yang Beach",
    "nameTh": "หาดในยาง",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "laguna-phuket",
    "name": "Laguna Phuket",
    "nameTh": "ลากูน่า ภูเก็ต",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "kamala-beach",
    "name": "Kamala Beach",
    "nameTh": "หาดกมลา",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "phuket-town",
    "name": "Phuket Town",
    "nameTh": "ตัวเมืองภูเก็ต",
    "type": "city",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "patong-beach",
    "name": "Patong Beach",
    "nameTh": "หาดป่าตอง",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "kata-beach",
    "name": "Kata Beach",
    "nameTh": "หาดกะตะ",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "karon-beach",
    "name": "Karon Beach",
    "nameTh": "หาดกะรน",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "chalong",
    "name": "Chalong",
    "nameTh": "ฉลอง",
    "type": "city",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "rawai-beach",
    "name": "Rawai Beach",
    "nameTh": "หาดราไวย์",
    "type": "beach",
    "province": "Phuket",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "surat-airport",
    "name": "Surat Thani Airport",
    "nameTh": "สนามบินสุราษฎร์ธานี",
    "type": "airport",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "surat-railway",
    "name": "Surat Thani Railway Station",
    "nameTh": "สถานีรถไฟสุราษฎร์ธานี",
    "type": "train_station",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "surat-thani",
    "name": "Surat Thani Town",
    "nameTh": "ตัวเมืองสุราษฎร์ธานี",
    "type": "city",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "tapee-pier",
    "name": "Tapee River Pier, Surat Thani",
    "nameTh": "ท่าเรือแม่น้ำตาปี สุราษฎร์ธานี",
    "type": "pier",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "lomprayah-donsak",
    "name": "Lomprayah Laem Thuat Donsak Pier",
    "nameTh": "ท่าเรือลมพระยา แหลมทวด ดอนสัก",
    "type": "pier",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "donsak-pier",
    "name": "Donsak Pier",
    "nameTh": "ท่าเรือดอนสัก",
    "type": "pier",
    "province": "Surat Thani",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "khanom",
    "name": "Khanom",
    "nameTh": "ขนอม",
    "type": "beach",
    "province": "Nakhon Si Thammarat",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "pak-bara-pier",
    "name": "Pak Bara Pier, Satun",
    "nameTh": "ท่าเรือปากบารา จ.สตูล",
    "type": "pier",
    "province": "Satun",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "satun-town",
    "name": "Satun Town",
    "nameTh": "ตัวเมืองสตูล",
    "type": "city",
    "province": "Satun",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "tammalang-pier",
    "name": "Tammalang Pier, Satun",
    "nameTh": "ท่าเรือตำมะลัง จ.สตูล",
    "type": "pier",
    "province": "Satun",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "wang-prachan",
    "name": "Wang Prachan Border Checkpoint, Satun",
    "nameTh": "ด่านชายแดนวังประจัน จ.สตูล",
    "type": "border",
    "province": "Satun",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "hat-yai-airport",
    "name": "Hat Yai International Airport",
    "nameTh": "สนามบินนานาชาติหาดใหญ่",
    "type": "airport",
    "province": "Songkhla",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "hat-yai-bus",
    "name": "Hat Yai Bus Terminal",
    "nameTh": "สถานีขนส่งหาดใหญ่",
    "type": "bus_station",
    "province": "Songkhla",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "hat-yai-town",
    "name": "Hat Yai Town",
    "nameTh": "ตัวเมืองหาดใหญ่",
    "type": "city",
    "province": "Songkhla",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "dan-nok",
    "name": "Dan Nok, Songkhla",
    "nameTh": "ด่านนอก จ.สงขลา",
    "type": "border",
    "province": "Songkhla",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "ao-nang-pier",
    "name": "Ao Nang Pier",
    "nameTh": "ท่าเรืออ่าวนาง",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "phi-phi-pier",
    "name": "Phi Phi Pier",
    "nameTh": "ท่าเรือพีพี",
    "type": "pier",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "railay-beach",
    "name": "Railay Beach",
    "nameTh": "หาดไร่เลย์",
    "type": "beach",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "centara-ao-nang",
    "name": "Centara Grand Beach Resort",
    "nameTh": "เซนทารา แกรนด์ อ่าวนาง",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "rayavadee",
    "name": "Rayavadee Resort",
    "nameTh": "เรยาวาดี",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nam-mao"
  },
  {
    "id": "holiday-inn-ao-nang",
    "name": "Holiday Inn Resort Krabi Ao Nang Beach",
    "nameTh": "ฮอลิเดย์ อินน์ รีสอร์ท กระบี่ อ่าวนาง",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "amari-vogue-krabi",
    "name": "Amari Vogue Krabi",
    "nameTh": "อมารี วอก กระบี่",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "klong-muang"
  },
  {
    "id": "pakasai-resort",
    "name": "Pakasai Resort",
    "nameTh": "ปากาสัย รีสอร์ท",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "aonang-villa-resort",
    "name": "Aonang Villa Resort",
    "nameTh": "อ่าวนาง วิลล่า รีสอร์ท",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "panan-resort",
    "name": "Panan Resort Ao Nang",
    "nameTh": "พนันท์ รีสอร์ท อ่าวนาง",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "dusit-thani-krabi",
    "name": "Dusit Thani Krabi Beach Resort",
    "nameTh": "ดุสิตธานี กระบี่ บีช รีสอร์ท",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "ibis-styles-ao-nang",
    "name": "ibis Styles Krabi Ao Nang",
    "nameTh": "อีบิส สไตล์ กระบี่ อ่าวนาง",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "sala-ao-nang",
    "name": "Sala Ao Nang",
    "nameTh": "ศาลา อ่าวนาง",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "krabi-la-playa",
    "name": "Krabi La Playa Resort",
    "nameTh": "กระบี่ ลา พลายา รีสอร์ท",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "sofitel-krabi",
    "name": "Sofitel Krabi Phokeethra Golf & Spa Resort",
    "nameTh": "โซฟิเทล กระบี่ โภคีธรา กอล์ฟ แอนด์ สปา รีสอร์ท",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "tubkaak-beach"
  },
  {
    "id": "banyan-tree-krabi",
    "name": "Banyan Tree Krabi",
    "nameTh": "บันยันทรี กระบี่",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "tubkaak-beach"
  },
  {
    "id": "nakamanda-resort",
    "name": "Nakamanda Resort & Spa",
    "nameTh": "นาคามันดา รีสอร์ท แอนด์ สปา",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "klong-muang"
  },
  {
    "id": "tubkaak-krabi-resort",
    "name": "The Tubkaak Krabi Boutique Resort",
    "nameTh": "เดอะ ทับแค กระบี่ บูติก รีสอร์ท",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "tubkaak-beach"
  },
  {
    "id": "phulay-bay",
    "name": "Phulay Bay, a Ritz-Carlton Reserve",
    "nameTh": "พูเลย์ เบย์ ริทซ์-คาร์ลตัน รีเซิร์ฟ",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "tubkaak-beach"
  },
  {
    "id": "avani-krabi",
    "name": "Avani+ Krabi Resort",
    "nameTh": "อวานี+ กระบี่ รีสอร์ท",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "krabi-town"
  },
  {
    "id": "mercure-krabi-deevana",
    "name": "Mercure Krabi Deevana",
    "nameTh": "เมอร์เคียวร์ กระบี่ ดีวาน่า",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "ao-nang-beach"
  },
  {
    "id": "pimalai-resort",
    "name": "Pimalai Resort & Spa",
    "nameTh": "พิมาลัย รีสอร์ท แอนด์ สปา",
    "type": "hotel",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ],
    "pricingAreaId": "koh-lanta-z1"
  },
  {
    "id": "emerald-pool",
    "name": "Emerald Pool (Sa Morakot)",
    "nameTh": "สระมรกต",
    "type": "attraction",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "tiger-cave",
    "name": "Tiger Cave Temple",
    "nameTh": "วัดถ้ำเสือ",
    "type": "temple",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  },
  {
    "id": "hot-spring",
    "name": "Hot Stream (Bo Toh)",
    "nameTh": "น้ำตกร้อน บ่อตอ",
    "type": "attraction",
    "province": "Krabi",
    "connections": [
      "kbv-airport"
    ]
  }
];

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

export function getLocationsByType(type: Location["type"]): Location[] {
  return locations.filter((l) => l.type === type);
}

export function getConnectedLocations(fromId: string): Location[] {
  const from = getLocation(fromId);
  if (!from) return locations;
  return locations.filter(
    (l) =>
      l.id !== fromId &&
      (from.connections.includes(l.id) || l.connections.includes(fromId))
  );
}

export function searchLocations(query: string): Location[] {
  const q = query.toLowerCase().trim();
  if (!q) return locations;
  return locations.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.nameTh.includes(q) ||
      l.province.toLowerCase().includes(q)
  );
}
