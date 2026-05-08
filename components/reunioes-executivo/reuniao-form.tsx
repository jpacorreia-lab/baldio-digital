import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

export function ReuniaoExecutivoForm({
  action
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-6">
      <section className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-soft md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Título">
            <Input
              name="titulo"
              placeholder="Reunião do conselho diretivo"
              required
            />
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
            <Textarea
              name="participantes"
              placeholder="Nome dos presentes, um por linha"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Ordem de trabalhos">
            <Textarea name="ordem_trabalhos" placeholder="Um ponto por linha" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Decisões tomadas">
            <Textarea
              name="decisoes"
              placeholder="Regista as decisões, uma por linha"
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
        <ButtonLink href="/reunioes-executivo" variant="secondary">
          Cancelar
        </ButtonLink>
        <Button type="submit">Guardar reunião</Button>
      </div>
    </form>
  );
}
