import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4">
      <section className="w-full max-w-md rounded-lg border border-[var(--line)] bg-[#0c100f] p-6">
        <img src="/assets/fitplanner-mark.png" alt="" className="mb-4 h-14 w-14 rounded-lg border border-[var(--line)] object-cover" />
        <p className="text-sm font-black uppercase tracking-widest text-[var(--neon)]">FitPlanner</p>
        <h1 className="mt-3 text-3xl font-black text-white">Criar conta</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Crie sua conta para sincronizar treino e evolução.</p>
        <div className="mt-6">
          <AuthForm mode="register" />
        </div>
        <Link href="/login" className="mt-5 block text-center text-sm font-bold text-[var(--neon)]">
          Já tenho conta
        </Link>
      </section>
    </main>
  );
}
