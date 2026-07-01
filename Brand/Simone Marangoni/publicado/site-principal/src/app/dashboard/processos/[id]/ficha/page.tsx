import { notFound, redirect } from "next/navigation";
import { PrintSheetButton } from "@/components/processos/print-sheet-button";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const defaultTenantId =
  process.env.DEFAULT_TENANT_ID ?? "4a0fae57-c55d-4f68-9b43-7f50b5d7659e";

type ProcessSheetPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ProcessMovement = {
  data?: string;
  descricao?: string;
};

export default async function ProcessSheetPage({
  params,
}: ProcessSheetPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  const admin = getSupabaseAdmin();
  const { data: processo, error } = await admin
    .from("processos")
    .select(
      "id, numero_processo, nome_cliente, pasta_interna, sistema_origem, status, resumo_andamento, historico_movimentacoes",
    )
    .eq("tenant_id", defaultTenantId)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível gerar a ficha de mesa.");
  }

  if (!processo) {
    notFound();
  }

  const movimentos = (processo.historico_movimentacoes as ProcessMovement[] | null) ?? [];

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black sm:px-8">
      <div className="mx-auto flex max-w-[210mm] justify-end pb-4">
        <PrintSheetButton />
      </div>

      <section className="print-a4-page mx-auto max-w-[210mm] bg-white p-8 sm:p-10">
        <header className="border-b border-black pb-6">
          <p className="text-xs uppercase tracking-[0.35em]">Ficha de Mesa</p>
          <h1 className="mt-4 text-3xl font-semibold">Simone Marangoni Advocacia Boutique</h1>
          <p className="mt-3 text-sm leading-7">
            Documento operacional para apoio de mesa, audiência, despacho ou reunião jurídica.
          </p>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
              Número do processo
            </p>
            <p className="mt-2 text-base">{processo.numero_processo}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
              Cliente
            </p>
            <p className="mt-2 text-base">{processo.nome_cliente}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
              Pasta interna
            </p>
            <p className="mt-2 text-base">{processo.pasta_interna || "Não informada"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
              Sistema de origem
            </p>
            <p className="mt-2 text-base">{processo.sistema_origem}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">Status</p>
            <p className="mt-2 text-base">{processo.status}</p>
          </div>
        </section>

        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
            Resumo do andamento
          </p>
          <div className="mt-3 min-h-32 border border-black px-4 py-4 text-sm leading-7">
            {processo.resumo_andamento || "Resumo pendente de preenchimento."}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
            Histórico de movimentações
          </p>
          <div className="mt-3 space-y-3">
            {movimentos.length === 0 ? (
              <div className="border border-black px-4 py-4 text-sm leading-7">
                Nenhuma movimentação registrada.
              </div>
            ) : (
              movimentos.map((movimento, index) => (
                <div key={`${processo.id}-${index}`} className="border border-black px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-black/60">
                    {movimento.data || "Data não informada"}
                  </p>
                  <p className="mt-2 text-sm leading-7">
                    {movimento.descricao || "Descrição não informada."}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
              Estratégia de mesa
            </p>
            <div className="mt-3 h-28 border border-black" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-black/60">
              Observações rápidas
            </p>
            <div className="mt-3 h-28 border border-black" />
          </div>
        </section>
      </section>
    </main>
  );
}
