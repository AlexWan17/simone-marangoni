import Link from "next/link";
import { redirect } from "next/navigation";
import { SyncProcessButton } from "@/components/processos/sync-process-button";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const statusTabs = [
  { label: "Ativos", value: "ativo" },
  { label: "Arquivados", value: "arquivado" },
] as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

type ProcessPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

type ProcessMovement = {
  data?: string;
  descricao?: string;
};

export default async function DashboardProcessosPage({
  searchParams,
}: ProcessPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  const admin = getSupabaseAdmin();
  const { data: processos, error } = await admin
    .from("processos")
    .select(
      "id, numero_processo, nome_cliente, pasta_interna, sistema_origem, status, resumo_andamento, historico_movimentacoes, created_at",
    )
    .eq("tenant_id", defaultTenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Não foi possível carregar os processos do painel.");
  }

  const processRows = processos ?? [];
  const activeStatus = statusTabs.some((tab) => tab.value === params?.status)
    ? params?.status
    : "ativo";
  const filteredRows = processRows.filter((item) => item.status === activeStatus);
  const counts = statusTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] = processRows.filter((item) => item.status === tab.value).length;
    return acc;
  }, {});

  return (
    <main className="px-2 py-2 sm:px-4 sm:py-4">
      <section className="panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Gestão processual
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Processos (e-SAJ / e-Proc / PJe)
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground-soft">
              Central compacta para acompanhamento do portfólio processual, sincronização de
              intimações e geração imediata de ficha de mesa para papel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-[1.5rem] border border-line-impact/60 bg-background-soft/40 px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground-soft">
                Total nesta aba
              </p>
              <p className="mt-2 font-display text-4xl text-foreground">
                {filteredRows.length}
              </p>
            </div>

            <Link
              href="/dashboard/processos/novo"
              className="inline-flex items-center justify-center rounded-full border border-line-impact px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
            >
              + Novo Processo
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {statusTabs.map((tab) => {
            const isActive = tab.value === activeStatus;

            return (
              <Link
                key={tab.value}
                href={`/dashboard/processos?status=${tab.value}`}
                className={[
                  "inline-flex items-center gap-3 rounded-full border px-5 py-3 text-xs uppercase tracking-[0.22em] transition",
                  isActive
                    ? "border-line-impact bg-accent/10 text-foreground"
                    : "border-border text-foreground-soft hover:border-line-impact hover:text-foreground",
                ].join(" ")}
              >
                <span>{tab.label}</span>
                <span className="rounded-full border border-border/70 px-2 py-1 text-[10px]">
                  {counts[tab.value] ?? 0}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-border/70">
          <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border/70 bg-background-soft/40 px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:grid">
            <span>Processo</span>
            <span>Cliente</span>
            <span>Sistema</span>
            <span>Status</span>
          </div>

          {filteredRows.length === 0 ? (
            <div className="px-5 py-10 text-sm leading-7 text-foreground-soft">
              Nenhum processo encontrado nesta aba.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredRows.map((processo) => {
                const movimentos =
                  (processo.historico_movimentacoes as ProcessMovement[] | null) ?? [];

                return (
                  <details key={processo.id} className="group bg-background/10">
                    <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 transition hover:bg-background-soft/20 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr] lg:items-center [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                          Processo
                        </p>
                        <p className="truncate text-sm font-medium text-foreground">
                          {processo.numero_processo}
                        </p>
                        <p className="mt-1 truncate text-xs text-foreground-soft">
                          {processo.pasta_interna || "Pasta interna não informada"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                          Cliente
                        </p>
                        <p className="truncate text-sm text-foreground-soft">
                          {processo.nome_cliente}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                          Sistema
                        </p>
                        <span className="inline-flex rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground-soft">
                          {processo.sistema_origem}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex rounded-full border border-line-impact/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
                          {processo.status}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-soft">
                          Expandir
                        </span>
                      </div>
                    </summary>

                    <div className="border-t border-border/40 px-5 py-5">
                      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                        <div className="space-y-5">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                              Resumo do andamento
                            </p>
                            <p className="mt-3 text-sm leading-7 text-foreground-soft">
                              {processo.resumo_andamento || "Resumo ainda não registrado."}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                              Histórico de movimentações
                            </p>
                            {movimentos.length === 0 ? (
                              <p className="mt-3 text-sm leading-7 text-foreground-soft">
                                Nenhuma movimentação registrada até o momento.
                              </p>
                            ) : (
                              <div className="mt-3 space-y-3">
                                {movimentos.map((movimento, index) => (
                                  <div
                                    key={`${processo.id}-${index}`}
                                    className="rounded-[1rem] border border-border/60 bg-background-soft/35 p-3"
                                  >
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-soft">
                                      {movimento.data || "Data não informada"}
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-foreground-soft">
                                      {movimento.descricao || "Movimentação sem descrição."}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-5 rounded-[1.2rem] border border-border/60 bg-background-soft/40 p-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                              Ações operacionais
                            </p>
                            <div className="mt-4">
                              <SyncProcessButton processId={processo.id} />
                            </div>
                          </div>

                          <div className="metal-line w-full" />

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                              Ficha de mesa
                            </p>
                            <p className="mt-3 text-sm leading-7 text-foreground-soft">
                              Abra a visualização A4 com foco total em impressão para apoio de
                              audiência ou reunião estratégica.
                            </p>
                            <Link
                              href={`/dashboard/processos/${processo.id}/ficha`}
                              target="_blank"
                              className="mt-4 inline-flex items-center justify-center rounded-full border border-line-impact px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
                            >
                              Gerar Ficha de Mesa (Imprimir)
                            </Link>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                              Último registro
                            </p>
                            <p className="mt-3 text-sm leading-7 text-foreground-soft">
                              {dateFormatter.format(new Date(processo.created_at))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
