"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createProcessAction,
  type CreateProcessState,
} from "@/app/actions/create-process";

const originOptions = ["e-SAJ", "e-Proc", "PJe", "Outro"] as const;
const statusOptions = [
  { label: "Ativo", value: "ativo" },
  { label: "Arquivado", value: "arquivado" },
] as const;

const initialState: CreateProcessState = {
  status: "idle",
};

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
      {pending ? "Salvando processo..." : "Salvar processo"}
    </button>
  );
}

export function ProcessForm() {
  const [state, formAction] = useActionState(createProcessAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Número do processo
          </span>
          <input
            name="numero_processo"
            required
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="0000000-00.0000.0.00.0000"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Cliente
          </span>
          <input
            name="nome_cliente"
            required
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="Nome completo do cliente"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Pasta interna
          </span>
          <input
            name="pasta_interna"
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="Código ou referência interna"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Origem
          </span>
          <select
            name="sistema_origem"
            defaultValue="e-SAJ"
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          >
            {originOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Status
          </span>
          <select
            name="status"
            defaultValue="ativo"
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
          Resumo do andamento
        </span>
        <textarea
          name="resumo_andamento"
          rows={8}
          className="w-full resize-y rounded-[1.5rem] border border-line-impact/60 bg-background-soft/70 px-4 py-4 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          placeholder="Registre o contexto principal, o momento processual e os pontos de atenção."
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
