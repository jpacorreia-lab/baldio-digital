import { ComparteForm } from "@/components/compartes/comparte-form";
import { createComparte } from "@/app/(app)/compartes/actions";

export default function NovoCompartePage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Criar comparte</h1>
        <p className="mt-2 text-stone-600">
          Adiciona um novo registo à organização ativa.
        </p>
      </div>
      <ComparteForm action={createComparte} />
    </div>
  );
}
