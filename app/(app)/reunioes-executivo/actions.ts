"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/auth";

function textValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function createReuniaoExecutivo(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const organizationId = profile.organization_id;
  if (!organizationId) throw new Error("Perfil sem organização.");

  const titulo = textValue(formData, "titulo");
  const data = textValue(formData, "data");
  const hora = textValue(formData, "hora");
  const local = textValue(formData, "local");
  const decisoes = textValue(formData, "decisoes");

  if (!titulo || !data || !hora || !local || !decisoes) {
    throw new Error("Preenche título, data, hora, local e decisões.");
  }

  const supabase = await createClient();
  const { data: reuniao, error } = await supabase
    .from("reunioes_executivo")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/reunioes-executivo");
  redirect(`/reunioes-executivo/${reuniao.id}`);
}
