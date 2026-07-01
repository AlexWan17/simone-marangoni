import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";

const officialContactUrl = "https://cartao.simonemarangoni.adv.br";

type PublicSiteHeaderProps = {
  badges?: string[];
};

export function PublicSiteHeader({ badges = [] }: PublicSiteHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-border/70 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <Link href="/" className="inline-flex items-center gap-4 sm:gap-6">
        <BrandMark />
        <div>
          <p className="font-display text-xl uppercase tracking-[0.28em] text-foreground sm:text-2xl">
            SIMONE MARANGONI
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.45em] text-foreground-soft sm:text-xs">
            Advocacia Boutique
          </p>
        </div>
      </Link>

      <div className="flex flex-col gap-4 lg:items-end">
        {badges.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-foreground-soft sm:text-xs lg:justify-end">
            {badges.map((badge, index) => (
              <div key={badge} className="flex items-center gap-3">
                {index > 0 ? <span className="metal-line w-10" /> : null}
                <span>{badge}</span>
              </div>
            ))}
          </div>
        ) : null}

        <a
          href={officialContactUrl}
          target="_blank"
          rel="noreferrer"
          className="metallic-cta inline-flex items-center justify-center rounded-full px-5 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition hover:border-accent-soft hover:bg-accent/10"
        >
          Falar com a Dra. Simone
        </a>
      </div>
    </header>
  );
}
