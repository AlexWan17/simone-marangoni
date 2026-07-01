import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function DashboardArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  const admin = getSupabaseAdmin();
  const { data: articles, error } = await admin
    .from("articles")
    .select("id, title, slug, category, status, created_at, published_at")
    .eq("tenant_id", defaultTenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Não foi possível carregar os artigos.");
  }

  const articleRows = articles ?? [];

  return (
    <main className="luxury-shell min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-7xl panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Módulo Editorial
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Gestão de Artigos
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-soft">
              Controle interno do conteúdo estratégico e da presença orgânica da marca.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/artigos/categorias"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
            >
              Gerenciar categorias
            </Link>
            <Link
              href="/artigos"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
            >
              Ver página pública
            </Link>
            <Link
              href="/dashboard/artigos/novo"
              className="inline-flex items-center justify-center rounded-full border border-line-impact px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              Novo artigo
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-border/70">
          <div className="hidden grid-cols-[1.4fr_0.9fr_0.8fr_0.7fr_1fr] gap-4 border-b border-border/70 bg-background-soft/40 px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:grid">
            <span>Título</span>
            <span>Categoria</span>
            <span>Status</span>
            <span>Criado em</span>
            <span>Ações</span>
          </div>

          {articleRows.length === 0 ? (
            <div className="px-5 py-10 text-sm leading-7 text-foreground-soft">
              Nenhum artigo cadastrado até o momento.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {articleRows.map((article) => (
                <article
                  key={article.id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_0.9fr_0.8fr_0.7fr_1fr] lg:items-center"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                      Título
                    </p>
                    <p className="text-sm font-medium text-foreground">{article.title}</p>
                    <p className="mt-1 text-xs text-foreground-soft">/{article.slug}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                      Categoria
                    </p>
                    <p className="text-sm text-foreground-soft">{article.category}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                      Status
                    </p>
                    <span className="inline-flex rounded-full border border-line-impact/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
                      {article.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                      Criado em
                    </p>
                    <p className="text-sm text-foreground-soft">
                      {dateFormatter.format(new Date(article.created_at))}
                    </p>
                  </div>

                  <div className="flex items-center justify-start lg:justify-end">
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <Link
                        href={`/dashboard/artigos/editar/${article.id}`}
                        className="inline-flex items-center justify-center rounded-full border border-line-impact px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
                      >
                        Editar
                      </Link>
                      {article.status === "published" ? (
                        <Link
                          href={`/artigos/${article.slug}`}
                          className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
                        >
                          Abrir artigo
                        </Link>
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-soft">
                          Ainda não publicado
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
