-- Stable updated_at trigger helper with a fixed search_path.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_babies_updated_at on public.user_babies;
create trigger set_user_babies_updated_at
  before update on public.user_babies
  for each row execute function public.set_updated_at();

drop trigger if exists set_baby_store_updated_at on public.baby_store;
create trigger set_baby_store_updated_at
  before update on public.baby_store
  for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_children_updated_at on public.children;
create trigger set_children_updated_at
  before update on public.children
  for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

drop trigger if exists set_symptom_logs_updated_at on public.symptom_logs;
create trigger set_symptom_logs_updated_at
  before update on public.symptom_logs
  for each row execute function public.set_updated_at();
