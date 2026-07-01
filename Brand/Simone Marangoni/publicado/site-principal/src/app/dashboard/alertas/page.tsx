import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLegalAlerts } from "@/lib/rss/legal-alerts";

const alertThemes = [
  { label: "Todos", value: "todos", terms: [] },
  {
    label: "Franquias",
    value: "franquias",
    terms: [
      "franquia",
      "franchising",
      "cof",
      "franqueado",
      "franqueador",
      "circular de oferta",
    ],
  },
  {
    label: "Neurodivergências / TEA",
    value: "neurodivergencias",
    terms: [
      "tea",
      "autismo",
      "artista",
      "tdah",
      "tod",
      "neurodivergente",
      "aba",
      "inclusão escolar",
      "plano de saúde",
      "medicamento",
    ],
  },
  {
    label: "Família",
    value: "familia",
    terms: [
      "inventário",
      "sucessões",
      "divórcio",
      "partilha",
      "guarda",
      "alimentos",
      "pensão",
      "herança",
    ],
  },
  {
    label: "Direito Médico",
    value: "medico",
    terms: [
      "médico",
      "erro médico",
      "indenização",
      "cirurgia",
      "hospital",
      "ans",
      "saúde",
    ],
  },
  {
    label: "Previdenciário",
    value: "previdenciario",
    terms: ["previdenciário", "bpc", "loas", "aposentadoria", "inss", "benefício"],
  },
] as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

type DashboardAlertasPageProps = {
  searchParams?: Promise<{
    tema?: string;
  }>;
};

export default async function DashboardAlertasPage({
  searchParams,
}: DashboardAlertasPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  const selectedTheme =
    alertThemes.find((theme) => theme.value === params?.tema) ?? alertThemes[0];
  const alerts = await getLegalAlerts(10, {
    terms: selectedTheme.terms,
  });

  return (
    <main className="px-2 py-2 sm:px-4 sm:py-4">
      <section className="panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Monitoramento externo
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Alertas Jurídicos Dinâmicos
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground-soft">
              Leitura server-side dos tópicos quentes em Direito e tribunais com curadoria por
              tema para apoiar resposta rápida, produção de conteúdo e posicionamento estratégico
              do escritório.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-line-impact/60 bg-background-soft/40 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground-soft">
              Fontes ativas
            </p>
            <p className="mt-2 font-display text-3xl text-foreground">STJ + ConJur</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {alertThemes.map((theme) => {
            const isActive = theme.value === selectedTheme.value;

            return (
              <Link
                key={theme.value}
                href={
                  theme.value === "todos"
                    ? "/dashboard/alertas"
                    : `/dashboard/alertas?tema=${theme.value}`
                }
                className={[
                  "inline-flex items-center justify-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.22em] transition",
                  isActive
                    ? "border-line-impact bg-accent/10 text-foreground"
                    : "border-border text-foreground-soft hover:border-line-impact hover:text-foreground",
                ].join(" ")}
              >
                {theme.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-border/70">
          <div className="hidden grid-cols-[1.3fr_0.8fr_0.8fr] gap-4 border-b border-border/70 bg-background-soft/40 px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:grid">
            <span>Topico</span>
            <span>Fonte</span>
            <span>Publicado</span>
          </div>

          {alerts.length === 0 ? (
            <div className="px-5 py-10 text-sm leading-7 text-foreground-soft">
              Nenhum alerta jurídico encontrado para o tema selecionado neste momento.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {alerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={alert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-4 px-5 py-5 transition hover:bg-background-soft/20 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:items-start"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="mt-3 text-sm leading-7 text-foreground-soft">
                      {alert.excerpt}
                    </p>
                    {alert.categories.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {alert.categories.slice(0, 3).map((category) => (
                          <span
                            key={`${alert.id}-${category}`}
                            className="rounded-full border border-line-impact/50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground-soft"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                      Fonte
                    </p>
                    <span className="inline-flex rounded-full border border-line-impact/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
                      {alert.source}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                      Publicado
                    </p>
                    <p className="text-sm text-foreground-soft">
                      {alert.publishedAt
                        ? dateFormatter.format(new Date(alert.publishedAt))
                        : "Data indisponível"}
                    </p>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-foreground">
                      Abrir conteúdo completo
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
