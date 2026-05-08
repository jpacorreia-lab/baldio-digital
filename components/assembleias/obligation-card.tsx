import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ObligationCard({
  title,
  description,
  status
}: {
  title: string;
  description: string;
  status: "ok" | "warning" | "late";
}) {
  const Icon =
    status === "ok" ? CheckCircle2 : status === "warning" ? Clock : AlertTriangle;

  return (
    <article
      className={cn(
        "rounded-md border bg-white p-4 shadow-soft",
        status === "ok" && "border-emerald-200",
        status === "warning" && "border-amber-200",
        status === "late" && "border-red-200"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5",
            status === "ok" && "text-emerald-700",
            status === "warning" && "text-amber-700",
            status === "late" && "text-red-700"
          )}
        />
        <div>
          <p className="font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
        </div>
      </div>
    </article>
  );
}
