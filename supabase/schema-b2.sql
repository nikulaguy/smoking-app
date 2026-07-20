-- SmokingApp · Phase B.2 : suppression conforme (30 jours de rétractation)
-- Appliqué le 2026-07-15 via l'API de management. Rejouable.

create table if not exists public.deletion_requests (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  requested_at timestamptz not null default now(),
  purge_at timestamptz not null,
  -- jeton du lien de rétractation envoyé dans le mail de confirmation
  cancel_token uuid not null default gen_random_uuid()
);

-- Aucun accès client : seules les Edge Functions (service role) y touchent.
alter table public.deletion_requests enable row level security;

-- Purge définitive en SQL (pas d'Edge Function ni de secret) : une fonction
-- security definer supprime les comptes échus ; auth.users cascade sur
-- profiles et deletion_requests.
create extension if not exists pg_cron with schema pg_catalog;

create or replace function public.purge_expired_deletions()
returns integer
language plpgsql
security definer set search_path = ''
as $$
declare n integer;
begin
  delete from auth.users u
  using public.deletion_requests d
  where u.id = d.user_id and d.purge_at < now();
  get diagnostics n = row_count;
  return n;
end;
$$;

-- Planifié chaque nuit à 3 h (rejouable : unschedule si déjà présent).
select cron.unschedule('purge-expired-deletions')
  where exists (select 1 from cron.job where jobname = 'purge-expired-deletions');
select cron.schedule(
  'purge-expired-deletions', '0 3 * * *',
  'select public.purge_expired_deletions()'
);
