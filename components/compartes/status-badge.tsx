import type { ComparteEstado } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<ComparteEstado, string> = {
  pendente: "Pendente",
  ativo: "Ativo",
  suspenso: "Suspenso",
  falecido: "Falecido",
  removido: "Removido"
};

const colors: Record<ComparteEstado, string> = {
  pendente: "bg-amber-100 text-amber-800",
  ativo: "bg-emerald-100 text-emerald-800",
  suspenso: "bg-orange-100 text-orange-800",
  falecido: "bg-stone-200 text-stone-700",
  removido: "bg-red-100 text-red-800"
};

export function StatusBadge({ estado }: { estado: ComparteEstado }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        colors[estado]
      )}
    >
      {labels[estado]}
    </span>
  );
}

export const estadoOptions = Object.entries(labels);
