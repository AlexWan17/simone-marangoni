"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateProcessState = {
  status: "idle" | "error";
  message?: string;
};

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const allowedOrigins = ["e-SAJ", "e-Proc", "PJe", "Outro"] as const;
const allowedStatuses = ["ativo", "arquivado"] as const;

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createProcessAction(
  _prevState: CreateProcessState,
  formData: FormData,
): Promise<CreateProcessState> {
  const numeroProcesso = normalize(formData.get("numero_processo"));
  const nomeCliente = normalize(formData.get("nome_cliente"));
  const pastaInterna = normalize(formData.get("pasta_interna"));
  const sistemaOrigem = normalize(formData.get("sistema_origem"));
  const status = normalize(formData.get("status"));
  const resumoAndamento = normalize(formData.get("resumo_andamento"));

  if (!numeroProcesso || !nomeCliente || !sistemaOrigem || !status) {
    return {
      status: "error",
      message: "Preencha número, cliente, origem e status para salvar o processo.",
    };
  }

  if (!allowedOrigins.includes(sistemaOrigem as (typeof allowedOrigins)[number])) {
    return {
      status: "error",
      message: "Origem inválida para este processo.",
    };
  }

  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    return {
      status: "error",
      message: "Status inválido para este processo.",
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
  const { error } = await admin.from("processos").insert({
    tenant_id: defaultTenantId,
    numero_processo: numeroProcesso,
    nome_cliente: nomeCliente,
    pasta_interna: pastaInterna || null,
    sistema_origem: sistemaOrigem,
    status,
    resumo_andamento: resumoAndamento || null,
  });

  if (error) {
    const duplicateProcess =
      error.code === "23505" || error.message.toLowerCase().includes("processos_tenant_numero_idx");

    return {
      status: "error",
      message: duplicateProcess
        ? "Já existe um processo com esse número cadastrado para este tenant."
        : "Não foi possível salvar o processo no momento.",
    };
  }

  revalidatePath("/dashboard/processos");
  redirect("/dashboard/processos");
}
