"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SyncProcessState = {
  status: "idle" | "error" | "success";
  message?: string;
};

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function syncProcessNoticesAction(
  _prevState: SyncProcessState,
  formData: FormData,
): Promise<SyncProcessState> {
  const processId = normalize(formData.get("process_id"));

  if (!processId) {
    return {
      status: "error",
      message: "Processo inválido para sincronização.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return {
      status: "error",
      message: "Sessão inválida. Faça login novamente.",
    };
  }

  revalidatePath("/dashboard/processos");

  return {
    status: "success",
    message:
      "Sincronização preparada. O próximo passo será conectar leitores de e-mail e alertas judiciais.",
  };
}
