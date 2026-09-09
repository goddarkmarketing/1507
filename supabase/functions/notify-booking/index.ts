// Supabase Edge Function: notify-booking
// Deploy: supabase functions deploy notify-booking
// Secrets: RESEND_API_KEY, NOTIFY_FROM_EMAIL (optional), ADMIN_NOTIFY_WEBHOOK (optional)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM =
  Deno.env.get("NOTIFY_FROM_EMAIL") ?? "Krabi Links Taxi <onboarding@resend.dev>";
const ADMIN_WEBHOOK = Deno.env.get("ADMIN_NOTIFY_WEBHOOK") ?? "";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
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
    });
  }

  const email = body.email?.trim();
  const voucherUrl = body.voucherUrl?.trim();
  const bookingNumber = body.bookingNumber?.trim();
  const name = body.customerName?.trim() || "Guest";

  if (!email || !voucherUrl || !bookingNumber) {
    return new Response(JSON.stringify({ error: "missing fields" }), {
      status: 400,
    });
  }

  const results: Record<string, string> = {};

  if (RESEND_API_KEY) {
    const html = `
      <p>สวัสดีคุณ ${name},</p>
      <p>ขอบคุณที่จองกับ <strong>Krabi Links Taxi</strong></p>
      <p>เลขที่จอง: <strong>${bookingNumber}</strong></p>
      <p><a href="${voucherUrl}">เปิด e-Voucher / ตรวจสถานะ</a></p>
      <p>หากจองแบบจ่ายคนขับ หรือจองช่วงดึก ทีมงานจะยืนยันก่อนออก voucher</p>
      <p>— Krabi Links Taxi</p>
    `;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: `Krabi Links Taxi · Booking ${bookingNumber}`,
        html,
      }),
    });
    results.email = res.ok ? "sent" : `failed:${res.status}`;
  } else {
    results.email = "skipped_no_api_key";
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
    headers: { "Content-Type": "application/json" },
  });
});
