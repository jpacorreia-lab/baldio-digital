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
  updated_at timestamptz not null default now()
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
create unique index compartes_org_cartao_cidadao_unique
  on public.compartes(organization_id, cartao_cidadao)
  where cartao_cidadao is not null;
create unique index compartes_org_nif_unique
  on public.compartes(organization_id, nif)
  where nif is not null;
