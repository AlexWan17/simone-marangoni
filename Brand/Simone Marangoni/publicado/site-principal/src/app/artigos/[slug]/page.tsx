import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSiteHeader } from "@/components/layout/public-site-header";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPublishedArticle(slug: string) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("articles")
    .select("id, title, slug, content, category, published_at")
    .eq("tenant_id", defaultTenantId)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado | Simone Marangoni",
    };
  }

  return {
    title: `${article.title} | Simone Marangoni`,
    description: article.content.slice(0, 155),
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="luxury-shell min-h-screen px-6 py-8 sm:px-10 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <PublicSiteHeader badges={["Artigo", article.category]} />

        <header className="mt-8 border-b border-border/70 pb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              {article.category}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-tight text-foreground sm:text-6xl">
              {article.title}
            </h1>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-foreground-soft">
              Conteúdo jurídico com foco em autoridade e posicionamento orgânico.
            </p>
          </div>
        </header>

        <div className="mt-10 panel-sheen rounded-[2rem] p-6 sm:p-8">
          <div className="prose prose-invert max-w-none text-base leading-8 text-foreground-soft">
            <div className="whitespace-pre-wrap">{article.content}</div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/artigos"
            className="inline-flex rounded-full border border-line-impact px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
          >
            Voltar para artigos
          </Link>
        </div>
      </article>
    </main>
  );
}
