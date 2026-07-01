"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

type ArticleFormProps = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  action: ArticleFormAction;
  initialValues?: {
    id?: string;
    title?: string;
    slug?: string;
    category?: string;
    status?: string;
    content?: string;
  };
  submitLabel?: string;
  loadingLabel?: string;
};

type ArticleFormState = {
  status: "idle" | "error";
  message?: string;
};

type ArticleFormAction = (
  prevState: ArticleFormState,
  formData: FormData,
) => Promise<ArticleFormState>;

const articleStatusOptions = [
  { label: "Rascunho", value: "draft" },
  { label: "Em revisão", value: "review" },
  { label: "Publicado", value: "published" },
  { label: "Arquivado", value: "archived" },
] as const;

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

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
        "inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm uppercase tracking-[0.24em] transition",
        pending
          ? "border-accent bg-accent/15 text-foreground animate-pulse"
          : "border-line-impact text-foreground hover:border-accent-soft hover:bg-accent/10",
      ].join(" ")}
    >
      {pending ? loadingLabel : idleLabel}
    </button>
  );
}

const initialState: ArticleFormState = {
  status: "idle",
};

export function ArticleForm({
  categories,
  action,
  initialValues,
  submitLabel = "Salvar artigo",
  loadingLabel = "Salvando artigo...",
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [state, formAction] = useActionState(action, initialState);

  const autoSlug = useMemo(() => createSlug(title), [title]);
  const currentSlug = slugTouched ? slug : initialValues?.slug || autoSlug;

  return (
    <form action={formAction} className="space-y-6">
      {initialValues?.id ? <input type="hidden" name="article_id" value={initialValues.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="space-y-2 lg:col-span-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Título
          </span>
          <input
            name="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="Título do artigo"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Slug automático
          </span>
          <input
            name="slug"
            value={currentSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            placeholder="slug-do-artigo"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
            Categoria
          </span>
          <select
            name="category"
            required
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            defaultValue={initialValues?.category ?? ""}
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
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
            defaultValue={initialValues?.status ?? "draft"}
            className="w-full rounded-2xl border border-line-impact/60 bg-background-soft/70 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          >
            {articleStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.28em] text-foreground-soft">
          Conteúdo em texto / markdown
        </span>
        <textarea
          name="content"
          required
          rows={14}
          defaultValue={initialValues?.content ?? ""}
          className="w-full resize-y rounded-[1.5rem] border border-line-impact/60 bg-background-soft/70 px-4 py-4 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          placeholder="Escreva o conteúdo do artigo. Você pode usar títulos, listas e markdown simples."
        />
      </label>

      {state.status === "error" ? (
        <div className="rounded-2xl border border-line-impact/60 bg-background-soft/50 p-4 text-sm leading-7 text-foreground-soft">
          {state.message}
        </div>
      ) : null}

      <SubmitButton idleLabel={submitLabel} loadingLabel={loadingLabel} />
    </form>
  );
}
