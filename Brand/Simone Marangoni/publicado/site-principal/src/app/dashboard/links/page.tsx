import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const externalLinks = [
  {
    title: "JusBrasil",
    description: "Consulta pública, monitoramento e apoio de pesquisa jurisprudencial.",
    href: "https://www.jusbrasil.com.br/",
  },
  {
    title: "e-SAJ",
    description: "Acesso direto ao ecossistema de acompanhamento processual do e-SAJ.",
    href: "https://esaj.tjsp.jus.br/",
  },
  {
    title: "e-Proc",
    description: "Entrada rápida em ambientes processuais baseados no e-Proc.",
    href: "https://eproc.jfrs.jus.br/eprocV2/",
  },
] as const;

export default async function DashboardLinksPage() {
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
        <div className="border-b border-border/70 pb-6">
          <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
            Painel de favoritos
          </p>
          <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
            Links Úteis
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground-soft">
            Atalhos externos para reduzir fricção operacional e acelerar o fluxo jurídico do dia
            a dia.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {externalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="panel-sheen rounded-[1.6rem] p-6 transition hover:border-line-impact/70"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-foreground-soft">
                Acesso externo
              </p>
              <h2 className="mt-4 font-display text-3xl text-foreground">{link.title}</h2>
              <p className="mt-4 text-sm leading-7 text-foreground-soft">{link.description}</p>
              <span className="mt-8 inline-flex rounded-full border border-line-impact px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-foreground">
                Abrir link
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
