alter table public.compartes
add column if not exists cartao_cidadao text;

create unique index if not exists compartes_org_cartao_cidadao_unique
  on public.compartes(organization_id, cartao_cidadao)
  where cartao_cidadao is not null;
