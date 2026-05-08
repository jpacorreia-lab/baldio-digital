import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAssembleiaEditalPdf } from "@/lib/pdf";
import { formatDatePt } from "@/lib/assembleias/dates";
import type { Assembleia } from "@/lib/types";

type EditalRouteProps = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: EditalRouteProps) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assembleias")
    .select("*")
    .eq("id", params.id)
    .single();

  const assembleia = data as Assembleia | null;
  if (error || !assembleia) {
    return NextResponse.json({ error: "Assembleia não encontrada." }, { status: 404 });
  }

  const pdf = createAssembleiaEditalPdf({
    titulo: assembleia.titulo,
    tipo: assembleia.tipo === "ordinaria" ? "Ordinária" : "Extraordinária",
    data: formatDatePt(assembleia.data),
    hora: assembleia.hora.slice(0, 5),
    local: assembleia.local,
    ordemTrabalhos: assembleia.ordem_trabalhos
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="edital-${assembleia.data}.pdf"`
    }
  });
}
