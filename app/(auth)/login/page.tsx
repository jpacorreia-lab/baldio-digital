import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-field px-4">
      <section className="w-full max-w-md rounded-md border border-line bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay">
          Baldio Digital
        </p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Entrar</h1>
        <p className="mb-8 mt-2 text-sm text-stone-600">
          Acesso reservado aos órgãos e compartes autorizados.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
