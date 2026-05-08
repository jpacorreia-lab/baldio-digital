import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

export function AssembleiaForm({
  action
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-6">
      <section className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-soft md:grid-cols-2">
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
        <Button type="submit">Marcar assembleia</Button>
      </div>
    </form>
  );
}
