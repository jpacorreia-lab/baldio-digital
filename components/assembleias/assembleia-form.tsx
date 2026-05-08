"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { AssembleiaActionState } from "@/app/(app)/assembleias/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "A marcar..." : "Marcar assembleia"}
    </Button>
  );
}

export function AssembleiaForm({
  action
}: {
  action: (
    previousState: AssembleiaActionState,
    formData: FormData
  ) => Promise<AssembleiaActionState>;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="grid gap-6">
      <section className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-soft md:grid-cols-2">
        {state.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 md:col-span-2">
            {state.error}
          </div>
        ) : null}
        <div className="md:col-span-2">
          <Field label="Título da assembleia">
            <Input name="titulo" placeholder="Assembleia de compartes" required />
          </Field>
        </div>
        <Field label="Tipo">
          <Select name="tipo" defaultValue="ordinaria">
            <option value="ordinaria">Ordinária</option>
            <option value="extraordinaria">Extraordinária</option>
          </Select>
        </Field>
        <Field label="Data">
          <Input name="data" required type="date" />
        </Field>
        <Field label="Hora">
          <Input name="hora" required type="time" />
        </Field>
        <Field label="Local">
          <Input name="local" placeholder="Local da reunião" required />
        </Field>
        <div className="md:col-span-2">
          <Field label="Ordem de trabalhos">
            <Textarea
              name="ordem_trabalhos"
              placeholder="Um ponto por linha"
              required
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Observações">
            <Textarea name="observacoes" />
          </Field>
        </div>
      </section>
      <div className="flex justify-end gap-3">
        <ButtonLink href="/assembleias" variant="secondary">
          Cancelar
        </ButtonLink>
        <SubmitButton />
      </div>
    </form>
  );
}
