"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/auth";

function textValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function createAssembleia(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const organizationId = profile.organization_id;
  if (!organizationId) throw new Error("Perfil sem organização.");

  const titulo = textValue(formData, "titulo");
  const data = textValue(formData, "data");
  const hora = textValue(formData, "hora");
  const local = textValue(formData, "local");
  const ordemTrabalhos = textValue(formData, "ordem_trabalhos");

  if (!titulo || !data || !hora || !local || !ordemTrabalhos) {
    throw new Error("Preenche título, data, hora, local e ordem de trabalhos.");
  }

  const supabase = await createClient();
  const { data: assembleia, error } = await supabase
    .from("assembleias")
    .insert({
      organization_id: organizationId,
      titulo,
      tipo: textValue(formData, "tipo") ?? "ordinaria",
      data,
      hora,
      local,
      ordem_trabalhos: ordemTrabalhos,
      observacoes: textValue(formData, "observacoes"),
      estado: "rascunho"
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/assembleias");
  redirect(`/assembleias/${assembleia.id}`);
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
