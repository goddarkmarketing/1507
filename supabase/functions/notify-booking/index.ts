// Supabase Edge Function: notify-booking
// Deploy: supabase functions deploy notify-booking
// Secrets: RESEND_API_KEY, ADMIN_NOTIFY_EMAIL, NOTIFY_FROM_EMAIL (optional), ADMIN_NOTIFY_WEBHOOK (optional)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM =
  Deno.env.get("NOTIFY_FROM_EMAIL") ?? "Krabi Links Taxi <onboarding@resend.dev>";
const ADMIN_WEBHOOK = Deno.env.get("ADMIN_NOTIFY_WEBHOOK") ?? "";
/** Ops inbox. Booking alerts go here only. */
const ADMIN_NOTIFY_EMAIL = "krabilinkstaxi.social@gmail.com";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function emailShell(inner: string) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Krabi Links Taxi</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:28px 12px;">
    <tr>
      <td align="center">
        ${inner}
        <p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#a1a1aa;">
          Krabi Links Taxi · www.krabilinkstaxi.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function primaryButton(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px;mso-padding-alt:0;">
            <!--[if mso]><i style="letter-spacing:22px;mso-font-width:-100%;mso-text-raise:18pt;">&nbsp;</i><![endif]-->
            <span style="mso-text-raise:9pt;">${escapeHtml(label)}</span>
            <!--[if mso]><i style="letter-spacing:22px;mso-font-width:-100%;">&nbsp;</i><![endif]-->
          </a>`;
}

function secondaryButton(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:#ffffff;color:#18181b;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;border:1px solid #d4d4d8;">
            ${escapeHtml(label)}
          </a>`;
}

function stepList(steps: string[]) {
  return steps
    .map(
      (step, index) =>
        `<tr>
          <td style="padding:8px 0;vertical-align:top;width:28px;font-size:14px;font-weight:700;color:#b45309;">${index + 1}</td>
          <td style="padding:8px 0;font-size:14px;line-height:1.55;color:#3f3f46;">${step}</td>
        </tr>`
    )
    .join("");
}

type EmailKind = "confirmed" | "quote-request" | "quote-ready" | "approved" | "updated";

function customerEmailHtml(opts: {
  name: string;
  bookingNumber: string;
  voucherUrl: string;
  kind: EmailKind;
  tripSummary: string;
  totalPrice: number;
}) {
  const name = escapeHtml(opts.name);
  const bookingNumber = escapeHtml(opts.bookingNumber);
  const trip = escapeHtml(opts.tripSummary || "—");
  const price =
    opts.totalPrice > 0
      ? `฿${opts.totalPrice.toLocaleString("en-US")}`
      : "รอตรวจสอบราคา";
  const quote = opts.kind === "quote-request";
  const ready = opts.kind === "quote-ready";
  const approved = opts.kind === "approved";
  const updated = opts.kind === "updated";
  const title = quote
    ? "ได้รับคำขอแล้ว — รอตรวจสอบราคา"
    : ready
      ? "ได้ราคาแล้ว — รายละเอียดการเดินทาง"
      : approved
        ? "ยืนยันการจองแล้ว — ใบจองพร้อมใช้งาน"
        : updated
          ? "อัปเดตรายละเอียดการจองแล้ว"
          : "ได้รับคำขอจองแล้ว — รอผู้ดูแลยืนยัน";
  const intro = quote
    ? "เส้นทางนี้ยังไม่มีราคาในระบบ กรุณารอทีมงานตรวจสอบ ยังไม่ต้องชำระเงิน"
    : ready
      ? "ทีมงานตรวจราคาให้แล้ว รายละเอียดอยู่ด้านล่าง กรุณาเก็บอีเมลนี้ไว้"
      : approved
        ? "ผู้ดูแลยืนยันการจองของคุณแล้ว เปิดใบจอง (e-Voucher) จากปุ่มด้านล่าง และแสดงให้คนขับในวันเดินทาง"
        : updated
          ? "ทีมงานได้แก้ไขรายละเอียดการจองของคุณ กรุณาตรวจสอบข้อมูลล่าสุดด้านล่าง"
          : "เราบันทึกคำขอของคุณแล้ว ผู้ดูแลจะตรวจสอบและยืนยันก่อน แล้วจะส่งใบจองให้ทางอีเมลนี้";
  const steps = updated
    ? [
        "ตรวจสอบวัน เวลา จุดรับ-ส่ง และราคาล่าสุดด้านบน",
        "เปิดใบจองจากปุ่มด้านล่าง ใบจองแสดงข้อมูลที่แก้ไขแล้ว",
        "หากข้อมูลไม่ถูกต้อง ตอบกลับอีเมลนี้หรือติดต่อ 088 443 3309",
      ]
    : approved
    ? [
        "การจองได้รับการยืนยันแล้ว",
        "เปิดใบจองจากปุ่มด้านล่าง บันทึกหรือพิมพ์เก็บไว้",
        "แสดงใบจองให้คนขับในวันเดินทาง",
        "หากต้องการเปลี่ยนรายละเอียด ตอบกลับอีเมลนี้",
      ]
    : quote
    ? [
        "ระบบบันทึกคำขอและเลขที่จองให้แล้ว",
        "ทีมงานจะตรวจสอบราคาเส้นทางนี้",
        "กรุณารออีเมลตอบกลับ ยังไม่ต้องโอนเงิน",
        "เมื่อได้ราคา เราจะส่งรายละเอียดกลับมาที่อีเมลนี้",
      ]
    : ready
      ? [
          `ราคาที่ตรวจสอบแล้วคือ ${escapeHtml(price)}`,
          "เปิดหน้าติดตามเพื่อดูเส้นทาง วันเวลา และประเภทรถ",
          "หากต้องการยืนยันหรือเปลี่ยนรายละเอียด ตอบกลับอีเมลนี้",
          "ทีมงานจะติดต่อเรื่องคนขับหลังยืนยัน",
        ]
      : [
          "บันทึกคำขอของคุณแล้ว ใช้เลขที่จองด้านล่างในการติดตาม",
          "ผู้ดูแลจะตรวจสอบรายละเอียดและยืนยันการจอง",
          "เมื่อยืนยันแล้ว เราจะส่งใบจองให้ทางอีเมลนี้",
          "เปิดหน้าติดตามสถานะได้จากปุ่มด้านล่าง",
        ];
  return emailShell(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
          <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:22px 28px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.85);">KRABI LINKS TAXI</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3f3f46;">สวัสดีคุณ <strong style="color:#18181b;">${name}</strong>,</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3f3f46;">${intro}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #ececef;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">เลขที่จอง</p>
                    <p style="margin:0 0 14px;font-size:20px;font-weight:700;color:#18181b;letter-spacing:0.02em;">${bookingNumber}</p>
                    <p style="margin:0 0 4px;font-size:12px;color:#71717a;">รายละเอียด</p>
                    <p style="margin:0 0 14px;font-size:14px;line-height:1.5;color:#18181b;">${trip}</p>
                    <p style="margin:0 0 4px;font-size:12px;color:#71717a;">ราคา</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#18181b;">${escapeHtml(price)}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                ${stepList(steps)}
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
                <tr><td>${primaryButton(opts.voucherUrl, quote ? "ดูคำขอ" : approved || updated ? "เปิดใบจอง" : "เปิดหน้าติดตาม")}</td></tr>
              </table>
            </td>
          </tr>
        </table>`);
}

function adminEmailHtml(opts: {
  name: string;
  email: string;
  bookingNumber: string;
  voucherUrl: string;
  adminUrl: string;
  confirmUrl: string;
  kind: EmailKind;
  tripSummary: string;
}) {
  const name = escapeHtml(opts.name);
  const email = escapeHtml(opts.email);
  const bookingNumber = escapeHtml(opts.bookingNumber);
  const trip = escapeHtml(opts.tripSummary || "—");
  const quote = opts.kind === "quote-request";
  const title = quote ? "มีคำขอรอตรวจราคา" : "มีการจองใหม่ — รอยืนยัน";
  return emailShell(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
          <tr>
            <td style="background:#18181b;padding:22px 28px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#fbbf24;">ADMIN ALERT</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:0.06em;">เลขที่จอง</p>
                    <p style="margin:0;font-size:20px;font-weight:700;color:#18181b;">${bookingNumber}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f4f4f5;">
                    <p style="margin:0;font-size:12px;color:#71717a;">ลูกค้า</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#18181b;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-size:12px;color:#71717a;">อีเมล</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#18181b;">${email}</p>
                    <p style="margin:12px 0 0;font-size:12px;color:#71717a;">เส้นทาง</p>
                    <p style="margin:4px 0 0;font-size:14px;line-height:1.5;color:#18181b;">${trip}</p>
                    <p style="margin:12px 0 0;font-size:14px;font-weight:700;color:#92400e;">${
                      quote
                        ? "ใส่ราคาในหลังบ้าน แล้วกดส่งอีเมลกลับให้ลูกค้า"
                        : "ตรวจรายละเอียดแล้วกดยืนยัน ระบบจะส่งใบจองให้ลูกค้าทางอีเมล"
                    }</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
                <tr>
                  <td style="padding-right:10px;">${primaryButton(quote ? opts.adminUrl : opts.confirmUrl, quote ? "เข้าหลังบ้าน" : "ยืนยันการจอง")}</td>
                  <td>${quote ? secondaryButton(opts.voucherUrl, "เปิดคำขอ") : secondaryButton(opts.adminUrl, "เข้าหลังบ้าน")}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  let body: {
    bookingNumber?: string;
    email?: string;
    customerName?: string;
    locale?: string;
    voucherUrl?: string;
    siteUrl?: string;
    kind?: string;
    tripSummary?: string;
    totalPrice?: number;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const email = body.email?.trim();
  const voucherUrl = body.voucherUrl?.trim();
  const bookingNumber = body.bookingNumber?.trim();
  const name = body.customerName?.trim() || "Guest";
  const siteBase = (body.siteUrl || "https://www.krabilinkstaxi.com").replace(
    /\/$/,
    ""
  );
  const adminUrl = `${siteBase}/th/admin/`;
  const confirmUrl = `${siteBase}/th/admin/bookings/?confirm=${encodeURIComponent(bookingNumber ?? "")}`;
  const kind: EmailKind =
    body.kind === "quote-request" ||
    body.kind === "quote-ready" ||
    body.kind === "approved" ||
    body.kind === "updated"
      ? body.kind
      : "confirmed";
  const alertsAdmin = kind === "confirmed" || kind === "quote-request";
  const tripSummary = body.tripSummary?.trim() || "";
  const totalPrice = Number(body.totalPrice) || 0;
  const subject =
    kind === "quote-request"
      ? `Krabi Links Taxi · รอตรวจสอบราคา ${bookingNumber}`
      : kind === "quote-ready"
        ? `Krabi Links Taxi · ราคาการเดินทาง ${bookingNumber}`
        : kind === "approved"
          ? `Krabi Links Taxi · ยืนยันการจองแล้ว ${bookingNumber}`
          : kind === "updated"
            ? `Krabi Links Taxi · อัปเดตรายละเอียดการจอง ${bookingNumber}`
            : `Krabi Links Taxi · ได้รับคำขอจอง ${bookingNumber}`;

  if (!email || !voucherUrl || !bookingNumber) {
    return new Response(JSON.stringify({ error: "missing fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: Record<string, string> = {};

  async function sendResend(to: string, subject: string, html: string) {
    if (!RESEND_API_KEY) return "skipped_no_api_key";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return `failed:${res.status}:${detail.slice(0, 200)}`;
    }
    return "sent";
  }

  results.email = await sendResend(
    email,
    subject,
    customerEmailHtml({
      name,
      bookingNumber,
      voucherUrl,
      kind,
      tripSummary,
      totalPrice,
    })
  );

  if (ADMIN_NOTIFY_EMAIL && alertsAdmin) {
    const sameAsCustomer =
      ADMIN_NOTIFY_EMAIL.toLowerCase() === email.toLowerCase();
    if (sameAsCustomer) {
      results.adminEmail = "skipped_same_as_customer";
    } else {
      results.adminEmail = await sendResend(
        ADMIN_NOTIFY_EMAIL,
        kind === "quote-request"
          ? `[Admin] รอตรวจราคา ${bookingNumber}`
          : `[Admin] รอยืนยันการจอง ${bookingNumber}`,
        adminEmailHtml({
          name,
          email,
          bookingNumber,
          voucherUrl,
          adminUrl,
          confirmUrl,
          kind,
          tripSummary,
        })
      );
    }
  }

  if (ADMIN_WEBHOOK && alertsAdmin) {
    try {
      await fetch(ADMIN_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `New booking ${bookingNumber} · ${name} · ${email}\n${voucherUrl}`,
        }),
      });
      results.admin = "sent";
    } catch {
      results.admin = "failed";
    }
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
