alter table public.profiles
add column if not exists email text;

create index if not exists profiles_organization_role_idx
  on public.profiles(organization_id, role);

drop policy if exists "Managers can read profiles from own organization" on public.profiles;
drop policy if exists "Managers can create profiles in own organization" on public.profiles;
drop policy if exists "Managers can update profiles in own organization" on public.profiles;

create policy "Managers can read profiles from own organization"
on public.profiles
for select
using (
  organization_id in (
    select organization_id
    from public.profiles manager_profile
    where manager_profile.id = auth.uid()
      and manager_profile.role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

create policy "Managers can create profiles in own organization"
on public.profiles
for insert
with check (
  organization_id in (
    select organization_id
    from public.profiles manager_profile
    where manager_profile.id = auth.uid()
      and manager_profile.role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

create policy "Managers can update profiles in own organization"
on public.profiles
for update
using (
  organization_id in (
    select organization_id
    from public.profiles manager_profile
    where manager_profile.id = auth.uid()
      and manager_profile.role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
)
with check (
  organization_id in (
    select organization_id
    from public.profiles manager_profile
    where manager_profile.id = auth.uid()
      and manager_profile.role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

select pg_notify('pgrst', 'reload schema');
