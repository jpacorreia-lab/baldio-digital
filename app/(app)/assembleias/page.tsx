import Link from "next/link";
import { CalendarPlus, FileText } from "lucide-react";
import { ObligationCard } from "@/components/assembleias/obligation-card";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  daysUntil,
  editalDeadline,
  formatDatePt
} from "@/lib/assembleias/dates";
import type { Assembleia } from "@/lib/types";

function editalStatus(data: string, editalEmitidoEm: string | null) {
  if (editalEmitidoEm) return "ok";
  const days = daysUntil(editalDeadline(data));
  if (days < 0) return "late";
  if (days <= 5) return "warning";
  return "ok";
}

export default async function AssembleiasPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assembleias")
    .select("*")
    .order("data", { ascending: true });

  if (error && !error.message.includes("assembleias")) {
    throw new Error(error.message);
  }

  const assembleias = (data ?? []) as Assembleia[];
  const now = new Date();
  const year = now.getFullYear();
  const obrigacoesFixas = [
    {
      title: "Assembleia ordinária do 1.º trimestre",
      description:
        "Deve ocorrer até 31 de março para apreciação de contas e matérias anuais.",
      status: now > new Date(`${year}-03-31T23:59:59`) ? "late" : "warning"
    },
    {
      title: "Assembleia ordinária do 4.º trimestre",
      description:
        "Deve ocorrer até 31 de dezembro para plano de atividades e orçamento.",
      status: now > new Date(`${year}-12-31T23:59:59`) ? "late" : "warning"
    }
  ] as const;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">Assembleias</h1>
          <p className="mt-2 text-stone-600">
            Calendário de obrigações, marcação de assembleias e emissão de edital.
          </p>
        </div>
        <ButtonLink href="/assembleias/novo">
          <CalendarPlus className="h-4 w-4" />
          Marcar assembleia
        </ButtonLink>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {obrigacoesFixas.map((item) => (
          <ObligationCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold text-ink">Assembleias marcadas</h2>
        {assembleias.length === 0 ? (
          <div className="rounded-md border border-line bg-white p-8 text-center shadow-soft">
            <p className="font-semibold text-ink">Sem assembleias marcadas</p>
            <p className="mt-2 text-sm text-stone-600">
              Marca a primeira assembleia para gerar o calendário de edital.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {assembleias.map((assembleia) => (
              <Link
                className="rounded-md border border-line bg-white p-4 shadow-soft transition hover:border-moss"
                href={`/assembleias/${assembleia.id}`}
                key={assembleia.id}
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="font-semibold text-ink">{assembleia.titulo}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatDatePt(assembleia.data)} às {assembleia.hora.slice(0, 5)} · {assembleia.local}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      Edital até {formatDatePt(editalDeadline(assembleia.data))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <FileText className="h-4 w-4" />
                    {assembleia.edital_emitido_em ? "Edital emitido" : "Edital pendente"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-md border border-line bg-white p-5 text-sm leading-6 text-stone-700 shadow-soft">
        <p className="font-semibold text-ink">Regras usadas nesta versão</p>
        <p className="mt-2">
          A assembleia ordinária aparece como obrigação semestral e cada assembleia
          marcada calcula automaticamente a data-limite para edital com 15 dias de
          antecedência.
        </p>
      </section>
    </div>
  );
}
