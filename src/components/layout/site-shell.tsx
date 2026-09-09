"use client";

import { usePathname } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return <div className="min-h-svh bg-white">{children}</div>;
  }

  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-1 pb-20 md:pb-0 print:pb-0">{children}</main>
      <div className="print:hidden">
        <Footer />
        <MobileBottomBar />
      </div>
    </>
  );
}
