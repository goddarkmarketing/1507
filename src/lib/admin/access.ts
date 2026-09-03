import type { StaffRole } from "@/lib/admin/settings";

/** Whether a staff role can see an admin nav path. */
export function canSeeAdminNav(role: StaffRole | null, href: string): boolean {
  if (!role || role === "admin") return true;
  if (role === "finance") {
    return [
      "/admin/dashboard",
      "/admin/payments",
      "/admin/prices",
    ].includes(href);
  }
  if (role === "driver") {
    return ["/admin/dashboard", "/admin/schedule", "/admin/bookings"].includes(
      href
    );
  }
  // ops and others: everything except settings
  return href !== "/admin/settings";
}
