"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSlug } from "@/lib/utils/slug";

export type CreateArticleState = {
  status: "idle" | "error";
  message?: string;
};

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const allowedArticleStatuses = ["draft", "review", "published", "archived"] as const;

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createArticleAction(
  _prevState: CreateArticleState,
  formData: FormData,
): Promise<CreateArticleState> {
  const title = normalize(formData.get("title"));
  const rawSlug = normalize(formData.get("slug"));
  const category = normalize(formData.get("category"));
  const content = normalize(formData.get("content"));
  const status = normalize(formData.get("status"));

  if (!title || !category || !content) {
    return {
      status: "error",
      message: "Preencha título, categoria e conteúdo para salvar o artigo.",
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
  const { data: existingArticle } = await admin
    .from("articles")
    .select("id")
    .eq("tenant_id", defaultTenantId)
    .eq("slug", slug)
    .maybeSingle();

  if (existingArticle) {
    return {
      status: "error",
      message: "Já existe um artigo com este slug. Ajuste o título ou o slug manualmente.",
    };
  }

  const { error } = await admin.from("articles").insert({
    tenant_id: defaultTenantId,
    title,
    slug,
    content,
    category,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    return {
      status: "error",
      message: "Não foi possível salvar o artigo no momento.",
    };
  }

  revalidatePath("/dashboard/artigos");
  revalidatePath("/dashboard/artigos/novo");
  revalidatePath("/artigos");
  if (status === "published") {
    revalidatePath(`/artigos/${slug}`);
  }

  redirect("/dashboard/artigos");
}
