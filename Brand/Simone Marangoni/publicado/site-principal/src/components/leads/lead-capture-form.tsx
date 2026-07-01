"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createLead } from "@/app/actions/create-lead";

function formatWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (rest.length <= 4) {
    return `(${ddd}) ${rest}`;
  }

  if (rest.length <= 8) {
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm uppercase tracking-[0.24em] transition",
        pending
          ? "border-accent bg-accent/15 text-foreground animate-pulse"
          : "border-line-impact text-foreground hover:border-accent-soft hover:bg-accent/10",
      ].join(" ")}
    >
      {pending ? "Enviando..." : "Enviar solicitação"}
    </button>
  );
}

type LeadCaptureFormProps = {
  initialMessage?: string;
  caseType?: string;
};

export function LeadCaptureForm({
  initialMessage = "",
  caseType,
}: LeadCaptureFormProps = {}) {
  const [phone, setPhone] = useState("");
  const [state, formAction] = useActionState(createLead, { status: "idle" });

  const isSuccess = state.status === "success";
  const isError = state.status === "error";

  const message = useMemo(() => {
    if (state.status === "success" || state.status === "error") return state.message;
    return "";
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {caseType ? <input type="hidden" name="case_type" value={caseType} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Nome completo
          </span>
          <input
            name="full_name"
            required
            disabled={isSuccess}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
            placeholder="Seu nome completo"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            E-mail profissional
          </span>
          <input
            type="email"
            name="email"
            required
            disabled={isSuccess}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
            placeholder="nome@empresa.com"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            WhatsApp
          </span>
          <input
            name="phone"
            required
            disabled={isSuccess}
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(formatWhatsApp(event.target.value))}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
            placeholder="(11) 99999-9999"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Breve resumo do desafio jurídico
          </span>
          <textarea
            name="message"
            required
            disabled={isSuccess}
            rows={5}
            defaultValue={initialMessage}
            className="w-full resize-none rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-60"
            placeholder="Descreva em poucas linhas o contexto e o objetivo."
          />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-border bg-background-soft/40 p-4">
        <input
          type="checkbox"
          name="lgpd_consent"
          required
          disabled={isSuccess}
          className="mt-1 h-4 w-4 rounded border border-line-impact bg-background-soft accent-[color:var(--accent)] disabled:opacity-60"
        />
        <span className="text-sm leading-7 text-foreground-soft">
          Autorizo o tratamento dos meus dados para contato e triagem inicial, conforme a política de
          privacidade (LGPD).
        </span>
      </label>

      {message ? (
        <div
          className={[
            "rounded-2xl border p-4 text-sm leading-7",
            isSuccess
              ? "border-accent/50 bg-accent/10 text-foreground"
              : "border-line-impact/60 bg-background-soft/50 text-foreground-soft",
          ].join(" ")}
        >
          {message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        {isError ? (
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Revise os dados e tente novamente.
          </span>
        ) : (
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Resposta em breve.
          </span>
        )}
      </div>
    </form>
  );
}
