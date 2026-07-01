import Link from "next/link";
import { redirect } from "next/navigation";
import { CategoryManager } from "@/components/articles/category-manager";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

export default async function DashboardArticleCategoriesPage() {
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
    .select("id, name, slug, created_at")
    .eq("tenant_id", defaultTenantId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar as categorias do blog.");
  }

  const categoryRows = categories ?? [];

  return (
    <main className="px-2 py-2 sm:px-4 sm:py-4">
      <section className="panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Estrutura editorial
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Categorias do Blog
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground-soft">
              Gerencie as frentes de atuação do escritório, mantenha o SEO organizado e deixe a
              curadoria editorial pronta para a assistente operar no dia a dia.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/artigos"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
            >
              Voltar para artigos
            </Link>
            <Link
              href="/dashboard/artigos/novo"
              className="inline-flex items-center justify-center rounded-full border border-line-impact px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              Novo artigo
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <CategoryManager categories={categoryRows} />
        </div>
      </section>
    </main>
  );
}
