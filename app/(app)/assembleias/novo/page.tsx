import { AssembleiaForm } from "@/components/assembleias/assembleia-form";
import { createAssembleia } from "@/app/(app)/assembleias/actions";

export default function NovaAssembleiaPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Marcar assembleia</h1>
        <p className="mt-2 text-stone-600">
          Define data, local e ordem de trabalhos. O sistema calcula a data-limite do edital.
        </p>
      </div>
      <AssembleiaForm action={createAssembleia} />
    </div>
  );
}
