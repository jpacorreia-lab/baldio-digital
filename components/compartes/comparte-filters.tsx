import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { estadoOptions } from "@/components/compartes/status-badge";

export function ComparteFilters({
  query,
  estado
}: {
  query?: string;
  estado?: string;
}) {
  return (
    <form className="flex flex-col gap-3 rounded-md border border-line bg-white p-4 shadow-soft md:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-stone-400" />
        <Input
          className="pl-9"
          defaultValue={query}
          name="q"
          placeholder="Pesquisar por nome, NIF, email ou localidade"
        />
      </div>
      <Select className="md:w-52" defaultValue={estado ?? ""} name="estado">
        <option value="">Todos os estados</option>
        {estadoOptions.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Button type="submit">Pesquisar</Button>
    </form>
  );
}
