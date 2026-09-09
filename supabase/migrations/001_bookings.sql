-- Krabi Links Taxi — central bookings (run in Supabase SQL editor)

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key,
  booking_number text not null unique,
  phone_digits text not null,
  status text not null default 'pending',
  ops_status text not null default 'payment_review',
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_ops_status_idx on public.bookings (ops_status);

create table if not exists public.app_secrets (
  key text primary key,
  value text not null
);

-- >>> CHANGE THIS VALUE to match NEXT_PUBLIC_BOOKING_ADMIN_SECRET <<<
insert into public.app_secrets (key, value)
values ('booking_admin_secret', 'change-me-long-random-secret')
on conflict (key) do nothing;

alter table public.bookings enable row level security;
alter table public.app_secrets enable row level security;

drop policy if exists bookings_anon_insert on public.bookings;
create policy bookings_anon_insert
  on public.bookings for insert to anon, authenticated
  with check (true);

-- Allow read for voucher reopen by booking number (numbers are long / unlisted)
drop policy if exists bookings_anon_select on public.bookings;
create policy bookings_anon_select
  on public.bookings for select to anon, authenticated
  using (true);

-- No public access to secrets
drop policy if exists app_secrets_deny on public.app_secrets;
create policy app_secrets_deny
  on public.app_secrets for all to anon, authenticated
  using (false);

create or replace function public.normalize_phone(p text)
returns text
language sql
immutable
as $$
  select case
    when regexp_replace(coalesce(p, ''), '\D', '', 'g') ~ '^66[0-9]{9,}$'
      then '0' || substr(regexp_replace(p, '\D', '', 'g'), 3)
    else regexp_replace(coalesce(p, ''), '\D', '', 'g')
  end;
$$;

create or replace function public.admin_secret_ok(p_secret text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_secrets
    where key = 'booking_admin_secret'
      and value = p_secret
      and length(p_secret) >= 8
  );
$$;

create or replace function public.lookup_booking(p_number text, p_phone text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bookings%rowtype;
  want text := public.normalize_phone(p_phone);
begin
  select * into row
  from public.bookings
  where upper(booking_number) = upper(trim(p_number))
  limit 1;

  if not found then
    return null;
  end if;

  if row.phone_digits is distinct from want then
    return null;
  end if;

  return row.payload;
end;
$$;

grant execute on function public.lookup_booking(text, text) to anon, authenticated;

create or replace function public.list_bookings_admin(p_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_secret_ok(p_secret) then
    raise exception 'unauthorized';
  end if;

  return coalesce(
    (
      select jsonb_agg(payload order by created_at desc)
      from public.bookings
    ),
    '[]'::jsonb
  );
end;
$$;

grant execute on function public.list_bookings_admin(text) to anon, authenticated;

create or replace function public.get_booking_admin(p_secret text, p_number text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bookings%rowtype;
begin
  if not public.admin_secret_ok(p_secret) then
    raise exception 'unauthorized';
  end if;
  select * into row from public.bookings
  where upper(booking_number) = upper(trim(p_number))
  limit 1;
  if not found then return null; end if;
  return row.payload;
end;
$$;

grant execute on function public.get_booking_admin(text, text) to anon, authenticated;

create or replace function public.upsert_booking_admin(p_secret text, p_payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  bid uuid;
  bnum text;
  phone text;
begin
  if not public.admin_secret_ok(p_secret) then
    raise exception 'unauthorized';
  end if;

  bid := (p_payload->>'id')::uuid;
  bnum := p_payload->>'bookingNumber';
  phone := public.normalize_phone(p_payload->>'customerPhone');

  insert into public.bookings as b (
    id, booking_number, phone_digits, status, ops_status, payload, created_at, updated_at
  ) values (
    bid,
    bnum,
    phone,
    coalesce(p_payload->>'status', 'pending'),
    coalesce(p_payload->>'opsStatus', 'payment_review'),
    p_payload,
    coalesce((p_payload->>'createdAt')::timestamptz, now()),
    now()
  )
  on conflict (booking_number) do update set
    phone_digits = excluded.phone_digits,
    status = excluded.status,
    ops_status = excluded.ops_status,
    payload = excluded.payload,
    updated_at = now();
end;
$$;

grant execute on function public.upsert_booking_admin(text, jsonb) to anon, authenticated;
