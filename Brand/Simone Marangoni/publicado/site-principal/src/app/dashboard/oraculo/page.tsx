import { redirect } from "next/navigation";
import { OracleChat } from "@/components/oraculo/oracle-chat";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardOraculoPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  return (
    <main className="px-2 py-2 sm:px-4 sm:py-4">
      <section className="panel-sheen rounded-[2rem] p-6 sm:p-8">
        <div className="mb-8 border-b border-border/70 pb-6">
          <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
            Inteligência estratégica
          </p>
          <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
            Oráculo IA Jurídico
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground-soft">
            Ambiente reservado para raciocínio técnico assistido, revisão crítica e estruturação
            de teses de alto nível para a advocacia boutique.
          </p>
        </div>

        <OracleChat />
      </section>
    </main>
  );
}
