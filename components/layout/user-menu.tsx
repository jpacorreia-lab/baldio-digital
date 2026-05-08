"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export function UserMenu({ profile }: { profile: Profile }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-ink">{profile.full_name}</p>
        <p className="text-xs text-stone-500">{profile.role}</p>
      </div>
      <button
        aria-label="Terminar sessão"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-stone-600 hover:border-moss hover:text-moss"
        onClick={signOut}
        type="button"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
