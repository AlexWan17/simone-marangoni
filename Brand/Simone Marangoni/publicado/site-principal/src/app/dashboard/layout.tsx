import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="luxury-shell min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <DashboardSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
