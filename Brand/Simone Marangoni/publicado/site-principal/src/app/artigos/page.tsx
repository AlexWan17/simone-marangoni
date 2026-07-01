import Link from "next/link";
import { PublicSiteHeader } from "@/components/layout/public-site-header";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
});

export default async function ArticlesPage() {
  const admin = getSupabaseAdmin();
  const [{ data: articles, error: articlesError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      admin
        .from("articles")
        .select("id, title, slug, category, content, published_at")
        .eq("tenant_id", defaultTenantId)
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      admin
        .from("categories")
        .select("id, name, slug")
        .eq("tenant_id", defaultTenantId)
        .order("name", { ascending: true }),
    ]);

  if (articlesError || categoriesError) {
    throw new Error("Não foi possível carregar a vitrine pública de artigos.");
  }

  const articleRows = articles ?? [];
  const categoryRows = categories ?? [];

  return (
    <main className="luxury-shell min-h-screen px-6 py-8 sm:px-10 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <PublicSiteHeader
          badges={["Blog Jurídico", "SEO Orgânico", "Orientações Recentes"]}
        />

        <header className="mt-8 flex flex-col gap-8 border-b border-border/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Artigos e insight jurídico
            </p>
            <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
              Conteúdo estratégico para autoridade orgânica.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-foreground-soft">
              Análises com foco em Direito Digital, Franchising e temas que fortalecem o
              posicionamento institucional da marca.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryRows.map((category) => (
              <span
                key={category.id}
                className="rounded-full border border-line-impact/60 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-foreground-soft"
              >
                {category.name}
              </span>
            ))}
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {articleRows.length === 0 ? (
            <div className="panel-sheen rounded-[1.5rem] p-6 text-sm leading-7 text-foreground-soft">
              Ainda não existem artigos publicados.
            </div>
          ) : (
            articleRows.map((article) => (
              <article key={article.id} className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                  {article.category}
                </p>
                <h2 className="mt-4 font-display text-3xl text-foreground">
                  {article.title}
                </h2>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-foreground-soft">
                  {article.published_at
                    ? dateFormatter.format(new Date(article.published_at))
                    : "Publicação em preparação"}
                </p>
                <p className="mt-6 text-sm leading-8 text-foreground-soft">
                  {article.content.slice(0, 220)}
                  {article.content.length > 220 ? "..." : ""}
                </p>
                <Link
                  href={`/artigos/${article.slug}`}
                  className="mt-8 inline-flex rounded-full border border-line-impact px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
                >
                  Ler artigo
                </Link>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
