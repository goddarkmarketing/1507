# Booking cloud backend (Supabase)

> **Go-live (Plesk / production):** see [`docs/GO_LIVE.md`](./GO_LIVE.md)

## 1. Create a free Supabase project
https://supabase.com → New project

## 2. Run SQL
Open **SQL Editor** → paste and run:
`supabase/migrations/001_bookings.sql`

Then update the secret:
```sql
update public.app_secrets
set value = 'your-long-random-secret'
where key = 'booking_admin_secret';
```

## 3. Env vars (local + CI / host build)
Copy `.env.example` → `.env.local` and fill:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BOOKING_ADMIN_SECRET` (same as SQL secret)
- `NEXT_PUBLIC_SITE_URL=https://www.krabilinkstaxi.com`
- `NEXT_PUBLIC_ADMIN_NOTIFY_WEBHOOK` (Discord webhook URL recommended)

For GitHub Actions → Plesk, add the same names as **repository secrets**
(see `docs/GO_LIVE.md`). Rebuild / redeploy so env is baked into the static bundle.

## 4. Optional: email customers via Edge Function
```bash
supabase functions deploy notify-booking
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set NOTIFY_FROM_EMAIL="Krabi Links Taxi <noreply@yourdomain.com>"
```

## 5. What works after setup
- New bookings sync to Supabase (all devices)
- Admin panel loads remote bookings (needs admin secret)
- Admin payment approve / status changes write back to Supabase
- `/booking/status` — customer enters booking number + phone
- Discord/webhook alert on new booking
- Email voucher link when Edge Function + Resend are configured

## Without env vars
App still works on a single browser via localStorage (previous behaviour).
