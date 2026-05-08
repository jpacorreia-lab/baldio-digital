import { Users, UserCheck, UserRoundX } from "lucide-react";
import { UserAdminForm } from "@/components/auth/user-admin-form";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/auth";
import type { Profile } from "@/lib/types";

export default async function DashboardPage() {
  const { profile } = await getCurrentProfile();
  const supabase = await createClient();
  const { count: total } = await supabase
    .from("compartes")
    .select("*", { count: "exact", head: true });
  const { count: ativos } = await supabase
    .from("compartes")
    .select("*", { count: "exact", head: true })
    .eq("estado", "ativo");
  const { count: pendentes } = await supabase
    .from("compartes")
    .select("*", { count: "exact", head: true })
    .eq("estado", "pendente");
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .order("role", { ascending: true });

  const cards = [
    { label: "Compartes", value: total ?? 0, icon: Users },
    { label: "Ativos", value: ativos ?? 0, icon: UserCheck },
    { label: "Pendentes", value: pendentes ?? 0, icon: UserRoundX }
  ];

  return (
    <div className="grid gap-7">
      <div>
        <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
        <p className="mt-2 text-stone-600">
          Visão inicial da gestão administrativa do baldio.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              className="rounded-md border border-line bg-white p-5 shadow-soft"
              key={card.label}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-stone-600">
                  {card.label}
                </p>
                <Icon className="h-5 w-5 text-clay" />
              </div>
              <p className="mt-4 text-3xl font-bold text-ink">{card.value}</p>
            </article>
          );
        })}
      </section>
      <section className="rounded-md border border-line bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">MVP ativo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          Esta primeira versão já separa dados por organização através das
          políticas do Supabase e concentra a gestão inicial no módulo de
          compartes.
        </p>
      </section>

      <section className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-soft">
        <div>
          <h2 className="text-lg font-semibold text-ink">Utilizadores</h2>
          <p className="mt-2 text-sm text-stone-600">
            Associa utilizadores já criados no Supabase Auth à organização e
            define a função de cada um.
          </p>
        </div>
        <UserAdminForm />
        <div className="overflow-hidden rounded-md border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-field text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Função</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {((users ?? []) as Profile[]).map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-ink">
                    {user.full_name}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {user.email ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{user.role}</td>
                </tr>
              ))}
              {(users ?? []).length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-stone-500" colSpan={3}>
                    Sem utilizadores associados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
