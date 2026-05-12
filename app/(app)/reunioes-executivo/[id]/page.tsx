import { FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatDatePt } from "@/lib/assembleias/dates";
import type { ReuniaoExecutivo } from "@/lib/types";

type ReuniaoPageProps = {
  params: { id: string };
};

export default async function ReuniaoExecutivoPage({ params }: ReuniaoPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reunioes_executivo")
    .select("*")
    .eq("id", params.id)
    .single();

  const reuniao = data as ReuniaoExecutivo | null;
  if (error || !reuniao) notFound();

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase text-clay">{reuniao.estado}</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{reuniao.titulo}</h1>
          <p className="mt-2 text-stone-600">
            {formatDatePt(reuniao.data)} às {reuniao.hora.slice(0, 5)} · {reuniao.local}
          </p>
        </div>
        <ButtonLink href={`/atas/reuniao-executivo/${reuniao.id}/html`} variant="secondary">
          <FileText className="h-4 w-4" />
          Gerar ata
        </ButtonLink>
      </div>

      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Decisões tomadas</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">{reuniao.decisoes}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-line bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Participantes</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
            {reuniao.participantes || "Sem participantes registados."}
          </p>
        </article>
        <article className="rounded-md border border-line bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">Ordem de trabalhos</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
            {reuniao.ordem_trabalhos || "Sem ordem de trabalhos registada."}
          </p>
        </article>
      </section>

      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Notas da reunião</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {reuniao.observacoes || "Sem notas registadas."}
        </p>
      </section>
    </div>
  );
}
