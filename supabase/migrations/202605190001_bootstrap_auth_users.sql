-- Bootstrap AINA rows for every Supabase Auth user.
-- Keeps email/phone/OAuth signups from landing in a half-initialized account.

create or replace function public.bootstrap_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, country, language)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      split_part(coalesce(new.email, ''), '@', 1),
      null
    ),
    nullif(new.raw_user_meta_data->>'country', ''),
    coalesce(nullif(new.raw_user_meta_data->>'language', ''), 'fr')
  )
  on conflict (user_id) do update
  set
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    country = coalesce(public.profiles.country, excluded.country),
    language = coalesce(public.profiles.language, excluded.language),
    updated_at = now();

  insert into public.user_babies (user_id, data, active_baby_id)
  values (new.id, '[]'::jsonb, null)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists bootstrap_user_profile_on_auth_user_created on auth.users;
create trigger bootstrap_user_profile_on_auth_user_created
  after insert on auth.users
  for each row execute function public.bootstrap_user_profile();

-- Backfill existing users created before this trigger existed.
insert into public.profiles (user_id, display_name, language)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data->>'display_name', ''),
    nullif(u.raw_user_meta_data->>'full_name', ''),
    nullif(u.raw_user_meta_data->>'name', ''),
    split_part(coalesce(u.email, ''), '@', 1),
    null
  ),
  coalesce(nullif(u.raw_user_meta_data->>'language', ''), 'fr')
from auth.users u
on conflict (user_id) do nothing;

insert into public.user_babies (user_id, data, active_baby_id)
select u.id, '[]'::jsonb, null
from auth.users u
on conflict (user_id) do nothing;
