"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type UpdateLeadStatusState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const allowedStatuses = ["especulacao", "em_atendimento", "concluido"] as const;
const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateLeadStatus(
  _prevState: UpdateLeadStatusState,
  formData: FormData,
): Promise<UpdateLeadStatusState> {
  const leadId = normalize(formData.get("lead_id"));
  const nextStatus = normalize(formData.get("status"));

  if (!leadId || !allowedStatuses.includes(nextStatus as (typeof allowedStatuses)[number])) {
    return {
      status: "error",
      message: "Status inválido para atualização.",
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

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("leads")
    .update({ status: nextStatus })
    .eq("id", leadId)
    .eq("tenant_id", defaultTenantId);

  if (error) {
    return {
      status: "error",
      message: "Não foi possível atualizar o status deste lead.",
    };
  }

  revalidatePath("/dashboard");

  return {
    status: "success",
  };
}
