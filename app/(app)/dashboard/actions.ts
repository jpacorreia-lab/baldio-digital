"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/auth";
import type { UserRole } from "@/lib/types";

const roles = new Set<UserRole>([
  "admin_plataforma",
  "conselho_diretivo",
  "mesa_assembleia",
  "comissao_fiscalizacao",
  "comparte"
]);

export async function upsertProfile(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const organizationId = profile.organization_id;

  if (!organizationId && profile.role !== "admin_plataforma") {
    throw new Error("Perfil sem organização.");
  }

  const id = String(formData.get("id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() as UserRole;

  if (!id || !fullName || !roles.has(role)) {
    throw new Error("Preenche UID, nome e função.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({
    id,
    organization_id: organizationId,
    full_name: fullName,
    email: email || null,
    role
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
