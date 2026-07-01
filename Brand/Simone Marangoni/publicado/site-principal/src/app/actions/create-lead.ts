"use server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createLead(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = normalizeText(formData.get("full_name"));
  const email = normalizeText(formData.get("email"));
  const phone = normalizeText(formData.get("phone"));
  const caseType = normalizeText(formData.get("case_type"));
  const message = normalizeText(formData.get("message"));
  const consent = formData.get("lgpd_consent") === "on";

  if (!fullName || !email || !phone || !message) {
    return {
      status: "error",
      message: "Preencha todos os campos obrigatórios.",
    };
  }

  if (!consent) {
    return {
      status: "error",
      message: "Para prosseguir, é necessário aceitar o consentimento de privacidade (LGPD).",
    };
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("leads").insert({
    tenant_id: defaultTenantId,
    full_name: fullName,
    email,
    phone,
    case_type: caseType || null,
    message,
    status: "novo",
    lgpd_consent: true,
  });

  if (error) {
    return {
      status: "error",
      message: "Não foi possível enviar sua solicitação no momento. Tente novamente em instantes.",
    };
  }

  return {
    status: "success",
    message:
      "Solicitação recebida. Nossa equipe jurídica entrará em contato em breve para o agendamento da sua consulta estratégica.",
  };
}
