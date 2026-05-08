import { Download, FileCheck2 } from "lucide-react";
import { notFound } from "next/navigation";
import { markEditalEmitido } from "@/app/(app)/assembleias/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { editalDeadline, formatDatePt } from "@/lib/assembleias/dates";
import type { Assembleia } from "@/lib/types";

type AssembleiaPageProps = {
  params: { id: string };
};

export default async function AssembleiaPage({ params }: AssembleiaPageProps) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assembleias")
    .select("*")
    .eq("id", params.id)
    .single();

  const assembleia = data as Assembleia | null;
  if (error || !assembleia) notFound();

  const emitAction = markEditalEmitido.bind(null, assembleia.id);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase text-clay">
            {assembleia.tipo === "ordinaria" ? "Ordinária" : "Extraordinária"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{assembleia.titulo}</h1>
          <p className="mt-2 text-stone-600">
            {formatDatePt(assembleia.data)} às {assembleia.hora.slice(0, 5)} · {assembleia.local}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/assembleias/${assembleia.id}/edital`}>
            <Download className="h-4 w-4" />
            Descarregar edital
          </ButtonLink>
          <form action={emitAction}>
            <Button type="submit" variant="secondary">
              <FileCheck2 className="h-4 w-4" />
              Marcar edital emitido
            </Button>
          </form>
        </div>
      </div>

      <section className="grid gap-4 rounded-md border border-line bg-white p-6 shadow-soft md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase text-stone-500">
            Data-limite para edital
          </p>
          <p className="mt-1 font-semibold text-ink">
            {formatDatePt(editalDeadline(assembleia.data))}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-stone-500">Estado</p>
          <p className="mt-1 font-semibold text-ink">{assembleia.estado}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-stone-500">
            Edital emitido em
          </p>
          <p className="mt-1 font-semibold text-ink">
            {assembleia.edital_emitido_em
              ? formatDatePt(assembleia.edital_emitido_em)
              : "Ainda não emitido"}
          </p>
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Ordem de trabalhos</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {assembleia.ordem_trabalhos}
        </p>
      </section>
    </div>
  );
}
