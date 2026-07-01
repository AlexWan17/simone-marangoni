import Link from "next/link";
import { redirect } from "next/navigation";
import { SocialCardStudio } from "@/components/cards/social-card-studio";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardCardsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  return (
    <main className="luxury-shell min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Módulo criativo
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Gerador de Cards Sociais
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground-soft">
              Ambiente premium para compor artes institucionais em formato de feed ou stories
              com exportação imediata em PNG.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
            >
              Voltar para dashboard
            </Link>
            <Link
              href="/dashboard/artigos"
              className="inline-flex items-center justify-center rounded-full border border-line-impact px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              Gestão de artigos
            </Link>
          </div>
        </div>

        <SocialCardStudio />
      </section>
    </main>
  );
}
