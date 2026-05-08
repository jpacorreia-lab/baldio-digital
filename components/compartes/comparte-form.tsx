import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { estadoOptions } from "@/components/compartes/status-badge";
import type { Comparte } from "@/lib/types";

type ComparteFormProps = {
  action: (formData: FormData) => Promise<void>;
  comparte?: Comparte;
};

export function ComparteForm({ action, comparte }: ComparteFormProps) {
  return (
    <form action={action} className="grid gap-6">
      <section className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-soft md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Nome">
            <Input
              defaultValue={comparte?.nome}
              name="nome"
              placeholder="Nome completo"
              required
            />
          </Field>
        </div>
        <Field label="Cartão de cidadão">
          <Input
            defaultValue={comparte?.cartao_cidadao ?? ""}
            name="cartao_cidadao"
          />
        </Field>
        <Field label="NIF">
          <Input defaultValue={comparte?.nif ?? ""} name="nif" />
        </Field>
        <Field label="Estado">
          <Select defaultValue={comparte?.estado ?? "pendente"} name="estado">
            {estadoOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Morada">
          <Input defaultValue={comparte?.morada ?? ""} name="morada" />
        </Field>
        <Field label="Localidade">
          <Input defaultValue={comparte?.localidade ?? ""} name="localidade" />
        </Field>
        <Field label="Telefone">
          <Input defaultValue={comparte?.telefone ?? ""} name="telefone" />
        </Field>
        <Field label="Email">
          <Input defaultValue={comparte?.email ?? ""} name="email" type="email" />
        </Field>
        <Field label="Data de nascimento">
          <Input
            defaultValue={comparte?.data_nascimento ?? ""}
            name="data_nascimento"
            type="date"
          />
        </Field>
        <Field label="Data de admissão">
          <Input
            defaultValue={comparte?.data_admissao ?? ""}
            name="data_admissao"
            type="date"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Fundamento">
            <Textarea
              defaultValue={comparte?.fundamento ?? ""}
              name="fundamento"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Observações">
            <Textarea
              defaultValue={comparte?.observacoes ?? ""}
              name="observacoes"
            />
          </Field>
        </div>
      </section>
      <div className="flex justify-end gap-3">
        <ButtonLink href="/compartes" variant="secondary">
          Cancelar
        </ButtonLink>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
