import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatDatePt } from "@/lib/assembleias/dates";
import { generateAtaHtml, splitAgenda } from "@/lib/atas/html";
import type { Organization, ReuniaoExecutivo } from "@/lib/types";

type RouteProps = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: RouteProps) {
  const supabase = await createClient();
  const { data: reuniaoData, error } = await supabase
    .from("reunioes_executivo")
    .select("*")
    .eq("id", params.id)
    .single();

  const reuniao = reuniaoData as ReuniaoExecutivo | null;
  if (error || !reuniao) {
    return NextResponse.json({ error: "Reunião não encontrada." }, { status: 404 });
  }

  const { data: organizationData } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", reuniao.organization_id)
    .single();

  const organization = organizationData as Organization | null;
  const ordem = splitAgenda(reuniao.ordem_trabalhos || reuniao.decisoes);
  const decisoes = splitAgenda(reuniao.decisoes);
  const html = generateAtaHtml({
    numero: "___",
    ano: new Date(reuniao.data).getFullYear(),
    orgao: "conselho_diretivo",
    nome_baldio: organization?.name ?? "Baldio",
    data: formatDatePt(reuniao.data),
    hora_inicio: reuniao.hora.slice(0, 5),
    hora_encerramento: null,
    local: reuniao.local,
    ordem_trabalhos: ordem,
    presencas: reuniao.participantes,
    quorum: null,
    pontos_discutidos: reuniao.observacoes || reuniao.decisoes,
    deliberacoes: (decisoes.length ? decisoes : ordem).map((decisao, index) => ({
      ponto_ordem: index + 1,
      titulo_ponto: ordem[index] || `Decisão ${index + 1}`,
      texto: decisao,
      resultado_votacao: "A preencher, se aplicável.",
      maioria_exigida: "A definir conforme matéria.",
      estado: "rascunho"
    })),
    documentos_anexos: null,
    assinaturas: "Membros presentes do conselho diretivo.",
    estado: "rascunho"
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
