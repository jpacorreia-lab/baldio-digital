alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.compartes enable row level security;
alter table public.assembleias enable row level security;
alter table public.reunioes_executivo enable row level security;

drop policy if exists "Users can read own organization" on public.organizations;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can read compartes from own organization" on public.compartes;
drop policy if exists "Managers can create compartes" on public.compartes;
drop policy if exists "Managers can update compartes" on public.compartes;

create policy "Users can read own profile"
on public.profiles
for select
using (id = auth.uid());

create policy "Users can update own profile"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can read own organization"
on public.organizations
for select
using (
  id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

create policy "Users can read compartes from own organization"
on public.compartes
for select
using (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

create policy "Managers can create compartes"
on public.compartes
for insert
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
      and role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

create policy "Managers can update compartes"
on public.compartes
for update
using (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
      and role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
)
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
      and role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

create policy "Users can read assembleias from own organization"
on public.assembleias
for select
using (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

create policy "Managers can create assembleias"
on public.assembleias
for insert
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
      and role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

create policy "Managers can update assembleias"
on public.assembleias
for update
using (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
      and role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
)
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
      and role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

create policy "Users can read executive meetings from own organization"
on public.reunioes_executivo
for select
using (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
  )
);

create policy "Managers can create executive meetings"
on public.reunioes_executivo
for insert
with check (
  organization_id in (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
      and role in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  )
);

select pg_notify('pgrst', 'reload schema');
