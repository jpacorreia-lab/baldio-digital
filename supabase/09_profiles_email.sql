alter table public.profiles
add column if not exists email text;

create index if not exists profiles_organization_role_idx
  on public.profiles(organization_id, role);
