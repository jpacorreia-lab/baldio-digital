# Baldio Digital

Aplicação web para gestão administrativa multi-baldio, construída com Next.js,
React, TypeScript, Tailwind CSS, Supabase e PostgreSQL.

## MVP incluído

- Estrutura inicial da aplicação com App Router.
- Autenticação com Supabase.
- Layout autenticado com menu lateral.
- Dashboard inicial.
- Sistema multi-entidade através de `organizations`.
- Perfis de utilizador com papéis:
  - `admin_plataforma`
  - `conselho_diretivo`
  - `mesa_assembleia`
  - `comissao_fiscalizacao`
  - `comparte`
- Módulo Compartes:
  - criar comparte
  - editar comparte
  - listar compartes
  - pesquisar por nome, NIF, email ou localidade
  - filtrar por estado
  - ver ficha individual
  - inativar ou arquivar comparte
  - importar compartes por Excel ou CSV
  - obter modelo Excel para preenchimento antes da importação
- Schema Supabase com Row Level Security por organização.
- Caderno eleitoral em PDF a partir dos compartes ativos.

## Estrutura

```txt
app/
  (auth)/login/          Login
  (app)/dashboard/       Dashboard autenticado
  (app)/compartes/       Módulo Compartes
components/
  auth/
  compartes/
  layout/
  ui/
lib/
  supabase/              Clientes Supabase server/browser
  validators/            Validação de formulários
supabase/
  schema.sql             Tabelas, enums, triggers e RLS
```

## Configurar Supabase

1. Cria um projeto no Supabase.
2. Abre o SQL Editor.
3. Executa o conteúdo de `supabase/schema.sql`.
4. Em Authentication, cria os utilizadores necessários.
5. Insere pelo menos uma organização e os perfis correspondentes.

Exemplo mínimo:

```sql
insert into public.organizations (name, slug)
values ('Baldio de Exemplo', 'baldio-exemplo');

insert into public.profiles (id, organization_id, full_name, role)
values (
  'USER_ID_DO_AUTH',
  'ORGANIZATION_ID',
  'Nome do Utilizador',
  'conselho_diretivo'
);
```

Para um administrador de plataforma:

```sql
insert into public.profiles (id, organization_id, full_name, role)
values (
  'USER_ID_DO_AUTH',
  null,
  'Admin Plataforma',
  'admin_plataforma'
);
```

## Variáveis de ambiente

Copia `.env.example` para `.env.local` e preenche:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Correr localmente

```bash
npm install
npm run dev
```

Depois abre `http://localhost:3000`.

## Modo MVP sem autenticação

Para simplificar a primeira fase, o projeto está preparado para correr em modo
demo com:

```txt
NEXT_PUBLIC_AUTH_DISABLED=true
NEXT_PUBLIC_DEFAULT_ORGANIZATION_ID=...
```

Neste modo, o botão de login entra diretamente no dashboard. Para permitir
operações com a chave pública durante o MVP, corre no Supabase o ficheiro
`supabase/04_disable_rls_for_mvp.sql`.

## Próximos módulos

O menu já reserva espaço para Cadernos eleitorais, Assembleias, Atas,
Deliberações, Pedidos, Pastoreio, Documentos, Contratos e Configurações.
Cada módulo deve seguir o mesmo padrão usado em Compartes:

- tabela com `organization_id`
- tipos em `lib/types.ts`
- validação em `lib/validators`
- ações de servidor junto ao módulo
- políticas RLS por organização no Supabase
