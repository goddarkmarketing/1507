-- Run AFTER 001_bookings.sql
-- Replace YOUR_SECRET with the same value as NEXT_PUBLIC_BOOKING_ADMIN_SECRET
-- (see .env.local on your machine — do not commit the real secret)

update public.app_secrets
set value = 'YOUR_SECRET'
where key = 'booking_admin_secret';

select key, length(value) as secret_length from public.app_secrets;
