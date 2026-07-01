"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardNavLinkProps = {
  href: string;
  label: string;
  description: string;
};

export function DashboardNavLink({
  href,
  label,
  description,
}: DashboardNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={[
        "block rounded-[1.35rem] border px-4 py-4 transition",
        isActive
          ? "border-line-impact bg-accent/10 text-foreground"
          : "border-border/70 bg-background-soft/30 text-foreground-soft hover:border-line-impact/70 hover:text-foreground",
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-2 text-xs leading-6 opacity-80">{description}</p>
    </Link>
  );
}
