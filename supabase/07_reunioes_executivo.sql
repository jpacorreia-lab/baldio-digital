create type public.reuniao_executivo_estado as enum ('rascunho', 'realizada', 'arquivada');

create table if not exists public.reunioes_executivo (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  titulo text not null,
  data date not null,
  hora time not null,
  local text not null,
  participantes text,
  ordem_trabalhos text,
  decisoes text not null,
  observacoes text,
  estado public.reuniao_executivo_estado not null default 'realizada',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reunioes_executivo_organization_data_idx
  on public.reunioes_executivo(organization_id, data);
