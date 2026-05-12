import type { AtaEstado, DeliberacaoEstado, OrgaoAta } from "@/lib/types";

export type AtaDeliberacaoHtml = {
  ponto_ordem: number;
  titulo_ponto?: string | null;
  texto: string;
  resultado_votacao?: string | null;
  maioria_exigida?: string | null;
  estado: DeliberacaoEstado;
};

export type AtaHtmlData = {
  numero: number | string;
  ano: number | string;
  orgao: OrgaoAta;
  nome_baldio: string;
  data: string;
  hora_inicio: string;
  hora_encerramento?: string | null;
  local: string;
  ordem_trabalhos: string[];
  presencas?: string | null;
  quorum?: string | null;
  pontos_discutidos?: string | null;
  deliberacoes: AtaDeliberacaoHtml[];
  documentos_anexos?: string | null;
  assinaturas?: string | null;
  estado: AtaEstado;
};

const orgaoLabels: Record<OrgaoAta, string> = {
  assembleia_compartes: "Assembleia de Compartes",
  conselho_diretivo: "Conselho Diretivo",
  comissao_fiscalizacao: "Comissão de Fiscalização"
};

const estadoLabels: Record<AtaEstado, string> = {
  rascunho: "Rascunho",
  em_revisao: "Em revisão",
  aprovada: "Aprovada",
  publicada: "Publicada",
  retificada: "Retificada",
  arquivada: "Arquivada"
};

const assinaturaLabels: Record<OrgaoAta, string[]> = {
  assembleia_compartes: ["O Presidente da Mesa", "O Secretário", "O Vogal"],
  conselho_diretivo: ["O Presidente do Conselho Diretivo", "O Secretário", "O Tesoureiro"],
  comissao_fiscalizacao: ["O Presidente da Comissão de Fiscalização", "O Secretário", "O Vogal"]
};

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(value?: string | null, fallback = "A preencher.") {
  const text = value?.trim() || fallback;
  return escapeHtml(text).replace(/\n/g, "<br />");
}

function inlineText(value?: string | null, fallback = "a preencher") {
  return escapeHtml(value?.trim() || fallback);
}

export function splitAgenda(value: string | null | undefined) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function generateAtaHtml(data: AtaHtmlData) {
  const ordem = data.ordem_trabalhos.length ? data.ordem_trabalhos : ["A preencher."];
  const deliberacoes = data.deliberacoes.length
    ? data.deliberacoes
    : ordem.map((ponto, index) => ({
        ponto_ordem: index + 1,
        titulo_ponto: ponto,
        texto: "Sem deliberação registada.",
        resultado_votacao: "Sem votação registada.",
        maioria_exigida: "A definir.",
        estado: "rascunho" as DeliberacaoEstado
      }));

  const ordemHtml = ordem
    .map((ponto, index) => `<li>${index + 1}. ${escapeHtml(ponto)}</li>`)
    .join("");

  const deliberacoesHtml = deliberacoes
    .map(
      (deliberacao) => `<section class="ponto">
        <p><strong>Ponto ${escapeHtml(deliberacao.ponto_ordem)} - ${escapeHtml(deliberacao.titulo_ponto || "Sem título")}</strong></p>
        <p>Entrando na apreciação do referido ponto da ordem de trabalhos, foi registado o seguinte: ${paragraph(deliberacao.texto)}</p>
        <p>Submetida a matéria a votação, quando aplicável, ficou registado o seguinte resultado: ${paragraph(deliberacao.resultado_votacao)} A maioria exigida para a deliberação foi indicada como: ${paragraph(deliberacao.maioria_exigida)}</p>
        <p>Estado da deliberação: ${escapeHtml(deliberacao.estado)}.</p>
      </section>`
    )
    .join("");

  const assinaturas = assinaturaLabels[data.orgao]
    .map((label) => `<div class="signature">${escapeHtml(label)}</div>`)
    .join("");

  return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <title>Ata ${escapeHtml(data.numero)}/${escapeHtml(data.ano)}</title>
  <style>
    :root { color: #111; font-family: "Times New Roman", Times, serif; }
    body { margin: 0; background: #eee; }
    main { width: 210mm; min-height: 297mm; margin: 24px auto; background: #fff; padding: 24mm 22mm; box-sizing: border-box; }
    h1 { margin: 0 0 18px; font-size: 16px; text-align: center; text-transform: uppercase; letter-spacing: 0; }
    h2 { margin: 22px 0 10px; font-size: 13px; text-align: center; text-transform: uppercase; }
    p, li { font-size: 12pt; line-height: 1.6; text-align: justify; }
    ol { margin: 8px 0 16px 28px; padding: 0; }
    li { margin: 4px 0; }
    .center { text-align: center; }
    .estado { margin-bottom: 18px; font-size: 10pt; text-align: center; text-transform: uppercase; }
    .ponto { margin-top: 16px; }
    .signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 42px; }
    .signature { border-top: 1px solid #333; padding-top: 8px; text-align: center; min-height: 34px; font-size: 11pt; }
    .actions { width: 210mm; margin: 18px auto; text-align: right; }
    .actions button { background: #315345; color: #fff; border: 0; border-radius: 6px; padding: 10px 14px; font-weight: 700; }
    @media print { body { background: #fff; } main { margin: 0; box-shadow: none; } .actions { display: none; } }
  </style>
</head>
<body>
  <div class="actions"><button onclick="window.print()">Exportar / imprimir PDF</button></div>
  <main>
    <h1>Ata n.º ${escapeHtml(data.numero)}/${escapeHtml(data.ano)}</h1>
    <p class="center"><strong>${escapeHtml(orgaoLabels[data.orgao])}</strong></p>
    <p class="center"><strong>${escapeHtml(data.nome_baldio)}</strong></p>
    <p class="estado">Estado interno do documento: ${escapeHtml(estadoLabels[data.estado])}</p>

    <p>Aos ${escapeHtml(data.data)}, pelas ${escapeHtml(data.hora_inicio)}, no local ${escapeHtml(data.local)}, reuniu o(a) ${escapeHtml(orgaoLabels[data.orgao])} do ${escapeHtml(data.nome_baldio)}, com a finalidade de apreciar e deliberar sobre os assuntos constantes da respetiva ordem de trabalhos.</p>

    <p>Declarada aberta a reunião, procedeu-se à verificação das presenças e do quórum. Encontravam-se presentes: ${paragraph(data.presencas)}. Quanto ao quórum, ficou consignado o seguinte: ${paragraph(data.quorum)}</p>

    <p>Foi apresentada a seguinte ordem de trabalhos:</p>
    <ol>${ordemHtml}</ol>

    <h2>Discussão e deliberações</h2>
    <p>Passou-se à apreciação dos pontos constantes da ordem de trabalhos, tendo sido registado o essencial das discussões havidas, das deliberações tomadas e das votações realizadas.</p>
    <p>${paragraph(data.pontos_discutidos, "Não foram registadas notas adicionais para além das deliberações abaixo identificadas.")}</p>
    ${deliberacoesHtml}

    <h2>Documentos anexos</h2>
    <p>Foram mencionados ou juntos à presente ata os seguintes documentos: ${paragraph(data.documentos_anexos, "não foram registados documentos anexos.")}</p>

    <h2>Encerramento</h2>
    <p>Nada mais havendo a tratar, foi declarada encerrada a reunião pelas ${inlineText(data.hora_encerramento)}, da qual se lavrou a presente ata. Depois de lida e aprovada, a ata vai ser assinada nos termos legais.</p>

    <p>${paragraph(data.assinaturas, "Assinaturas a recolher pelos membros competentes.")}</p>

    <div class="signatures">${assinaturas}</div>
  </main>
</body>
</html>`;
}
