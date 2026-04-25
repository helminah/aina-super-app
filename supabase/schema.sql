-- AINA — Schéma Supabase
-- Coller dans : https://supabase.com/dashboard/project/fwpisnrwqedlgtbenhyb/sql/new

-- ─────────────────────────────────────────────────────────────────────────────
-- Table 1 : liste des bébés par utilisateur (une ligne par compte)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists user_babies (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  data           jsonb not null default '[]',   -- ChildProfile[]
  active_baby_id text,
  updated_at     timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Table 2 : données de chaque bébé (une ligne par store × bébé)
-- store_key ∈ { 'weights' | 'heights' | 'hc' | 'vaccines' | 'logs' |
--               'milestones' | 'teeth' | 'doses' | 'appointments' |
--               'mealplan' | 'favorites' | 'shopping-checked' | 'ai-recipes' }
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists baby_store (
  user_id    uuid references auth.users(id) on delete cascade,
  baby_id    text not null,
  store_key  text not null,
  data       jsonb not null default '[]',
  updated_at timestamptz default now(),
  primary key (user_id, baby_id, store_key)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS : chaque utilisateur ne voit et ne modifie que ses propres lignes
-- ─────────────────────────────────────────────────────────────────────────────
alter table user_babies enable row level security;
alter table baby_store   enable row level security;

create policy "user_babies_self" on user_babies
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "baby_store_self" on baby_store
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
