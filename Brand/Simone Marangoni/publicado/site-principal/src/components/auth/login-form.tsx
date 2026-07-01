"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { LoginActionState } from "@/app/actions/login";
import { loginAction } from "@/app/actions/login";

type LoginFormProps = {
  next?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex w-full items-center justify-center rounded-full border px-6 py-3 text-sm uppercase tracking-[0.24em] transition",
        pending
          ? "border-accent bg-accent/15 text-foreground animate-pulse"
          : "border-line-impact text-foreground hover:border-accent-soft hover:bg-accent/10",
      ].join(" ")}
    >
      {pending ? "Validando acesso..." : "Acessar Painel"}
    </button>
  );
}

const initialState: LoginActionState = {
  status: "idle",
};

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={next ?? "/dashboard"} />

      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
          E-mail
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          placeholder="seuemail@dominio.com"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
          Senha
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          placeholder="Sua senha de acesso"
        />
      </label>

      {state.status === "error" ? (
        <div className="rounded-2xl border border-line-impact/60 bg-background-soft/50 p-4 text-sm leading-7 text-foreground-soft">
          {state.message}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}
