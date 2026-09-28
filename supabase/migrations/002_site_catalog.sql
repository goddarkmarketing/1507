-- Shared prices and vehicle photos. Public read, admin write via secret.

create table if not exists public.site_catalog (
  id text primary key,
  transfer_routes jsonb,
  rental_packages jsonb,
  vehicles jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_catalog (id)
values ('live')
on conflict (id) do nothing;

grant select on table public.site_catalog to anon, authenticated;
grant all on table public.site_catalog to service_role;

alter table public.site_catalog enable row level security;

drop policy if exists site_catalog_public_read on public.site_catalog;
create policy site_catalog_public_read
  on public.site_catalog for select to anon, authenticated
  using (true);

create or replace function public.get_site_catalog()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'transferRoutes', transfer_routes,
    'rentalPackages', rental_packages,
    'vehicles', vehicles,
    'updatedAt', updated_at
  )
  from public.site_catalog
  where id = 'live';
$$;

grant execute on function public.get_site_catalog() to anon, authenticated;

create or replace function public.save_site_catalog(
  p_secret text,
  p_section text,
  p_payload jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_secret_ok(p_secret) then
    raise exception 'unauthorized';
  end if;

  if p_section not in ('transferRoutes', 'rentalPackages', 'vehicles') then
    raise exception 'bad_section';
  end if;

  if p_payload is not null and octet_length(p_payload::text) > 4000000 then
    raise exception 'payload_too_large';
  end if;

  if p_section = 'transferRoutes' then
    update public.site_catalog
    set transfer_routes = p_payload, updated_at = now()
    where id = 'live';
  elsif p_section = 'rentalPackages' then
    update public.site_catalog
    set rental_packages = p_payload, updated_at = now()
    where id = 'live';
  else
    update public.site_catalog
    set vehicles = p_payload, updated_at = now()
    where id = 'live';
  end if;
end;
$$;

grant execute on function public.save_site_catalog(text, text, jsonb) to anon, authenticated;
