"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginActionState = {
  status: "idle" | "error";
  message?: string;
};

function normalize(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getPassword(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = normalize(formData.get("email"));
  const password = getPassword(formData.get("password"));

  if (!email || !password) {
    return {
      status: "error",
      message: "Informe e-mail e senha para acessar o painel.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const rawNextPath = normalize(formData.get("next"));
  const nextPath =
    rawNextPath.startsWith("/") && !rawNextPath.startsWith("//")
      ? rawNextPath
      : "/dashboard";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Credenciais inválidas. Revise e-mail e senha para continuar.",
    };
  }

  redirect(nextPath);
}
