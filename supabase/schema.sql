-- SmokingApp · Phase B.1 : profil synchronisé
-- À exécuter dans le SQL Editor du dashboard Supabase (une seule fois).
--
-- Modèle : une ligne par utilisateur, le ProfileState complet en jsonb.
-- Le client reste local-first : cette table est un miroir de sauvegarde,
-- la fusion se fait côté client sur state->>'revisedAt' (le plus récent gagne).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS : chacun ne voit et ne modifie QUE sa ligne. C'est la sécurité réelle
-- (la clé publishable du client ne protège rien, et c'est normal).
alter table public.profiles enable row level security;

create policy "profil : lire le sien"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "profil : créer le sien"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

create policy "profil : modifier le sien"
  on public.profiles for update
  using ((select auth.uid()) = id);

create policy "profil : supprimer le sien"
  on public.profiles for delete
  using ((select auth.uid()) = id);

-- updated_at automatique à chaque upsert
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();
