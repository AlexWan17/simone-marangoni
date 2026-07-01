"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateLeadStatus,
  type UpdateLeadStatusState,
} from "@/app/actions/update-lead-status";

type LeadStatusActionsProps = {
  leadId: string;
  currentStatus: string;
};

type StatusOption = {
  label: string;
  value: "especulacao" | "em_atendimento" | "concluido";
};

const statusOptions: StatusOption[] = [
  { label: "Especulação", value: "especulacao" },
  { label: "Em atendimento", value: "em_atendimento" },
  { label: "Concluído", value: "concluido" },
];

function StatusButton({ option }: { option: StatusOption }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="status"
      value={option.value}
      disabled={pending}
      className={[
        "rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition",
        pending
          ? "border-accent bg-accent/15 text-foreground animate-pulse"
          : "border-line-impact/60 text-foreground-soft hover:border-accent hover:bg-accent/10 hover:text-foreground",
      ].join(" ")}
    >
      {option.label}
    </button>
  );
}

const initialState: UpdateLeadStatusState = {
  status: "idle",
};

export function LeadStatusActions({
  leadId,
  currentStatus,
}: LeadStatusActionsProps) {
  const [state, formAction] = useActionState(updateLeadStatus, initialState);

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft">
        Status atual: {currentStatus}
      </p>

      <form action={formAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="lead_id" value={leadId} />
        {statusOptions.map((option) => (
          <StatusButton key={option.value} option={option} />
        ))}
      </form>

      {state.status === "error" ? (
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-soft">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
