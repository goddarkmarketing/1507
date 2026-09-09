// Supabase Edge Function: notify-booking
// Deploy: supabase functions deploy notify-booking
// Secrets: RESEND_API_KEY, ADMIN_NOTIFY_EMAIL, NOTIFY_FROM_EMAIL (optional), ADMIN_NOTIFY_WEBHOOK (optional)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM =
  Deno.env.get("NOTIFY_FROM_EMAIL") ?? "Krabi Links Taxi <onboarding@resend.dev>";
const ADMIN_WEBHOOK = Deno.env.get("ADMIN_NOTIFY_WEBHOOK") ?? "";
/** Ops inbox — e.g. goddarkmarketing@gmail.com for testing */
const ADMIN_NOTIFY_EMAIL = Deno.env.get("ADMIN_NOTIFY_EMAIL") ?? "";

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

function customerEmailHtml(opts: {
  name: string;
  bookingNumber: string;
  voucherUrl: string;
}) {
  const name = escapeHtml(opts.name);
  const bookingNumber = escapeHtml(opts.bookingNumber);
  return emailShell(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
          <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:22px 28px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.85);">KRABI LINKS TAXI</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">ยืนยันการจองของคุณ</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3f3f46;">สวัสดีคุณ <strong style="color:#18181b;">${name}</strong>,</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3f3f46;">ขอบคุณที่จองกับเรา รายละเอียดการจองพร้อมลิงก์ e-Voucher อยู่ด้านล่าง</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #ececef;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">เลขที่จอง</p>
                    <p style="margin:0;font-size:20px;font-weight:700;color:#18181b;letter-spacing:0.02em;">${bookingNumber}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
                <tr><td>${primaryButton(opts.voucherUrl, "เปิด e-Voucher")}</td></tr>
              </table>
              <p style="margin:18px 0 0;font-size:13px;line-height:1.55;color:#71717a;">หากจองแบบจ่ายคนขับ หรือจองช่วงดึก ทีมงานจะยืนยันก่อนออก voucher</p>
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
}) {
  const name = escapeHtml(opts.name);
  const email = escapeHtml(opts.email);
  const bookingNumber = escapeHtml(opts.bookingNumber);
  return emailShell(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
          <tr>
            <td style="background:#18181b;padding:22px 28px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#fbbf24;">ADMIN ALERT</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">มีการจองใหม่เข้ามา</p>
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
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
                <tr>
                  <td style="padding-right:10px;">${primaryButton(opts.adminUrl, "เข้าหลังบ้าน")}</td>
                  <td>${secondaryButton(opts.voucherUrl, "เปิด Voucher")}</td>
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
    `Krabi Links Taxi · Booking ${bookingNumber}`,
    customerEmailHtml({ name, bookingNumber, voucherUrl })
  );

  if (ADMIN_NOTIFY_EMAIL) {
    const sameAsCustomer =
      ADMIN_NOTIFY_EMAIL.toLowerCase() === email.toLowerCase();
    if (sameAsCustomer) {
      results.adminEmail = "skipped_same_as_customer";
    } else {
      results.adminEmail = await sendResend(
        ADMIN_NOTIFY_EMAIL,
        `[Admin] New booking ${bookingNumber}`,
        adminEmailHtml({
          name,
          email,
          bookingNumber,
          voucherUrl,
          adminUrl,
        })
      );
    }
  }

  if (ADMIN_WEBHOOK) {
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
