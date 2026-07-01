"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSlug } from "@/lib/utils/slug";

export type UpdateArticleState = {
  status: "idle" | "error";
  message?: string;
};

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const allowedArticleStatuses = ["draft", "review", "published", "archived"] as const;

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateArticleAction(
  _prevState: UpdateArticleState,
  formData: FormData,
): Promise<UpdateArticleState> {
  const articleId = normalize(formData.get("article_id"));
  const title = normalize(formData.get("title"));
  const rawSlug = normalize(formData.get("slug"));
  const category = normalize(formData.get("category"));
  const content = normalize(formData.get("content"));
  const status = normalize(formData.get("status"));

  if (!articleId || !title || !category || !content) {
    return {
      status: "error",
      message: "Preencha título, categoria e conteúdo para atualizar o artigo.",
    };
  }

  if (!allowedArticleStatuses.includes(status as (typeof allowedArticleStatuses)[number])) {
    return {
      status: "error",
      message: "Status inválido para publicação.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return {
      status: "error",
      message: "Sessão inválida. Faça login novamente.",
    };
  }

  const slug = createSlug(rawSlug || title);
  if (!slug) {
    return {
      status: "error",
      message: "Não foi possível gerar um slug válido para este artigo.",
    };
  }

  const admin = getSupabaseAdmin();
  const { data: currentArticle, error: currentArticleError } = await admin
    .from("articles")
    .select("id, slug, published_at")
    .eq("tenant_id", defaultTenantId)
    .eq("id", articleId)
    .maybeSingle();

  if (currentArticleError || !currentArticle) {
    return {
      status: "error",
      message: "Não foi possível localizar o artigo para edição.",
    };
  }

  const { data: existingArticle } = await admin
    .from("articles")
    .select("id")
    .eq("tenant_id", defaultTenantId)
    .eq("slug", slug)
    .neq("id", articleId)
    .maybeSingle();

  if (existingArticle) {
    return {
      status: "error",
      message: "Já existe outro artigo com este slug. Ajuste o título ou o slug manualmente.",
    };
  }

  const publishedAt =
    status === "published" ? currentArticle.published_at ?? new Date().toISOString() : null;

  const { error } = await admin
    .from("articles")
    .update({
      title,
      slug,
      category,
      content,
      status,
      published_at: publishedAt,
    })
    .eq("tenant_id", defaultTenantId)
    .eq("id", articleId);

  if (error) {
    return {
      status: "error",
      message: "Não foi possível salvar as alterações do artigo no momento.",
    };
  }

  revalidatePath("/dashboard/artigos");
  revalidatePath(`/dashboard/artigos/editar/${articleId}`);
  revalidatePath("/artigos");
  revalidatePath(`/artigos/${currentArticle.slug}`);
  revalidatePath(`/artigos/${slug}`);

  redirect("/dashboard/artigos");
}
