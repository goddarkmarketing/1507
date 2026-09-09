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

  const customerHtml = `
      <p>สวัสดีคุณ ${name},</p>
      <p>ขอบคุณที่จองกับ <strong>Krabi Links Taxi</strong></p>
      <p>เลขที่จอง: <strong>${bookingNumber}</strong></p>
      <p><a href="${voucherUrl}">เปิด e-Voucher / ตรวจสถานะ</a></p>
      <p>หากจองแบบจ่ายคนขับ หรือจองช่วงดึก ทีมงานจะยืนยันก่อนออก voucher</p>
      <p>— Krabi Links Taxi</p>
    `;
  results.email = await sendResend(
    email,
    `Krabi Links Taxi · Booking ${bookingNumber}`,
    customerHtml
  );

  if (ADMIN_NOTIFY_EMAIL) {
    const sameAsCustomer =
      ADMIN_NOTIFY_EMAIL.toLowerCase() === email.toLowerCase();
    if (sameAsCustomer) {
      results.adminEmail = "skipped_same_as_customer";
    } else {
      const adminHtml = `
      <p><strong>New booking</strong></p>
      <p>เลขที่จอง: <strong>${bookingNumber}</strong></p>
      <p>ลูกค้า: ${name} · ${email}</p>
      <p><a href="${voucherUrl}">เปิด voucher / ลิงก์จอง</a></p>
      <p>เข้าหลังบ้าน: ${(body.siteUrl || "https://www.krabilinkstaxi.com").replace(/\/$/, "")}/th/admin/</p>
    `;
      results.adminEmail = await sendResend(
        ADMIN_NOTIFY_EMAIL,
        `[Admin] New booking ${bookingNumber}`,
        adminHtml
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
