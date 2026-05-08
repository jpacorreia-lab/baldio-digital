import { Download, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function CadernosEleitoraisPage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("compartes")
    .select("*", { count: "exact", head: true })
    .eq("estado", "ativo");

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">Cadernos eleitorais</h1>
          <p className="mt-2 text-stone-600">
            Lista gerada a partir dos compartes com estado ativo.
          </p>
        </div>
        <ButtonLink href="/cadernos-eleitorais/pdf">
          <Download className="h-4 w-4" />
          Gerar PDF
        </ButtonLink>
      </div>

      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-field text-clay">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-stone-600">Compartes ativos</p>
            <p className="text-3xl font-bold text-ink">{count ?? 0}</p>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-white p-6 text-sm leading-6 text-stone-700 shadow-soft">
        <p className="font-semibold text-ink">O PDF inclui</p>
        <p className="mt-2">
          Nome, número de cartão de cidadão e uma caixa para assinalar que o
          comparte exerceu o voto.
        </p>
      </section>
    </div>
  );
}
