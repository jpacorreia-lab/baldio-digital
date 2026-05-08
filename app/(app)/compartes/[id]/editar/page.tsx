import { notFound } from "next/navigation";
import { ComparteForm } from "@/components/compartes/comparte-form";
import { updateComparte } from "@/app/(app)/compartes/actions";
import { createClient } from "@/lib/supabase/server";
import type { Comparte } from "@/lib/types";

type EditarCompartePageProps = {
  params: { id: string };
};

export default async function EditarCompartePage({
  params
}: EditarCompartePageProps) {
  const { id } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("compartes")
    .select("*")
    .eq("id", id)
    .single();

  const comparte = data as Comparte | null;

  if (error || !comparte) notFound();

  const action = updateComparte.bind(null, id);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Editar comparte</h1>
        <p className="mt-2 text-stone-600">{comparte.nome}</p>
      </div>
      <ComparteForm action={action} comparte={comparte} />
    </div>
  );
}
