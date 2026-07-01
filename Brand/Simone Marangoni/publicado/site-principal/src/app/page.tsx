import Link from "next/link";
import { PublicSiteHeader } from "@/components/layout/public-site-header";
import { practiceAreas } from "@/lib/content/practice-areas";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSlug } from "@/lib/utils/slug";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const articleDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
});

const corporateHighlights = [
  "Governança contratual, expansão e franchising com leitura de risco empresarial.",
  "Atuação preventiva para reduzir passivos e sustentar decisões executivas relevantes.",
  "Suporte jurídico para crescimento com clareza, velocidade e blindagem estratégica.",
];

const familyHighlights = [
  "Atendimento acolhedor para inventários, guarda, partilhas e reorganização familiar.",
  "Defesa firme para direitos ligados a TEA, TDAH, TOD, saúde e proteção social.",
  "Orientação jurídica clara para famílias que precisam de resposta sem se sentirem perdidas.",
];

const officialContactUrl = "https://cartao.simonemarangoni.adv.br";

export default async function Home() {
  const admin = getSupabaseAdmin();
  const { data: recentArticles } = await admin
    .from("articles")
    .select("id, title, slug, category, content, published_at")
    .eq("tenant_id", defaultTenantId)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  const articleRows = recentArticles ?? [];

  return (
    <main className="luxury-shell min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <PublicSiteHeader
          badges={[
            "Franchising",
            "Corporativo",
            "Família & Sucessões",
            "Saúde & Neurodivergências",
          ]}
        />

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.4fr_0.9fr] lg:py-20">
          <section className="max-w-3xl">
            <div className="mb-8 flex items-center gap-4">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <div className="metal-line flex-1" />
            </div>

            <p className="mb-6 text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Estratégia jurídica com acolhimento, clareza e autoridade
            </p>

            <h1 className="font-display text-5xl leading-[0.92] text-foreground sm:text-6xl lg:text-8xl">
              Presença jurídica
              <span className="block text-foreground-soft">
                para empresas, famílias e pacientes que precisam de direção segura.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-foreground-soft sm:text-lg">
              Atuação boutique com leitura técnica profunda, comunicação clara e estratégia
              personalizada. O escritório une rigor empresarial e sensibilidade humana para
              orientar decisões relevantes, proteger direitos e construir caminhos jurídicos
              consistentes.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/analise-estrategica"
                className="metallic-cta inline-flex items-center justify-center rounded-full px-6 py-3 text-sm uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
              >
                Atendimento Especializado
              </Link>
              <Link
                href="#areas-de-atuacao"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
              >
                Ver áreas de atuação
              </Link>
            </div>
          </section>

          <aside className="panel-sheen rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-foreground-soft">
              Como o escritório se posiciona
            </p>
            <div className="my-6 metal-line w-full" />

            <div className="space-y-5">
              <div>
                <p className="font-display text-3xl text-foreground">01</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-foreground-soft">
                  Atenção jurídica premium sem linguagem inacessível
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-foreground">02</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-foreground-soft">
                  Estratégia preventiva e contenciosa para cenários sensíveis
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-foreground">03</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-foreground-soft">
                  Acolhimento real para famílias, pacientes e pessoas vulneráveis
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section
          id="areas-de-atuacao"
          className="border-t border-border/70 py-10 sm:py-12"
        >
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Sete frentes de atuação
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Consultoria jurídica organizada para quem empreende, protege a família ou luta por
              direitos essenciais.
            </h2>
            <p className="mt-6 text-base leading-8 text-foreground-soft">
              A navegação foi desenhada para que cada pessoa identifique rapidamente seu contexto,
              compreenda o caminho jurídico e encontre um atendimento humano, firme e estratégico.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {practiceAreas.map((item) => (
              <article key={item.title} className="panel-sheen rounded-[1.4rem] p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                  {item.audience}
                </p>
                <p className="mt-3 font-display text-xl text-foreground">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-foreground-soft">{item.summary}</p>
                <Link
                  href={`/analise-estrategica?area=${createSlug(item.title)}`}
                  className="metallic-cta mt-5 inline-flex rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
                >
                  Atendimento Especializado
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 border-t border-border/70 py-10 sm:py-12 lg:grid-cols-2">
          <article className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Para empresas e operações em crescimento
            </p>
            <h2 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Leitura de risco com foco em expansão, governança e sustentabilidade jurídica.
            </h2>
            <div className="mt-6 metal-line w-full max-w-md" />
            <div className="mt-6 space-y-4">
              {corporateHighlights.map((item) => (
                <p key={item} className="text-sm leading-7 text-foreground-soft">
                  {item}
                </p>
              ))}
            </div>
            <Link
              href={`/analise-estrategica?area=${createSlug("Advocacia Corporativa & Riscos Empresariais")}`}
              className="metallic-cta mt-6 inline-flex rounded-full px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              Falar sobre meu negócio
            </Link>
          </article>

          <article className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Para famílias, pacientes e segurados
            </p>
            <h2 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Atendimento claro e acolhedor para momentos que exigem cuidado, firmeza e proteção.
            </h2>
            <div className="mt-6 metal-line w-full max-w-md" />
            <div className="mt-6 space-y-4">
              {familyHighlights.map((item) => (
                <p key={item} className="text-sm leading-7 text-foreground-soft">
                  {item}
                </p>
              ))}
            </div>
            <Link
              href={`/analise-estrategica?area=${createSlug("Direito de Família & Sucessões")}`}
              className="metallic-cta mt-6 inline-flex rounded-full px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              Buscar acolhimento jurídico
            </Link>
          </article>
        </section>

        <section
          id="analise-estrategica"
          className="border-t border-border/70 py-10 sm:py-12"
        >
          <div className="grid gap-6">
            <div className="panel-sheen metallic-border rounded-[1.8rem] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
                Atendimento direto
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Fale diretamente com a Dra. Simone ou com a equipe do escritório.
              </h2>
              <div className="mt-6 metal-line w-full max-w-md" />
              <p className="mt-6 max-w-xl text-base leading-8 text-foreground-soft">
                Para reduzir fricção, o primeiro contato agora acontece pelo canal oficial do
                escritório. Assim, o cliente escolhe o atendimento com mais rapidez e sem
                preencher formulários longos logo na primeira visita.
              </p>
              <a
                href={officialContactUrl}
                target="_blank"
                rel="noreferrer"
                className="metallic-cta mt-8 inline-flex rounded-full px-6 py-3 text-sm uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
              >
                Falar com a Dra. Simone
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-border/70 py-10 sm:py-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
                Artigos e Orientações Recentes
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Conteúdo jurídico para informar, orientar e fortalecer decisões com segurança.
              </h2>
              <p className="mt-6 text-base leading-8 text-foreground-soft">
                Publicações recentes com foco em prevenção, posicionamento estratégico e educação
                jurídica acessível para clientes e parceiros.
              </p>
            </div>

            <Link
              href="/artigos"
              className="metallic-cta inline-flex items-center justify-center rounded-full px-6 py-3 text-sm uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              Ver todos os artigos
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {articleRows.length === 0 ? (
              <div className="panel-sheen rounded-[1.5rem] p-6 text-sm leading-7 text-foreground-soft lg:col-span-3">
                Os primeiros artigos publicados aparecerão aqui assim que a curadoria editorial for
                disponibilizada no blog.
              </div>
            ) : (
              articleRows.map((article) => (
                <article key={article.id} className="panel-sheen rounded-[1.6rem] p-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                    {article.category}
                  </p>
                  <h3 className="mt-4 font-display text-3xl text-foreground">{article.title}</h3>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-foreground-soft">
                    {article.published_at
                      ? articleDateFormatter.format(new Date(article.published_at))
                      : "Publicação recente"}
                  </p>
                  <p className="mt-5 text-sm leading-8 text-foreground-soft">
                    {article.content.slice(0, 180)}
                    {article.content.length > 180 ? "..." : ""}
                  </p>
                  <Link
                    href={`/artigos/${article.slug}`}
                    className="mt-8 inline-flex rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
                  >
                    Ler orientação completa
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>

        <footer
          className="flex flex-col gap-4 border-t border-border/70 py-6 text-xs uppercase tracking-[0.28em] text-foreground-soft md:flex-row md:items-center md:justify-between"
        >
          <span>Simone Marangoni Advocacia Boutique</span>
          <span>Atuação estratégica para empresas, famílias, pacientes e segurados</span>
        </footer>
      </section>
    </main>
  );
}
