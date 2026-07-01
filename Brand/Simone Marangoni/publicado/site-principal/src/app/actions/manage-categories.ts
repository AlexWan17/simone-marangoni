"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { officialCategoryNames } from "@/lib/content/practice-areas";
import { createSlug } from "@/lib/utils/slug";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

export type CategoryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialState: CategoryActionState = {
  status: "idle",
};

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function ensureAuthenticated() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return null;
  }

  return user;
}

export async function saveCategoryAction(
  _prevState: CategoryActionState = initialState,
  formData: FormData,
): Promise<CategoryActionState> {
  void _prevState;
  const user = await ensureAuthenticated();

  if (!user) {
    return {
      status: "error",
      message: "Sessão inválida. Entre novamente para gerenciar categorias.",
    };
  }

  const categoryId = normalize(formData.get("category_id"));
  const name = normalize(formData.get("name"));
  const rawSlug = normalize(formData.get("slug"));
  const slug = createSlug(rawSlug || name);

  if (!name || !slug) {
    return {
      status: "error",
      message: "Informe um nome válido para a categoria.",
    };
  }

  const admin = getSupabaseAdmin();

  if (categoryId) {
    const { error } = await admin
      .from("categories")
      .update({ name, slug })
      .eq("id", categoryId)
      .eq("tenant_id", defaultTenantId);

    if (error) {
      return {
        status: "error",
        message: "Não foi possível atualizar a categoria.",
      };
    }
  } else {
    const { error } = await admin.from("categories").insert({
      tenant_id: defaultTenantId,
      name,
      slug,
    });

    if (error) {
      return {
        status: "error",
        message: "Não foi possível cadastrar a categoria.",
      };
    }
  }

  revalidatePath("/dashboard/artigos");
  revalidatePath("/dashboard/artigos/novo");
  revalidatePath("/dashboard/artigos/categorias");
  revalidatePath("/artigos");

  return {
    status: "success",
    message: categoryId
      ? "Categoria atualizada com sucesso."
      : "Categoria criada com sucesso.",
  };
}

export async function seedOfficialCategoriesAction(): Promise<CategoryActionState> {
  const user = await ensureAuthenticated();

  if (!user) {
    return {
      status: "error",
      message: "Sessão inválida. Entre novamente para sincronizar categorias.",
    };
  }

  const admin = getSupabaseAdmin();
  const payload = officialCategoryNames.map((name) => ({
    tenant_id: defaultTenantId,
    name,
    slug: createSlug(name),
  }));

  const { error } = await admin.from("categories").upsert(payload, {
    onConflict: "tenant_id,slug",
    ignoreDuplicates: false,
  });

  if (error) {
    return {
      status: "error",
      message: "Não foi possível sincronizar as categorias oficiais.",
    };
  }

  revalidatePath("/dashboard/artigos");
  revalidatePath("/dashboard/artigos/novo");
  revalidatePath("/dashboard/artigos/categorias");
  revalidatePath("/artigos");

  return {
    status: "success",
    message: "Categorias oficiais sincronizadas com sucesso.",
  };
}
