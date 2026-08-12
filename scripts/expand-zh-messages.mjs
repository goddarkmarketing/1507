import fs from "fs";

const zh = JSON.parse(fs.readFileSync("src/messages/zh.json", "utf8"));

Object.assign(zh.Common, {
  book: "预订",
  explore: "探索",
  read: "阅读",
  min: "分钟",
  bookVehicle: "预订 {name}",
  allArticles: "全部文章",
});

zh.Site = {
  slogan: "值得信赖的泰国南部接送网络",
  tagline: "泰国南部旅游与交通平台",
};

zh.Home = {
  ...zh.Home,
  slogan: "值得信赖的泰国南部接送网络",
  fleetSubtitle: "{count} 种车型，满足各种人数需求",
  fleetSearch: "搜索车型...",
  fleetEmpty: "没有符合筛选条件的车型。",
  fleetFilterAll: "全部",
  fleetFilter13: "1–3 座",
  fleetFilter14: "1–4 座",
  fleetFilter18: "1–8 座",
  fleetFilterGroup: "团体 / 巴士",
  articlesTitle: "旅游文章",
  articlesSubtitle: "机场、海滩、码头与跨府接送指南",
  travelHubsTitle: "旅游资讯中心",
  travelHubsSubtitle: "一日游、船班与目的地贴士 — 然后预订接送",
  toursDesc: "皮皮岛、四岛、宏岛等一日游。",
  boatsDesc: "渡轮、快艇与长尾船班次（示例数据）。",
  travelInfoDesc: "奥南海滩、莱利、皮皮岛与甲米–普吉指南。",
  reviewMarqueeTitle: "客户评价",
  reviewHintMobile: "滑动或点箭头 · 点照片放大",
  reviewHintDesktop: "悬停暂停 · 点击放大",
};

zh.Faq = {
  pageTitle: "常见问题与政策",
  pageSubtitle: "关于预订、付款与服务标准的一切信息",
  sectionTitle: "常见问题",
  policiesTitle: "服务政策",
  items: {
    "1": {
      q: "如何预订接送？",
      a: "选择上车点与下车点、车型、日期和时间，填写预订表单。您将立即收到含二维码的电子凭证。",
    },
    "2": {
      q: "可以在一笔订单中预订多条路线吗？",
      a: "可以。系统支持单程、往返、多路线、多日及包车 — 均可在同一订单完成。",
    },
    "3": {
      q: "如果航班延误怎么办？",
      a: "我们会跟踪航班动态。机场接机自实际落地时间起含 60 分钟免费等候。",
    },
    "4": {
      q: "接受哪些付款方式？",
      a: "在线预订可使用银行转账、信用卡/借记卡和 PromptPay（演示为模拟数据）。也可提前安排向司机支付泰铢现金。",
    },
    "5": {
      q: "取消政策是什么？",
      a: "接送前 24 小时以上可免费取消。24 小时内取消可能收取 50%。爽约不予退款。",
    },
    "6": {
      q: "提供儿童座椅吗？",
      a: "提供，可按需申请且不另收费。预订时请注明儿童年龄/体重。",
    },
    "7": {
      q: "价格是否全包？",
      a: "是。报价含过路费、停车费、油费与司机服务。仅超时等候或您额外要求的项目另计。",
    },
    "8": {
      q: "如何收到电子凭证？",
      a: "确认预订后立即显示含二维码的电子凭证，之后也可在预订页再次打开。上车时出示给司机。",
    },
  },
  policies: {
    waiting: {
      title: "等候时间",
      content:
        "机场接机含 60 分钟免费等候。酒店/码头接送含 15 分钟。超时等候每 30 分钟 200 泰铢。",
    },
    "flight-delay": {
      title: "航班延误",
      content:
        "我们跟踪航班号并自动调整接机时间。延误 2 小时内不另收费。",
    },
    "child-seat": {
      title: "儿童座椅",
      content: "免费提供婴儿、幼儿与增高座椅。请在预订时申请。",
    },
    pets: {
      title: "宠物",
      content:
        "SUV 与面包车欢迎携带笼装小型宠物。可能收取 300 泰铢清洁费。",
    },
    ferry: {
      title: "渡轮衔接",
      content: "码头接送含送至渡轮码头。船票可作为附加服务安排。",
    },
    toll: {
      title: "过路费与停车费",
      content: "机场/码头过路费与停车费均已包含在报价中。",
    },
    payment: {
      title: "付款",
      content:
        "可在线刷卡/转账，或向司机支付泰铢现金。除非另有说明，价格均为全包。",
    },
    cancellation: {
      title: "取消",
      content:
        "接送前 24+ 小时免费取消。24 小时内收取 50%。爽约不退款。",
    },
    refund: {
      title: "退款",
      content: "获批退款将在 5–7 个工作日内退回原支付方式。",
    },
  },
};

zh.Reviews = {
  pageTitle: "客户评价",
  pageSubtitle: "来自泰国南部旅客的真实反馈",
  items: {
    "1": {
      country: "英国",
      comment:
        "从甲米机场到奥南海滩接送顺利。司机举牌等候，车辆干净舒适。",
      route: "KBV 机场 → 奥南海滩",
    },
    "2": {
      country: "德国",
      comment: "预订往返莱利海滩。沟通出色，往返都很准时。",
      route: "KBV 机场 ↔ 莱利海滩",
    },
    "3": {
      country: "日本",
      comment: "6 人家庭 VIP 商务车很完美。孩子们喜欢冷毛巾和小吃！",
      route: "KBV 机场 → Centara Grand",
    },
    "4": {
      country: "意大利",
      comment:
        "跨府到普吉性价比高。因堵车略有延误，但司机及时告知。",
      route: "甲米 → 普吉机场",
    },
    "5": {
      country: "澳大利亚",
      comment:
        "酒店到码头接送非常准时。司机帮忙搬行李，时间刚好赶上皮皮岛渡轮。",
      route: "奥南酒店 → 奥南码头",
    },
    "6": {
      country: "法国",
      comment:
        "预订经码头到莱利的海滩接送。LINE 更新清晰，行李空间充足。",
      route: "甲米市区 → 莱利码头",
    },
    "7": {
      country: "泰国",
      comment: "多日包车游甲米。预订方便、价格公道、司机总是准时。",
      route: "包车 · 甲米",
    },
  },
};

zh.Transfer = {
  fromEco: "经济型轿车起",
  book: "预订",
  popularRoutes: "热门{title}路线",
  route: "路线",
  distance: "距离",
  duration: "时长",
  fromPrice: "起价 (ECO)",
  recommended: "推荐车型",
  recommendedBody: "根据人数与行李选择合适车型。",
  ctaTitle: "准备好预订{title}了吗？",
  ctaBody: "预订后立即获得含二维码的电子凭证。",
};

zh.TransferPages = {
  "airport-transfer": {
    title: "机场接送",
    subtitle: "可靠往返甲米及泰国南部机场的接送服务",
  },
  "hotel-transfer": {
    title: "酒店接送",
    subtitle: "上门接送到区域内度假村与酒店",
  },
  "pier-transfer": {
    title: "码头接送",
    subtitle: "无缝衔接渡轮码头与出海行程",
  },
  "beach-transfer": {
    title: "海滩接送",
    subtitle: "直达甲米美丽海滩与海岸地区",
  },
  "city-transfer": {
    title: "市区接送",
    subtitle: "舒适的泰国南部城际交通",
  },
  "attraction-transfer": {
    title: "景点接送",
    subtitle: "前往寺庙、国家公园与热门景点",
  },
  "inter-province-transfer": {
    title: "跨府接送",
    subtitle: "泰国南部府际长途接送",
  },
};

zh.Booking = {
  ...zh.Booking,
  typeTitle: "预订类型",
  typeSubtitle: "一次预订完成所有类型 — 可添加路线、日期或包车",
  routeDetails: "路线详情",
  charterDetails: "包车详情",
  addRoute: "添加路线",
  routeN: "路线 {n}",
  charterN: "包车 {n}",
  pickup: "上车点",
  dropoff: "下车点",
  date: "日期",
  pickupTime: "上车时间",
  vehicle: "车型",
  selectVehicle: "选择车型",
  legPrice: "本段价格",
  customerTitle: "客户信息",
  fullName: "姓名 *",
  phone: "电话 *",
  email: "邮箱 *",
  flightOptional: "航班号（可选）",
  specialRequests: "特殊要求",
  phName: "张三",
  phPhone: "+66 ...",
  phEmail: "email@example.com",
  phFlight: "FD1234",
  phNotes: "儿童座椅、额外停靠等",
  paymentTitle: "付款",
  paymentSubtitle: "选择付款方式 — 银行、二维码与卡片字段为演示数据",
  summaryTitle: "预订摘要",
  summarySubtitle: "确认前请核对",
  total: "合计",
  paymentMethod: "付款方式：",
  bankTransfer: "银行转账",
  card: "信用卡 / 借记卡",
  promptpay: "PromptPay",
  confirmBooking: "确认预订",
  confirmBank: "确认预订（待核对转账）",
  confirmCard: "刷卡并确认",
  confirmPromptPay: "确认 PromptPay 付款",
  processing: "处理中...",
  demoNote: "演示付款 — 不真实扣款 · 确认后签发电子凭证",
  at: "于",
  toastCustomer: "请填写完整客户信息",
  toastPayment: "请选择付款方式",
  toastFail: "无法确认预订，请检查信息",
  types: {
    "one-way": {
      label: "单程",
      desc: "单次接送",
      detail: "点对点单次接送。",
    },
    "round-trip": {
      label: "往返",
      desc: "含回程",
      detail: "系统自动创建反向回程。",
    },
    "multi-route": {
      label: "多路线",
      desc: "多个目的地",
      detail: "可按行程需要添加多段路线。",
    },
    "multi-day": {
      label: "多日",
      desc: "不同日期",
      detail: "在同一订单安排不同日期的接送。",
    },
    "daily-charter": {
      label: "包天",
      desc: "全天 8 小时",
      detail: "全天包车（8 小时）— 选择车型与开始时间。",
    },
    "hourly-charter": {
      label: "包时",
      desc: "最少 3 小时",
      detail: "最少 3 小时 — 包车时段内可灵活停靠。",
    },
  },
};

zh.Pages = {
  ...zh.Pages,
  fleetSubtitle: "8 种车型，含真实照片与完整规格",
  priceListSubtitle: "接送与日租透明价格",
  reviewsSubtitle: "来自泰国南部旅客的真实反馈",
  contactSubtitle: "电话、LINE 或邮件 — 我们乐意协助规划行程",
  articlesSubtitle: "机场、海滩、码头与跨府接送指南",
  toursSubtitle: "甲米周边一日游与海岛体验",
  boatSchedulesSubtitle: "渡轮与快艇班次（示例数据）",
  travelInfoSubtitle: "泰国南部热门目的地实用贴士",
};

fs.writeFileSync("src/messages/zh.json", JSON.stringify(zh, null, 2) + "\n");
console.log("zh written");
