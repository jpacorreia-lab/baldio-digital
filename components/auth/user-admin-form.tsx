import { UserPlus } from "lucide-react";
import { upsertProfile } from "@/app/(app)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";

export function UserAdminForm() {
  return (
    <form action={upsertProfile} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="UID do utilizador">
          <Input
            name="id"
            placeholder="UID do Supabase Auth"
            required
          />
        </Field>
        <Field label="Nome">
          <Input name="full_name" required />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" />
        </Field>
        <Field label="Função">
          <Select name="role" defaultValue="conselho_diretivo">
            <option value="conselho_diretivo">Conselho diretivo</option>
            <option value="mesa_assembleia">Mesa da assembleia</option>
            <option value="comissao_fiscalizacao">Comissão de fiscalização</option>
            <option value="comparte">Comparte</option>
            <option value="admin_plataforma">Admin plataforma</option>
          </Select>
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          <UserPlus className="h-4 w-4" />
          Associar utilizador
        </Button>
      </div>
    </form>
  );
}
