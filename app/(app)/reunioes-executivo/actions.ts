"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/auth";

export type ReuniaoExecutivoActionState = {
  error?: string;
};

function textValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function friendlyReuniaoError(message: string) {
  if (message.includes("row-level security")) {
    return "Não tens permissão para gravar reuniões nesta organização. Confirma se o teu perfil tem o cargo conselho_diretivo, mesa_assembleia ou admin_plataforma.";
  }

  if (message.includes("schema cache") || message.includes("does not exist")) {
    return "A tabela de reuniões ainda não está pronta no Supabase. Corre o SQL do ficheiro supabase/07_reunioes_executivo.sql e depois supabase/08_enable_rls_auth.sql.";
  }

  return message;
}

export async function createReuniaoExecutivo(
  _state: ReuniaoExecutivoActionState,
  formData: FormData
): Promise<ReuniaoExecutivoActionState> {
  const { profile } = await getCurrentProfile();
  const organizationId = profile.organization_id;
  if (!organizationId) return { error: "Perfil sem organização." };

  const titulo = textValue(formData, "titulo");
  const data = textValue(formData, "data");
  const hora = textValue(formData, "hora");
  const local = textValue(formData, "local");
  const decisoes = textValue(formData, "decisoes");

  if (!titulo || !data || !hora || !local || !decisoes) {
    return { error: "Preenche título, data, hora, local e decisões." };
  }

  const supabase = await createClient();
  const id = crypto.randomUUID();
  const { error } = await supabase.from("reunioes_executivo").insert({
    id,
    organization_id: organizationId,
    titulo,
    data,
    hora,
    local,
    participantes: textValue(formData, "participantes"),
    ordem_trabalhos: textValue(formData, "ordem_trabalhos"),
    decisoes,
    observacoes: textValue(formData, "observacoes"),
    estado: textValue(formData, "estado") ?? "realizada"
  });

  if (error) {
    return { error: friendlyReuniaoError(error.message) };
  }

  revalidatePath("/reunioes-executivo");
  redirect(`/reunioes-executivo/${id}`);
}
