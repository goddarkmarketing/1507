"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Car,
  ClipboardList,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Table2,
  Users,
  Truck,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/lib/admin/store";
import { useSettingsStore } from "@/lib/admin/settings-store";
import { useBookingStore } from "@/lib/booking/store";
import { DEMO_ADMIN } from "@/lib/admin/seed";
import type { StaffRole } from "@/lib/admin/settings";
import { canSeeAdminNav } from "@/lib/admin/access";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const NAV_MAIN = [
  { href: "/admin/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", key: "bookings", icon: ClipboardList },
  { href: "/admin/payments", key: "payments", icon: CreditCard },
  { href: "/admin/schedule", key: "schedule", icon: CalendarDays },
  { href: "/admin/prices", key: "prices", icon: Table2 },
  { href: "/admin/vehicles", key: "vehicles", icon: Truck },
] as const;

const NAV_TEAM = [
  { href: "/admin/drivers", key: "drivers", icon: Car },
  { href: "/admin/customers", key: "customers", icon: Users },
] as const;

const NAV_SYSTEM = [
  { href: "/admin/settings", key: "settings", icon: Settings },
] as const;

function canSee(role: StaffRole | null, href: string) {
  return canSeeAdminNav(role, href);
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-amber-300" : "text-zinc-400"
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const pathname = usePathname();
  const authenticated = useAdminStore((s) => s.authenticated);
  const staffRole = useAdminStore((s) => s.staffRole);
  const staffName = useAdminStore((s) => s.staffName);
  const login = useAdminStore((s) => s.login);
  const logout = useAdminStore((s) => s.logout);
  const syncCustomerBookings = useAdminStore((s) => s.syncCustomerBookings);
  const confirmedBookings = useBookingStore((s) => s.confirmedBookings);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const finish = () => {
      if (
        !alive ||
        !useAdminStore.persist.hasHydrated() ||
        !useSettingsStore.persist.hasHydrated()
      ) {
        return;
      }
      setReady(true);
    };
    finish();
    useAdminStore.persist.onFinishHydration(finish);
    useSettingsStore.persist.onFinishHydration(finish);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    syncCustomerBookings(confirmedBookings);
  }, [ready, confirmedBookings, syncCustomerBookings]);

  useEffect(() => {
    if (!ready || !authenticated) return;
    if (pathname === "/admin" || pathname === "/admin/") {
      router.replace("/admin/dashboard");
    }
  }, [ready, authenticated, pathname, router]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const pageTitle = (() => {
    const all = [...NAV_MAIN, ...NAV_TEAM, ...NAV_SYSTEM];
    const hit = all.find((item) => isActive(item.href));
    return hit ? t(`nav.${hit.key}`) : t("panelTitle");
  })();

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f7f7f5] text-sm text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f7f7f5] px-4">
        <form
          className="w-full max-w-[380px] space-y-5 rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            const ok = login(username, password);
            if (!ok) setError(t("loginError"));
            else setError("");
          }}
        >
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-amber-700 uppercase">
              {siteConfig.shortName}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {t("loginTitle")}
            </h1>
            <p className="text-sm leading-relaxed text-zinc-500">
              {t("loginHint", {
                user: DEMO_ADMIN.username,
                pass: DEMO_ADMIN.password,
              })}
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600">
                {t("username")}
              </label>
              <input
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 text-sm outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-amber-200/80"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-600">
                {t("password")}
              </label>
              <input
                type="password"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 text-sm outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-amber-200/80"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="h-11 w-full rounded-xl">
            {t("signIn")}
          </Button>
          <Link
            href="/"
            className="block text-center text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            {t("backToSite")}
          </Link>
        </form>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 px-5 pt-6 pb-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-amber-700 uppercase">
            {siteConfig.shortName}
          </p>
          <p className="mt-1 truncate text-base font-semibold tracking-tight text-zinc-950">
            {t("panelTitle")}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            {staffName
              ? `${staffName} · ${t(`settingsRole.${staffRole ?? "admin"}`)}`
              : t("opsLabel")}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase">
          {t("navGroupOps")}
        </p>
        <nav className="space-y-0.5">
          {NAV_MAIN.filter((item) => canSee(staffRole, item.href)).map(
            (item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={t(`nav.${item.key}`)}
                icon={item.icon}
                active={isActive(item.href)}
                onClick={() => setMenuOpen(false)}
              />
            )
          )}
        </nav>

        <p className="mt-6 px-3 pb-2 text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase">
          {t("navGroupTeam")}
        </p>
        <nav className="space-y-0.5">
          {NAV_TEAM.filter((item) => canSee(staffRole, item.href)).map(
            (item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={t(`nav.${item.key}`)}
                icon={item.icon}
                active={isActive(item.href)}
                onClick={() => setMenuOpen(false)}
              />
            )
          )}
        </nav>

        {NAV_SYSTEM.some((item) => canSee(staffRole, item.href)) ? (
          <>
            <p className="mt-6 px-3 pb-2 text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase">
              {t("navGroupSystem")}
            </p>
            <nav className="space-y-0.5">
              {NAV_SYSTEM.filter((item) => canSee(staffRole, item.href)).map(
                (item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={t(`nav.${item.key}`)}
                    icon={item.icon}
                    active={isActive(item.href)}
                    onClick={() => setMenuOpen(false)}
                  />
                )
              )}
            </nav>
          </>
        ) : null}
      </div>

      <div className="mt-auto space-y-1 border-t border-zinc-200/80 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-zinc-600 transition hover:bg-zinc-100/80 hover:text-zinc-950"
        >
          <ExternalLink className="size-4 text-zinc-400" />
          {t("backToSite")}
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-zinc-600 transition hover:bg-zinc-100/80 hover:text-zinc-950"
          onClick={() => {
            logout();
            router.replace("/admin");
          }}
        >
          <LogOut className="size-4 text-zinc-400" />
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-[#f7f7f5] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-svh border-r border-zinc-200/80 bg-white lg:block">
        {sidebar}
      </aside>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[280px] border-r border-zinc-200/80 bg-white shadow-xl transition-transform duration-200 lg:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-zinc-900/25 backdrop-blur-[1px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#f7f7f5]/90 backdrop-blur-md">
          <div className="flex h-14 w-full items-center gap-3 px-4 sm:px-6 lg:h-16 lg:px-8 xl:px-10">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900 sm:text-[15px]">
                {pageTitle}
              </p>
            </div>
          </div>
        </header>

        <div className="w-full flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
