import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatDatePt } from "@/lib/assembleias/dates";
import { generateAtaHtml, splitAgenda } from "@/lib/atas/html";
import type { Assembleia, Organization } from "@/lib/types";

type RouteProps = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: RouteProps) {
  const supabase = await createClient();
  const { data: assembleiaData, error } = await supabase
    .from("assembleias")
    .select("*")
    .eq("id", params.id)
    .single();

  const assembleia = assembleiaData as Assembleia | null;
  if (error || !assembleia) {
    return NextResponse.json({ error: "Assembleia não encontrada." }, { status: 404 });
  }

  const { data: organizationData } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", assembleia.organization_id)
    .single();

  const organization = organizationData as Organization | null;
  const ordem = splitAgenda(assembleia.ordem_trabalhos);
  const html = generateAtaHtml({
    numero: "___",
    ano: new Date(assembleia.data).getFullYear(),
    orgao: "assembleia_compartes",
    nome_baldio: organization?.name ?? "Baldio",
    data: formatDatePt(assembleia.data),
    hora_inicio: assembleia.hora.slice(0, 5),
    hora_encerramento: null,
    local: assembleia.local,
    ordem_trabalhos: ordem,
    presencas: null,
    quorum: null,
    pontos_discutidos: assembleia.observacoes,
    deliberacoes: ordem.map((ponto, index) => ({
      ponto_ordem: index + 1,
      titulo_ponto: ponto,
      texto: "A preencher após discussão do ponto.",
      resultado_votacao: "A preencher.",
      maioria_exigida: "A definir conforme matéria.",
      estado: "rascunho"
    })),
    documentos_anexos: null,
    assinaturas: "Presidente da Mesa da Assembleia de Compartes e restantes membros da mesa.",
    estado: "rascunho"
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
