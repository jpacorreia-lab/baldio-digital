import { Plus, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ComparteFilters } from "@/components/compartes/comparte-filters";
import { CompartesTable } from "@/components/compartes/compartes-table";
import { createClient } from "@/lib/supabase/server";
import type { ComparteEstado } from "@/lib/types";

type CompartesPageProps = {
  searchParams: {
    q?: string;
    estado?: ComparteEstado;
  };
};

export default async function CompartesPage({
  searchParams
}: CompartesPageProps) {
  const supabase = await createClient();
  const query = searchParams.q?.trim();
  const estado = searchParams.estado;

  let request = supabase
    .from("compartes")
    .select("*")
    .order("nome", { ascending: true });

  if (query) {
    const safeQuery = query.replaceAll(",", " ");
    request = request.or(
      `nome.ilike.%${safeQuery}%,cartao_cidadao.ilike.%${safeQuery}%,nif.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%,localidade.ilike.%${safeQuery}%`
    );
  }

  if (estado) {
    request = request.eq("estado", estado);
  }

  const { data: compartes, error } = await request;
  if (error) throw new Error(error.message);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">Compartes</h1>
          <p className="mt-2 text-stone-600">
            Registo, consulta e manutenção dos compartes do baldio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/compartes/importar" variant="secondary">
            <Upload className="h-4 w-4" />
            Importar
          </ButtonLink>
          <ButtonLink href="/compartes/novo">
            <Plus className="h-4 w-4" />
            Criar comparte
          </ButtonLink>
        </div>
      </div>
      <ComparteFilters estado={estado} query={query} />
      <CompartesTable compartes={compartes ?? []} />
    </div>
  );
}
