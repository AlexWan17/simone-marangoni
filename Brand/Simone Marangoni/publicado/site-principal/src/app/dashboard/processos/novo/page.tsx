import Link from "next/link";
import { redirect } from "next/navigation";
import { ProcessForm } from "@/components/processos/process-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewProcessPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  return (
    <main className="px-2 py-2 sm:px-4 sm:py-4">
      <section className="panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Novo processo
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Cadastro Operacional de Caso
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-soft">
              Registre um novo caso no painel com os dados mínimos para triagem, acompanhamento
              processual e geração futura de ficha de mesa.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/processos"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
            >
              Voltar para processos
            </Link>
          </div>
        </div>

        <div className="mt-8 max-w-4xl">
          <ProcessForm />
        </div>
      </section>
    </main>
  );
}
