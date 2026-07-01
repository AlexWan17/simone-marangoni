"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  syncProcessNoticesAction,
  type SyncProcessState,
} from "@/app/actions/sync-process-notices";

type SyncProcessButtonProps = {
  processId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition",
        pending
          ? "border-accent bg-accent/15 text-foreground animate-pulse"
          : "border-line-impact text-foreground hover:border-accent-soft hover:bg-accent/10",
      ].join(" ")}
    >
      {pending ? "Sincronizando..." : "Sincronizar Intimações"}
    </button>
  );
}

const initialState: SyncProcessState = {
  status: "idle",
};

export function SyncProcessButton({ processId }: SyncProcessButtonProps) {
  const [state, formAction] = useActionState(syncProcessNoticesAction, initialState);

  return (
    <div className="space-y-3">
      <form action={formAction}>
        <input type="hidden" name="process_id" value={processId} />
        <SubmitButton />
      </form>

      {state.message ? (
        <p className="text-[10px] uppercase tracking-[0.16em] text-foreground-soft">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
