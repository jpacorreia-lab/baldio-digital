do $$
begin
  create type public.assembleia_tipo as enum ('ordinaria', 'extraordinaria');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.assembleia_estado as enum ('rascunho', 'convocada', 'realizada', 'cancelada');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.assembleias (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  titulo text not null,
  tipo public.assembleia_tipo not null default 'ordinaria',
  data date not null,
  hora time not null,
  local text not null,
  ordem_trabalhos text not null,
  observacoes text,
  estado public.assembleia_estado not null default 'rascunho',
  edital_emitido_em date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assembleias_organization_data_idx
  on public.assembleias(organization_id, data);
