import Link from "next/link";
import { ClipboardCheck, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatDatePt } from "@/lib/assembleias/dates";
import type { ReuniaoExecutivo } from "@/lib/types";

export default async function ReunioesExecutivoPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reunioes_executivo")
    .select("*")
    .order("data", { ascending: false });

  if (error && !error.message.includes("reunioes_executivo")) {
    throw new Error(error.message);
  }

  const reunioes = (data ?? []) as ReuniaoExecutivo[];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">Reuniões do executivo</h1>
          <p className="mt-2 text-stone-600">
            Registo das reuniões internas e das decisões tomadas.
          </p>
        </div>
        <ButtonLink href="/reunioes-executivo/novo">
          <Plus className="h-4 w-4" />
          Registar reunião
        </ButtonLink>
      </div>

      {reunioes.length === 0 ? (
        <div className="rounded-md border border-line bg-white p-8 text-center shadow-soft">
          <ClipboardCheck className="mx-auto h-8 w-8 text-clay" />
          <p className="mt-3 font-semibold text-ink">Sem reuniões registadas</p>
          <p className="mt-2 text-sm text-stone-600">
            Regista a primeira reunião do executivo e as decisões tomadas.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {reunioes.map((reuniao) => (
            <Link
              className="rounded-md border border-line bg-white p-4 shadow-soft transition hover:border-moss"
              href={`/reunioes-executivo/${reuniao.id}`}
              key={reuniao.id}
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <p className="font-semibold text-ink">{reuniao.titulo}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {formatDatePt(reuniao.data)} às {reuniao.hora.slice(0, 5)} · {reuniao.local}
                  </p>
                </div>
                <span className="rounded-full bg-field px-3 py-1 text-xs font-semibold text-stone-700">
                  {reuniao.estado}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
