import { describe, expect, it } from "vitest";
import { canSeeAdminNav } from "@/lib/admin/access";

describe("canSeeAdminNav", () => {
  it("lets admin see every menu", () => {
    expect(canSeeAdminNav("admin", "/admin/settings")).toBe(true);
    expect(canSeeAdminNav("admin", "/admin/drivers")).toBe(true);
  });

  it("limits finance to money menus", () => {
    expect(canSeeAdminNav("finance", "/admin/payments")).toBe(true);
    expect(canSeeAdminNav("finance", "/admin/prices")).toBe(true);
    expect(canSeeAdminNav("finance", "/admin/bookings")).toBe(false);
    expect(canSeeAdminNav("finance", "/admin/settings")).toBe(false);
  });

  it("limits driver to ops trip menus", () => {
    expect(canSeeAdminNav("driver", "/admin/schedule")).toBe(true);
    expect(canSeeAdminNav("driver", "/admin/bookings")).toBe(true);
    expect(canSeeAdminNav("driver", "/admin/payments")).toBe(false);
  });

  it("hides settings from ops", () => {
    expect(canSeeAdminNav("ops", "/admin/bookings")).toBe(true);
    expect(canSeeAdminNav("ops", "/admin/settings")).toBe(false);
  });
});
