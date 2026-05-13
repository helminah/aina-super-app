-- AINA core schema + optimized RLS policies.

create table if not exists public.user_babies (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '[]'::jsonb,
  active_baby_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.baby_store (
  user_id uuid references auth.users(id) on delete cascade,
  baby_id text not null,
  store_key text not null,
  data jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, baby_id, store_key)
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'parent',
  display_name text,
  country text,
  language text default 'fr',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sex text,
  birth_date date,
  country text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null,
  title text,
  mode text default 'chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null,
  symptoms text not null,
  level text check (level in ('green', 'yellow', 'red')),
  notes text,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists children_user_id_idx on public.children(user_id);
create index if not exists conversations_user_id_idx on public.conversations(user_id);
create index if not exists conversations_child_id_idx on public.conversations(child_id);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_user_id_idx on public.messages(user_id);
create index if not exists symptom_logs_user_id_idx on public.symptom_logs(user_id);
create index if not exists symptom_logs_child_id_idx on public.symptom_logs(child_id);
create index if not exists symptom_logs_logged_at_idx on public.symptom_logs(logged_at desc);

alter table public.user_babies enable row level security;
alter table public.baby_store enable row level security;
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.symptom_logs enable row level security;

drop policy if exists "user_babies_self" on public.user_babies;
create policy "user_babies_self" on public.user_babies
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "baby_store_self" on public.baby_store;
create policy "baby_store_self" on public.baby_store
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self" on public.profiles
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "children_self" on public.children;
create policy "children_self" on public.children
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "conversations_self" on public.conversations;
create policy "conversations_self" on public.conversations
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "messages_self" on public.messages;
create policy "messages_self" on public.messages
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "symptom_logs_self" on public.symptom_logs;
create policy "symptom_logs_self" on public.symptom_logs
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

