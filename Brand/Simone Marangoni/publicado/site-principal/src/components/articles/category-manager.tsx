"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  saveCategoryAction,
  seedOfficialCategoriesAction,
  type CategoryActionState,
} from "@/app/actions/manage-categories";

type CategoryManagerProps = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    created_at?: string;
  }>;
};

const initialState: CategoryActionState = {
  status: "idle",
};

function SubmitButton({
  idleLabel,
  loadingLabel,
}: {
  idleLabel: string;
  loadingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex items-center justify-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.24em] transition",
        pending
          ? "border-accent bg-accent/15 text-foreground animate-pulse"
          : "border-line-impact text-foreground hover:border-accent-soft hover:bg-accent/10",
      ].join(" ")}
    >
      {pending ? loadingLabel : idleLabel}
    </button>
  );
}

function SeedOfficialCategoriesButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex items-center justify-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.24em] transition",
        pending
          ? "border-accent bg-accent/15 text-foreground animate-pulse"
          : "border-border text-foreground-soft hover:border-line-impact hover:text-foreground",
      ].join(" ")}
    >
      {pending ? "Sincronizando frentes..." : "Sincronizar frentes oficiais"}
    </button>
  );
}

function CategoryEditor({
  category,
}: {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}) {
  const [state, formAction] = useActionState(saveCategoryAction, initialState);

  return (
    <form action={formAction} className="rounded-[1.5rem] border border-border/70 bg-background-soft/35 p-5">
      {category ? <input type="hidden" name="category_id" value={category.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <label className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft">
            Nome da categoria
          </span>
          <input
            name="name"
            required
            defaultValue={category?.name ?? ""}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="Ex.: Direito Médico & Defesa do Paciente"
          />
        </label>

        <label className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft">
            Slug
          </span>
          <input
            name="slug"
            defaultValue={category?.slug ?? ""}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="slug-da-categoria"
          />
        </label>

        <SubmitButton
          idleLabel={category ? "Salvar edição" : "Adicionar categoria"}
          loadingLabel={category ? "Salvando..." : "Criando..."}
        />
      </div>

      {state.message ? (
        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-foreground-soft">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [seedState, seedAction] = useActionState(seedOfficialCategoriesAction, initialState);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.6rem] border border-border/70 bg-background-soft/30 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground-soft">
            Frentes oficiais do escritório
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground-soft">
            Sincronize a base recomendada e mantenha o blog alinhado com as áreas centrais de
            atuação da Dra. Simone Marangoni.
          </p>
        </div>

        <form action={seedAction}>
          <SeedOfficialCategoriesButton />
        </form>
      </div>

      {seedState.message ? (
        <p className="text-[10px] uppercase tracking-[0.18em] text-foreground-soft">
          {seedState.message}
        </p>
      ) : null}

      <CategoryEditor />

      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="rounded-[1.5rem] border border-border/70 bg-background-soft/35 p-5 text-sm leading-7 text-foreground-soft">
            Nenhuma categoria cadastrada ainda.
          </div>
        ) : (
          categories.map((category) => <CategoryEditor key={category.id} category={category} />)
        )}
      </div>
    </div>
  );
}
