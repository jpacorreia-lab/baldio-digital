create extension if not exists "pgcrypto";

drop table if exists public.compartes cascade;
drop table if exists public.profiles cascade;
drop table if exists public.organizations cascade;
drop type if exists public.comparte_estado cascade;
drop type if exists public.user_role cascade;

create type public.user_role as enum (
  'admin_plataforma',
  'conselho_diretivo',
  'mesa_assembleia',
  'comissao_fiscalizacao',
  'comparte'
);

create type public.comparte_estado as enum (
  'pendente',
  'ativo',
  'suspenso',
  'falecido',
  'removido'
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  full_name text not null,
  role public.user_role not null default 'comparte',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_admin_platform_without_org
    check (
      role <> 'admin_plataforma'
      or organization_id is null
    )
);

create table public.compartes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  nome text not null,
  cartao_cidadao text,
  nif text,
  morada text,
  localidade text,
  telefone text,
  email text,
  data_nascimento date,
  data_admissao date,
  fundamento text,
  estado public.comparte_estado not null default 'pendente',
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index compartes_organization_id_idx on public.compartes(organization_id);
create index compartes_estado_idx on public.compartes(estado);
create index compartes_nome_idx on public.compartes using gin (to_tsvector('portuguese', nome));
create unique index compartes_org_cartao_cidadao_unique
  on public.compartes(organization_id, cartao_cidadao)
  where cartao_cidadao is not null;
create unique index compartes_org_nif_unique
  on public.compartes(organization_id, nif)
  where nif is not null;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.compartes enable row level security;

create policy "Admins can manage all organizations"
on public.organizations
for all
using (
  (
    select role
    from public.profiles
    where id = auth.uid()
  ) = 'admin_plataforma'
)
with check (
  (
    select role
    from public.profiles
    where id = auth.uid()
  ) = 'admin_plataforma'
);

create policy "Users can read their organization"
on public.organizations
for select
using (
  id = (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
  )
  or (
    select role
    from public.profiles
    where profiles.id = auth.uid()
  ) = 'admin_plataforma'
);

create policy "Admins can manage profiles"
on public.profiles
for all
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can read their own profile"
on public.profiles
for select
using (id = auth.uid());

create policy "Users can update their own profile basics"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Organization members can read compartes"
on public.compartes
for select
using (
  organization_id = (
    select organization_id
    from public.profiles
    where profiles.id = auth.uid()
  )
  or (
    select role
    from public.profiles
    where profiles.id = auth.uid()
  ) = 'admin_plataforma'
);

create policy "Organization managers can create compartes"
on public.compartes
for insert
with check (
  (
    select role
    from public.profiles
    where profiles.id = auth.uid()
  ) in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  and (
    (
      select role
      from public.profiles
      where profiles.id = auth.uid()
    ) = 'admin_plataforma'
    or organization_id = (
      select organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  )
);

create policy "Organization managers can update compartes"
on public.compartes
for update
using (
  (
    select role
    from public.profiles
    where profiles.id = auth.uid()
  ) in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  and (
    (
      select role
      from public.profiles
      where profiles.id = auth.uid()
    ) = 'admin_plataforma'
    or organization_id = (
      select organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  )
)
with check (
  (
    select role
    from public.profiles
    where profiles.id = auth.uid()
  ) in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  and (
    (
      select role
      from public.profiles
      where profiles.id = auth.uid()
    ) = 'admin_plataforma'
    or organization_id = (
      select organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  )
);

create policy "Organization managers can delete compartes"
on public.compartes
for delete
using (
  (
    select role
    from public.profiles
    where profiles.id = auth.uid()
  ) in ('admin_plataforma', 'conselho_diretivo', 'mesa_assembleia')
  and (
    (
      select role
      from public.profiles
      where profiles.id = auth.uid()
    ) = 'admin_plataforma'
    or organization_id = (
      select organization_id
      from public.profiles
      where profiles.id = auth.uid()
    )
  )
);
