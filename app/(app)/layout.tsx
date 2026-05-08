import { Sidebar } from "@/components/layout/sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { getCurrentProfile } from "@/lib/supabase/auth";

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getCurrentProfile();

  return (
    <div className="flex min-h-screen bg-field">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b border-line bg-field/95 px-8 backdrop-blur">
          <UserMenu profile={profile} />
        </header>
        <main className="px-8 py-7">{children}</main>
      </div>
    </div>
  );
}
