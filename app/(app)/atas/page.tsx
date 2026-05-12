import { CalendarDays, FileText } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatDatePt } from "@/lib/assembleias/dates";
import { getCurrentProfile } from "@/lib/supabase/auth";
import type { Assembleia, Ata, ReuniaoExecutivo } from "@/lib/types";

const estados = [
  "rascunho",
  "em_revisao",
  "aprovada",
  "publicada",
  "retificada",
  "arquivada"
];

const orgaoLabels = {
  assembleia_compartes: "Assembleia de Compartes",
  conselho_diretivo: "Conselho Diretivo",
  comissao_fiscalizacao: "Comissão de Fiscalização"
};

function isMissingTable(errorMessage?: string) {
  return Boolean(
    errorMessage?.includes("does not exist") ||
      errorMessage?.includes("schema cache") ||
      errorMessage?.includes("atas")
  );
}

export default async function AtasPage() {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();

  const organizationId = profile.organization_id;
  const atasQuery = organizationId
    ? await supabase
        .from("atas")
        .select("*")
        .eq("organization_id", organizationId)
        .order("data", { ascending: false })
    : { data: null, error: null };

  const assembleiasQuery = organizationId
    ? await supabase
        .from("assembleias")
        .select("*")
        .eq("organization_id", organizationId)
        .order("data", { ascending: false })
    : { data: null, error: null };

  const reunioesQuery = organizationId
    ? await supabase
        .from("reunioes_executivo")
        .select("*")
        .eq("organization_id", organizationId)
        .order("data", { ascending: false })
    : { data: null, error: null };

  const atas = (atasQuery.data ?? []) as Ata[];
  const assembleias = (assembleiasQuery.data ?? []) as Assembleia[];
  const reunioes = (reunioesQuery.data ?? []) as ReuniaoExecutivo[];
  const atasTableMissing = isMissingTable(atasQuery.error?.message);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Atas</h1>
        <p className="mt-2 text-stone-600">
          Modelo normalizado para atas de assembleias de compartes, conselho
          diretivo e comissão de fiscalização.
        </p>
      </div>

      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-clay" />
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Geração a partir de assembleias ou reuniões
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              Abre uma assembleia ou reunião do executivo e usa o botão de ata.
              A versão HTML já fica pronta para imprimir/exportar como PDF pelo
              navegador.
            </p>
          </div>
        </div>
      </section>

      {atasTableMissing ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          A tabela de atas ainda não está disponível na API. Confirma se correste
          o conteúdo completo do ficheiro{" "}
          <code>supabase/12_atas_deliberacoes.sql</code> no Supabase.
        </section>
      ) : null}

      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Atas guardadas</h2>
        {atas.length ? (
          <div className="mt-4 divide-y divide-line">
            {atas.map((ata) => (
              <div
                className="flex flex-col justify-between gap-3 py-4 md:flex-row md:items-center"
                key={ata.id}
              >
                <div>
                  <p className="font-semibold text-ink">
                    Ata n.º {ata.numero}/{ata.ano}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {orgaoLabels[ata.orgao]} · {formatDatePt(ata.data)} · {ata.estado}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-stone-600">
            Ainda não existem atas guardadas. Podes gerar uma ata a partir de uma
            assembleia ou de uma reunião abaixo.
          </p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-line bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Assembleias disponíveis</h2>
          {assembleias.length ? (
            <div className="mt-4 divide-y divide-line">
              {assembleias.map((assembleia) => (
                <div className="grid gap-3 py-4" key={assembleia.id}>
                  <div>
                    <p className="font-semibold text-ink">{assembleia.titulo}</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-stone-600">
                      <CalendarDays className="h-4 w-4" />
                      {formatDatePt(assembleia.data)} às {assembleia.hora.slice(0, 5)}
                    </p>
                  </div>
                  <ButtonLink href={`/atas/assembleia/${assembleia.id}/html`} variant="secondary">
                    Gerar ata
                  </ButtonLink>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-stone-600">Ainda não há assembleias registadas.</p>
          )}
        </article>

        <article className="rounded-md border border-line bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Reuniões do executivo disponíveis</h2>
          {reunioes.length ? (
            <div className="mt-4 divide-y divide-line">
              {reunioes.map((reuniao) => (
                <div className="grid gap-3 py-4" key={reuniao.id}>
                  <div>
                    <p className="font-semibold text-ink">{reuniao.titulo}</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-stone-600">
                      <CalendarDays className="h-4 w-4" />
                      {formatDatePt(reuniao.data)} às {reuniao.hora.slice(0, 5)}
                    </p>
                  </div>
                  <ButtonLink href={`/atas/reuniao-executivo/${reuniao.id}/html`} variant="secondary">
                    Gerar ata
                  </ButtonLink>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-stone-600">Ainda não há reuniões registadas.</p>
          )}
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-line bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Estados da ata</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {estados.map((estado) => (
              <span
                className="rounded-full bg-field px-3 py-1 text-xs font-semibold text-stone-700"
                key={estado}
              >
                {estado}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-line bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Estrutura prevista</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Número, ano, órgão, baldio, data, hora, local, ordem de trabalhos,
            presenças, quórum, pontos discutidos, deliberações, votações,
            documentos anexos, encerramento e assinaturas.
          </p>
        </article>
      </section>
    </div>
  );
}
