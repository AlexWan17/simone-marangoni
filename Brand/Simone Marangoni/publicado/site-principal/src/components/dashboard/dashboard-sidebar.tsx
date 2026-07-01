import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { DashboardNavLink } from "@/components/dashboard/dashboard-nav-link";

const navItems = [
  {
    href: "/dashboard",
    label: "Central de Leads",
    description: "Triagem premium, classificação e acompanhamento comercial.",
  },
  {
    href: "/dashboard/artigos",
    label: "Artigos & SEO",
    description: "Produção editorial, autoridade orgânica e presença institucional.",
  },
  {
    href: "/dashboard/cards",
    label: "Gerador de Cards",
    description: "Criação e exportação de artes sociais com padrão premium.",
  },
  {
    href: "/dashboard/alertas",
    label: "Alertas Juridicos",
    description: "Radar externo com temas quentes, julgamentos e aprovacoes relevantes.",
  },
  {
    href: "/dashboard/processos",
    label: "Processos (e-SAJ/e-Proc)",
    description: "Gestão operacional dos casos e sincronização de intimações.",
  },
  {
    href: "/dashboard/oraculo",
    label: "Oráculo IA Jurídico",
    description: "Assistente de raciocínio jurídico para análises estratégicas.",
  },
  {
    href: "/dashboard/links",
    label: "Links Úteis",
    description: "Acesso rápido aos sistemas e portais jurídicos do dia a dia.",
  },
] as const;

export function DashboardSidebar() {
  return (
    <aside className="panel-sheen h-full rounded-[2rem] p-5 sm:p-6 lg:sticky lg:top-6">
      <div className="border-b border-border/70 pb-6">
        <BrandMark className="items-start" />
        <p className="mt-6 text-[10px] uppercase tracking-[0.42em] text-foreground-soft">
          Central de Operação Jurídica
        </p>
        <div className="mt-4 metal-line w-full" />
      </div>

      <nav className="mt-6 space-y-3">
        {navItems.map((item) => (
          <DashboardNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            description={item.description}
          />
        ))}
      </nav>

      <div className="mt-6 border-t border-border/70 pt-6">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-full border border-line-impact px-4 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
        >
          Voltar para o Site
        </Link>
      </div>
    </aside>
  );
}
