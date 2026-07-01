"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type BrandMarkProps = {
  className?: string;
  href?: string;
};

export function BrandMark({ className = "", href }: BrandMarkProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  const content = !imageUnavailable ? (
    <Image
      src="/images/logo-simone.png"
      alt="Logotipo Simone Marangoni"
      className={`h-20 w-auto object-contain sm:h-24 ${className}`.trim()}
      width={220}
      height={96}
      onError={() => setImageUnavailable(true)}
    />
  ) : (
    <div className={className}>
      <p className="font-display text-2xl tracking-[0.18em] text-foreground">
        SIMONE MARANGONI
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.4em] text-foreground-soft">
        Advocacia Boutique
      </p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Voltar para a página inicial"
        className="inline-flex items-center"
      >
        {content}
      </Link>
    );
  }

  return content;
}
