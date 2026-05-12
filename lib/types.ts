export type UserRole =
  | "admin_plataforma"
  | "conselho_diretivo"
  | "mesa_assembleia"
  | "comissao_fiscalizacao"
  | "comparte";

export type ComparteEstado =
  | "pendente"
  | "ativo"
  | "suspenso"
  | "falecido"
  | "removido";

export type AssembleiaTipo = "ordinaria" | "extraordinaria";
export type AssembleiaEstado = "rascunho" | "convocada" | "realizada" | "cancelada";
export type ReuniaoExecutivoEstado = "rascunho" | "realizada" | "arquivada";
export type AtaEstado =
  | "rascunho"
  | "em_revisao"
  | "aprovada"
  | "publicada"
  | "retificada"
  | "arquivada";
export type OrgaoAta =
  | "assembleia_compartes"
  | "conselho_diretivo"
  | "comissao_fiscalizacao";
export type DeliberacaoEstado =
  | "rascunho"
  | "aprovada"
  | "rejeitada"
  | "sem_votacao"
  | "retificada"
  | "arquivada";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  organization_id: string | null;
  full_name: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Comparte = {
  id: string;
  organization_id: string;
  nome: string;
  cartao_cidadao: string | null;
  nif: string | null;
  morada: string | null;
  localidade: string | null;
  telefone: string | null;
  email: string | null;
  data_nascimento: string | null;
  data_admissao: string | null;
  fundamento: string | null;
  estado: ComparteEstado;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
};

export type Assembleia = {
  id: string;
  organization_id: string;
  titulo: string;
  tipo: AssembleiaTipo;
  data: string;
  hora: string;
  local: string;
  ordem_trabalhos: string;
  observacoes: string | null;
  estado: AssembleiaEstado;
  edital_emitido_em: string | null;
  created_at: string;
  updated_at: string;
};

export type ReuniaoExecutivo = {
  id: string;
  organization_id: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  participantes: string | null;
  ordem_trabalhos: string | null;
  decisoes: string;
  observacoes: string | null;
  estado: ReuniaoExecutivoEstado;
  created_at: string;
  updated_at: string;
};

export type Ata = {
  id: string;
  organization_id: string;
  assembleia_id: string | null;
  reuniao_executivo_id: string | null;
  numero: number;
  ano: number;
  orgao: OrgaoAta;
  nome_baldio: string;
  data: string;
  hora_inicio: string;
  hora_encerramento: string | null;
  local: string;
  ordem_trabalhos: string;
  presencas: string | null;
  quorum: string | null;
  pontos_discutidos: string | null;
  documentos_anexos: string | null;
  assinaturas: string | null;
  estado: AtaEstado;
  created_at: string;
  updated_at: string;
};

export type Deliberacao = {
  id: string;
  organization_id: string;
  ata_id: string;
  ponto_ordem: number;
  titulo_ponto: string | null;
  texto: string;
  resultado_votacao: string | null;
  maioria_exigida: string | null;
  estado: DeliberacaoEstado;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Organization>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Profile>;
      };
      compartes: {
        Row: Comparte;
        Insert: Omit<Comparte, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Comparte>;
      };
      assembleias: {
        Row: Assembleia;
        Insert: Omit<Assembleia, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Assembleia>;
      };
      reunioes_executivo: {
        Row: ReuniaoExecutivo;
        Insert: Omit<ReuniaoExecutivo, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ReuniaoExecutivo>;
      };
      atas: {
        Row: Ata;
        Insert: Omit<Ata, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Ata>;
      };
      deliberacoes: {
        Row: Deliberacao;
        Insert: Omit<Deliberacao, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Deliberacao>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      current_user_organization_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      comparte_estado: ComparteEstado;
      assembleia_tipo: AssembleiaTipo;
      assembleia_estado: AssembleiaEstado;
      reuniao_executivo_estado: ReuniaoExecutivoEstado;
      ata_estado: AtaEstado;
      orgao_ata: OrgaoAta;
      deliberacao_estado: DeliberacaoEstado;
    };
    CompositeTypes: Record<string, never>;
  };
};
