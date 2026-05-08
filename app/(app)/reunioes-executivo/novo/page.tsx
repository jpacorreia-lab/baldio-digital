import { createReuniaoExecutivo } from "@/app/(app)/reunioes-executivo/actions";
import { ReuniaoExecutivoForm } from "@/components/reunioes-executivo/reuniao-form";

export default function NovaReuniaoExecutivoPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Registar reunião</h1>
        <p className="mt-2 text-stone-600">
          Guarda a reunião do executivo e as decisões tomadas.
        </p>
      </div>
      <ReuniaoExecutivoForm action={createReuniaoExecutivo} />
    </div>
  );
}
