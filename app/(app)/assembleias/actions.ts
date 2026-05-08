"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/auth";

export type AssembleiaActionState = {
  error?: string;
};

function textValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function friendlySupabaseError(message: string) {
  if (message.includes("row-level security")) {
    return "O Supabase bloqueou o agendamento por permissões. Corre o ficheiro supabase/11_assembleias_policies.sql no SQL Editor.";
  }

  if (message.includes("schema cache") || message.includes("does not exist")) {
    return "A tabela de assembleias ainda não está pronta no Supabase. Corre os ficheiros supabase/06_assembleias.sql e supabase/11_assembleias_policies.sql.";
  }

  return `Não foi possível marcar a assembleia: ${message}`;
}

export async function createAssembleia(
  _previousState: AssembleiaActionState,
  formData: FormData
): Promise<AssembleiaActionState> {
  const { profile } = await getCurrentProfile();
  const organizationId = profile.organization_id;
  if (!organizationId) {
    return {
      error:
        "O teu perfil não tem organização associada. Associa o utilizador ao baldio antes de marcar assembleias."
    };
  }

  if (
    !["admin_plataforma", "conselho_diretivo", "mesa_assembleia"].includes(
      profile.role
    )
  ) {
    return {
      error:
        "Este perfil não tem permissões para marcar assembleias. Usa um utilizador do conselho diretivo ou da mesa da assembleia."
    };
  }

  const titulo = textValue(formData, "titulo");
  const data = textValue(formData, "data");
  const hora = textValue(formData, "hora");
  const local = textValue(formData, "local");
  const ordemTrabalhos = textValue(formData, "ordem_trabalhos");

  if (!titulo || !data || !hora || !local || !ordemTrabalhos) {
    return { error: "Preenche título, data, hora, local e ordem de trabalhos." };
  }

  const supabase = await createClient();
  const assembleiaId = crypto.randomUUID();
  const { error } = await supabase
    .from("assembleias")
    .insert({
      id: assembleiaId,
      organization_id: organizationId,
      titulo,
      tipo: textValue(formData, "tipo") ?? "ordinaria",
      data,
      hora,
      local,
      ordem_trabalhos: ordemTrabalhos,
      observacoes: textValue(formData, "observacoes"),
      estado: "rascunho"
    });

  if (error) {
    return { error: friendlySupabaseError(error.message) };
  }

  revalidatePath("/assembleias");
  redirect(`/assembleias/${assembleiaId}`);
}

export async function markEditalEmitido(id: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("assembleias")
    .update({ estado: "convocada", edital_emitido_em: today })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/assembleias");
  revalidatePath(`/assembleias/${id}`);
}
