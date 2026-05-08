import Link from "next/link";
import { Edit, Eye } from "lucide-react";
import { StatusBadge } from "@/components/compartes/status-badge";
import type { Comparte } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function CompartesTable({ compartes }: { compartes: Comparte[] }) {
  if (compartes.length === 0) {
    return (
      <div className="rounded-md border border-line bg-white p-10 text-center shadow-soft">
        <p className="font-semibold text-ink">Sem compartes encontrados</p>
        <p className="mt-2 text-sm text-stone-600">
          Ajusta a pesquisa ou cria o primeiro registo.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-white shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-field text-xs uppercase text-stone-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Nome</th>
            <th className="px-4 py-3 font-semibold">Cartão cidadão</th>
            <th className="px-4 py-3 font-semibold">Localidade</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Admissão</th>
            <th className="px-4 py-3 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {compartes.map((comparte) => (
            <tr key={comparte.id} className="hover:bg-field/60">
              <td className="px-4 py-3 font-medium text-ink">{comparte.nome}</td>
              <td className="px-4 py-3 text-stone-600">
                {comparte.cartao_cidadao ?? "-"}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {comparte.localidade ?? "-"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge estado={comparte.estado} />
              </td>
              <td className="px-4 py-3 text-stone-600">
                {formatDate(comparte.data_admissao)}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    aria-label="Ver ficha"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-stone-600 hover:border-moss hover:text-moss"
                    href={`/compartes/${comparte.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    aria-label="Editar"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-stone-600 hover:border-moss hover:text-moss"
                    href={`/compartes/${comparte.id}/editar`}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
