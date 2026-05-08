"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { parseComparteForm } from "@/lib/validators/comparte";
import type { ComparteEstado } from "@/lib/types";

export async function createComparte(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const organizationId = profile.organization_id;
  if (!organizationId) throw new Error("Perfil sem organização.");

  const supabase = await createClient();
  const payload = parseComparteForm(formData);

  const { data, error } = await supabase
    .from("compartes")
    .insert({ ...payload, organization_id: organizationId })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/compartes");
  redirect(`/compartes/${data.id}`);
}

export async function updateComparte(id: string, formData: FormData) {
  await getCurrentProfile();
  const supabase = await createClient();
  const payload = parseComparteForm(formData);

  const { error } = await supabase.from("compartes").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/compartes");
  revalidatePath(`/compartes/${id}`);
  redirect(`/compartes/${id}`);
}

export async function setComparteEstado(id: string, estado: "suspenso" | "removido") {
  await getCurrentProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("compartes").update({ estado }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/compartes");
  revalidatePath(`/compartes/${id}`);
}

const estadosPermitidos = new Set([
  "pendente",
  "ativo",
  "suspenso",
  "falecido",
  "removido"
]);

const headerAliases: Record<string, string> = {
  id: "id",
  organization_id: "organization_id",
  organizacao: "organization_id",
  organização: "organization_id",
  nome: "nome",
  nome_completo: "nome",
  "nome completo": "nome",
  cartao_cidadao: "cartao_cidadao",
  cartao_de_cidadao: "cartao_cidadao",
  cartão_cidadão: "cartao_cidadao",
  cartão_de_cidadão: "cartao_cidadao",
  cc: "cartao_cidadao",
  nif: "nif",
  morada: "morada",
  localidade: "localidade",
  telefone: "telefone",
  telemovel: "telefone",
  telemóvel: "telefone",
  email: "email",
  data_nascimento: "data_nascimento",
  nascimento: "data_nascimento",
  data_de_nascimento: "data_nascimento",
  data_admissao: "data_admissao",
  data_admissão: "data_admissao",
  admissao: "data_admissao",
  admissão: "data_admissao",
  data_de_admissao: "data_admissao",
  data_de_admissão: "data_admissao",
  fundamento: "fundamento",
  estado: "estado",
  observacoes: "observacoes",
  observações: "observacoes"
};

type ImportComparteRow = {
  organization_id: string;
  nome: string;
  cartao_cidadao: string;
  nif: string | null;
  morada: string;
  localidade: string | null;
  telefone: string;
  email: string;
  data_nascimento: string | null;
  data_admissao: string | null;
  fundamento: string | null;
  estado: ComparteEstado;
  observacoes: string | null;
};

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function normalizeDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  const text = String(value).trim();
  if (!text) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return text;
}

function normalizeText(value: unknown) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text || null;
}

export async function importCompartes(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const organizationId = profile.organization_id;
  if (!organizationId) throw new Error("Perfil sem organização.");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Seleciona um ficheiro Excel ou CSV.");
  }

  const XLSX = await import("xlsx");
  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellDates: true
  });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false
  });

  const payload = rows
    .map((row) => {
      const normalized: Record<string, unknown> = {};

      for (const [header, value] of Object.entries(row)) {
        const key = headerAliases[normalizeHeader(header)];
        if (key) normalized[key] = value;
      }

      const nome = normalizeText(normalized.nome);
      const cartaoCidadao = normalizeText(normalized.cartao_cidadao);
      if (!nome) {
        return null;
      }

      const estadoRaw = normalizeText(normalized.estado)?.toLowerCase();
      const estado = estadosPermitidos.has(estadoRaw ?? "")
        ? (estadoRaw as ComparteEstado)
        : "pendente";

      return {
        organization_id: organizationId,
        nome,
        cartao_cidadao: cartaoCidadao,
        nif: normalizeText(normalized.nif),
        morada: normalizeText(normalized.morada),
        localidade: normalizeText(normalized.localidade),
        telefone: normalizeText(normalized.telefone),
        email: normalizeText(normalized.email),
        data_nascimento: normalizeDate(normalized.data_nascimento),
        data_admissao: normalizeDate(normalized.data_admissao),
        fundamento: normalizeText(normalized.fundamento),
        estado,
        observacoes: normalizeText(normalized.observacoes)
      };
    })
    .filter((row): row is ImportComparteRow => row !== null);

  if (payload.length === 0) {
    throw new Error(
      "O ficheiro não tem linhas válidas. A coluna nome_completo é obrigatória."
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("compartes").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/compartes");
  redirect("/compartes");
}
