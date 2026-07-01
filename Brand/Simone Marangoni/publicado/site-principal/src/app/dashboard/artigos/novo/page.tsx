import Link from "next/link";
import { redirect } from "next/navigation";
import { createArticleAction } from "@/app/actions/create-article";
import { ArticleForm } from "@/components/articles/article-form";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

export default async function NewArticlePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  const admin = getSupabaseAdmin();
  const { data: categories, error } = await admin
    .from("categories")
    .select("id, name, slug")
    .eq("tenant_id", defaultTenantId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar as categorias do módulo de artigos.");
  }

  const categoryRows = categories ?? [];

  return (
    <main className="luxury-shell min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-5xl panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Novo artigo
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Cadastro Editorial
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-soft">
              Estruture artigos com foco em SEO, autoridade e sofisticação institucional.
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
              href="/dashboard/artigos"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
            >
              Voltar para artigos
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <ArticleForm
            action={createArticleAction}
            categories={categoryRows}
            loadingLabel="Salvando artigo..."
            submitLabel="Salvar artigo"
          />
        </div>
      </section>
    </main>
  );
}
