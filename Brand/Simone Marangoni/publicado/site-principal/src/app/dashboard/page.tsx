import Link from "next/link";
import { redirect } from "next/navigation";
import { LeadStatusActions } from "@/components/leads/lead-status-actions";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function getStatusBadgeClass(status: string) {
  if (status === "especulacao") {
    return "border-line-impact bg-accent/10 text-foreground";
  }

  if (status === "concluido") {
    return "border-border bg-background-soft/70 text-foreground";
  }

  if (status === "em_atendimento") {
    return "border-accent/40 bg-accent/8 text-foreground";
  }

  return "border-border bg-background-soft/60 text-foreground-soft";
}

const statusTabs = [
  { label: "Novos", value: "novo" },
  { label: "Em Atendimento", value: "em_atendimento" },
  { label: "Concluído", value: "concluido" },
  { label: "Especulação", value: "especulacao" },
] as const;

type DashboardPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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
  const { data: leads, error } = await admin
    .from("leads")
    .select("id, full_name, email, phone, message, status, created_at")
    .eq("tenant_id", defaultTenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Não foi possível carregar os leads do painel.");
  }

  const leadRows = leads ?? [];
  const activeStatus = statusTabs.some((tab) => tab.value === params?.status)
    ? params?.status
    : "novo";
  const filteredLeads = leadRows.filter((lead) => lead.status === activeStatus);
  const counts = statusTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] = leadRows.filter((lead) => lead.status === tab.value).length;
    return acc;
  }, {});

  return (
    <main className="luxury-shell min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-7xl panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Boutique Dashboard
            </p>
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
              Central de Triagem de Leads
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-soft">
              Visão administrativa premium para avaliar novas entradas, isolar especulação e
              conduzir atendimentos com rigor.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-line-impact/60 bg-background-soft/40 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground-soft">
              Total de leads
            </p>
            <p className="mt-2 font-display text-4xl text-foreground">
              {filteredLeads.length}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/cards"
            className="inline-flex items-center justify-center rounded-full border border-line-impact px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
          >
            Gerador de cards
          </Link>
          <Link
            href="/dashboard/artigos"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
          >
            Gestão de artigos
          </Link>
          <Link
            href="/dashboard/artigos/novo"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground-soft transition hover:border-line-impact hover:text-foreground"
          >
            Novo artigo
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {statusTabs.map((tab) => {
            const isActive = tab.value === activeStatus;

            return (
              <Link
                key={tab.value}
                href={`/dashboard?status=${tab.value}`}
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
          <div className="hidden grid-cols-[1.3fr_1fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border/70 bg-background-soft/40 px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:grid">
            <span>Nome</span>
            <span>E-mail</span>
            <span>WhatsApp</span>
            <span>Entrada</span>
            <span>Status</span>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="px-5 py-10 text-sm leading-7 text-foreground-soft">
              Nenhum lead encontrado nesta aba.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredLeads.map((lead) => (
                <details
                  key={lead.id}
                  className="group bg-background/10"
                >
                  <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 transition hover:bg-background-soft/20 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.8fr] lg:items-center [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                        Nome
                      </p>
                      <p className="truncate text-sm font-medium text-foreground">
                        {lead.full_name}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                        E-mail
                      </p>
                      <p className="truncate text-sm text-foreground-soft">{lead.email ?? "-"}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                        WhatsApp
                      </p>
                      <p className="truncate text-sm text-foreground-soft">{lead.phone ?? "-"}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-foreground-soft lg:hidden">
                        Entrada
                      </p>
                      <p className="text-sm text-foreground-soft">
                        {dateFormatter.format(new Date(lead.created_at))}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
                          getStatusBadgeClass(lead.status),
                        ].join(" ")}
                      >
                        {lead.status}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-soft">
                        Expandir
                      </span>
                    </div>
                  </summary>

                  <div className="border-t border-border/40 px-5 py-5">
                    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                          Resumo da mensagem
                        </p>
                        <p className="mt-3 text-sm leading-7 text-foreground-soft">
                          {lead.message ?? "-"}
                        </p>
                      </div>

                      <div className="rounded-[1.2rem] border border-border/60 bg-background-soft/40 p-4">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                          Ações de triagem
                        </p>
                        <div className="mt-4">
                          <LeadStatusActions leadId={lead.id} currentStatus={lead.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
