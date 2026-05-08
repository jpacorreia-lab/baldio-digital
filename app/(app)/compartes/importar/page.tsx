import { FileSpreadsheet, Upload } from "lucide-react";
import { importCompartes } from "@/app/(app)/compartes/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ImportarCompartesPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Importar compartes</h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Usa o modelo, preenche uma linha por comparte e submete o ficheiro.
        </p>
      </div>

      <form action={importCompartes} className="grid gap-6">
        <section className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-soft">
          <div className="flex flex-col justify-between gap-3 rounded-md border border-line bg-field p-4 md:flex-row md:items-center">
            <div>
              <p className="font-semibold text-ink">Modelo de importação</p>
              <p className="mt-1 text-sm text-stone-600">
                O ficheiro já vem com os mesmos campos da ficha de comparte.
              </p>
            </div>
            <ButtonLink href="/modelo-compartes.xlsx" variant="secondary">
              <FileSpreadsheet className="h-4 w-4" />
              Obter modelo Excel
            </ButtonLink>
          </div>
          <Field label="Ficheiro">
            <Input
              accept=".xlsx,.xls,.csv"
              name="file"
              required
              type="file"
            />
          </Field>
          <div className="rounded-md border border-line bg-field p-4 text-sm leading-6 text-stone-700">
            <p className="font-semibold text-ink">Campos do ficheiro</p>
            <p className="mt-2">
              nome_completo, cartao_cidadao, nif, morada, localidade,
              telefone, email, data_nascimento, data_admissao, fundamento,
              estado e observacoes.
            </p>
            <p className="mt-2">
              A coluna <strong>nome_completo</strong> é obrigatória. Datas em
              formato AAAA-MM-DD.
            </p>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <ButtonLink href="/compartes" variant="secondary">
            Cancelar
          </ButtonLink>
          <Button type="submit">
            <Upload className="h-4 w-4" />
            Importar ficheiro
          </Button>
        </div>
      </form>
    </div>
  );
}
