import { Archive, Edit, PauseCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/compartes/status-badge";
import { setComparteEstado } from "@/app/(app)/compartes/actions";
import { createClient } from "@/lib/supabase/server";
import type { Comparte } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type CompartePageProps = {
  params: { id: string };
};

export default async function CompartePage({ params }: CompartePageProps) {
  const { id } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("compartes")
    .select("*")
    .eq("id", id)
    .single();

  const comparte = data as Comparte | null;

  if (error || !comparte) notFound();

  const suspendAction = setComparteEstado.bind(null, id, "suspenso");
  const archiveAction = setComparteEstado.bind(null, id, "removido");

  const details = [
    ["Cartão de cidadão", comparte.cartao_cidadao ?? "-"],
    ["NIF", comparte.nif ?? "-"],
    ["Morada", comparte.morada ?? "-"],
    ["Localidade", comparte.localidade ?? "-"],
    ["Telefone", comparte.telefone ?? "-"],
    ["Email", comparte.email ?? "-"],
    ["Data de nascimento", formatDate(comparte.data_nascimento)],
    ["Data de admissão", formatDate(comparte.data_admissao)],
    ["Criado em", formatDate(comparte.created_at)],
    ["Atualizado em", formatDate(comparte.updated_at)]
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-3">
            <StatusBadge estado={comparte.estado} />
          </div>
          <h1 className="text-3xl font-bold text-ink">{comparte.nome}</h1>
          <p className="mt-2 text-stone-600">Ficha individual do comparte.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/compartes/${id}/editar`} variant="secondary">
            <Edit className="h-4 w-4" />
            Editar
          </ButtonLink>
          <form action={suspendAction}>
            <Button type="submit" variant="secondary">
              <PauseCircle className="h-4 w-4" />
              Inativar
            </Button>
          </form>
          <form action={archiveAction}>
            <Button type="submit" variant="danger">
              <Archive className="h-4 w-4" />
              Arquivar
            </Button>
          </form>
        </div>
      </div>
      <section className="grid gap-4 rounded-md border border-line bg-white p-6 shadow-soft md:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase text-stone-500">
              {label}
            </p>
            <p className="mt-1 text-sm text-ink">{value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Fundamento</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {comparte.fundamento || "Sem fundamento registado."}
        </p>
      </section>
      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Observações</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {comparte.observacoes || "Sem observações."}
        </p>
      </section>
    </div>
  );
}
