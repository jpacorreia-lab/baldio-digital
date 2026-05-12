"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  CircleCheckBig,
  FileArchive,
  FileText,
  Gavel,
  Home,
  Landmark,
  Settings,
  ShieldCheck,
  Users,
  Vote
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/compartes", label: "Compartes", icon: Users },
  { href: "/cadernos-eleitorais", label: "Cadernos eleitorais", icon: Vote },
  { href: "/assembleias", label: "Assembleias", icon: Landmark },
  { href: "/reunioes-executivo", label: "Reuniões executivo", icon: CircleCheckBig },
  { href: "/atas", label: "Atas", icon: BookOpen },
  { href: "#", label: "Deliberações", icon: Gavel, disabled: true },
  { href: "#", label: "Pedidos", icon: ClipboardList, disabled: true },
  { href: "#", label: "Pastoreio", icon: ShieldCheck, disabled: true },
  { href: "#", label: "Documentos", icon: FileArchive, disabled: true },
  { href: "#", label: "Contratos", icon: FileText, disabled: true },
  { href: "#", label: "Configurações", icon: Settings, disabled: true }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 shrink-0 flex-col border-r border-line bg-white">
      <div className="border-b border-line px-6 py-5">
        <p className="text-lg font-bold text-ink">Baldio Digital</p>
        <p className="mt-1 text-sm text-stone-500">Gestão multi-baldio</p>
      </div>
      <nav className="grid gap-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href) && item.href !== "#";
          return (
            <Link
              aria-disabled={item.disabled}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
                active && "bg-moss text-white",
                !active && !item.disabled && "text-stone-700 hover:bg-field",
                item.disabled && "cursor-not-allowed text-stone-400"
              )}
              href={item.href}
              key={item.label}
              onClick={(event) => {
                if (item.disabled) event.preventDefault();
              }}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
