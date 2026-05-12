"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import type { ReuniaoExecutivoActionState } from "@/app/(app)/reunioes-executivo/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "A guardar..." : "Guardar reunião"}
    </Button>
  );
}

export function ReuniaoExecutivoForm({
  action
}: {
  action: (
    state: ReuniaoExecutivoActionState,
    formData: FormData
  ) => Promise<ReuniaoExecutivoActionState>;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="grid gap-6">
      {state.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      ) : null}

      <section className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-soft md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Título">
            <Input name="titulo" placeholder="Reunião do conselho diretivo" required />
          </Field>
        </div>
        <Field label="Data">
          <Input name="data" required type="date" />
        </Field>
        <Field label="Hora">
          <Input name="hora" required type="time" />
        </Field>
        <Field label="Local">
          <Input name="local" required />
        </Field>
        <Field label="Estado">
          <Select name="estado" defaultValue="realizada">
            <option value="realizada">Realizada</option>
            <option value="rascunho">Rascunho</option>
            <option value="arquivada">Arquivada</option>
          </Select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Participantes">
            <Textarea name="participantes" placeholder="Nome dos presentes, um por linha" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Ordem de trabalhos">
            <Textarea name="ordem_trabalhos" placeholder="Um ponto por linha" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Decisões tomadas">
            <Textarea name="decisoes" placeholder="Regista as decisões, uma por linha" required />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Notas da reunião">
            <Textarea
              name="observacoes"
              placeholder="Notas livres da reunião, assuntos discutidos, contexto e elementos relevantes para a ata"
            />
          </Field>
        </div>
      </section>
      <div className="flex justify-end gap-3">
        <ButtonLink href="/reunioes-executivo" variant="secondary">
          Cancelar
        </ButtonLink>
        <SubmitButton />
      </div>
    </form>
  );
}
