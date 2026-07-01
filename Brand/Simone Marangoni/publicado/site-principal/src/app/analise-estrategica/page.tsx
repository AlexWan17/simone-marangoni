import { LeadCaptureForm } from "@/components/leads/lead-capture-form";
import { PublicSiteHeader } from "@/components/layout/public-site-header";
import { practiceAreas } from "@/lib/content/practice-areas";
import { createSlug } from "@/lib/utils/slug";

type StrategicAnalysisPageProps = {
  searchParams?: Promise<{
    area?: string;
  }>;
};

function getSelectedArea(area?: string) {
  if (!area) {
    return null;
  }

  const normalizedArea = createSlug(area);
  return (
    practiceAreas.find((item) => createSlug(item.title) === normalizedArea) ?? null
  );
}

export default async function StrategicAnalysisPage({
  searchParams,
}: StrategicAnalysisPageProps) {
  const params = await searchParams;
  const selectedArea = getSelectedArea(params?.area);

  const initialMessage = selectedArea
    ? `Gostaria de solicitar uma análise estratégica sobre ${selectedArea.title}. Meu contexto é: `
    : "Gostaria de solicitar uma análise estratégica. Meu contexto é: ";

  return (
    <main className="luxury-shell min-h-screen px-6 py-8 sm:px-10 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <PublicSiteHeader
          badges={[
            "Análise Estratégica",
            selectedArea?.title ?? "Triagem Jurídica",
          ]}
        />

        <div className="grid gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
          <article className="panel-sheen rounded-[1.8rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Orientação inicial
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Orientações para sua Solicitação
            </h1>
            <div className="mt-6 metal-line w-full max-w-md" />
            <p className="mt-6 text-base leading-8 text-foreground-soft">
              Para darmos andamento à sua análise de forma prioritária, preencha os campos ao
              lado. No resumo do desafio, relate os fatos principais, prazos em curso ou
              documentos que possui. Suas informações são protegidas por sigilo profissional e
              tratadas em conformidade estrita com a LGPD.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                  Área selecionada
                </p>
                <p className="mt-2 text-sm leading-7 text-foreground">
                  {selectedArea?.title ?? "Triagem jurídica geral"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-foreground-soft">
                  Direcionamento
                </p>
                <p className="mt-2 text-sm leading-7 text-foreground-soft">
                  Informe o contexto, o objetivo e a urgência. A equipe utiliza esse primeiro
                  resumo para classificar a demanda e definir o próximo passo com mais precisão.
                </p>
              </div>
            </div>
          </article>

          <section className="panel-sheen metallic-border rounded-[1.8rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.45em] text-foreground-soft">
              Solicitação de análise
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Triagem premium para demandas jurídicas sensíveis e estratégicas.
            </h2>
            <div className="mt-6 metal-line w-full max-w-md" />
            <div className="mt-8">
              <LeadCaptureForm
                caseType={selectedArea?.title}
                initialMessage={initialMessage}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
