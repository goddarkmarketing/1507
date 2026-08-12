import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Prefix public asset paths when deployed under GitHub Pages basePath */
export function assetPath(path: string) {
  let base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  // Fallback: some GitHub Pages deployments may not inject NEXT_PUBLIC_BASE_PATH
  // correctly, which would cause broken image links like:
  //   /vehicles/... instead of /1507/vehicles/...
  // Detect the common case from the current URL on the client.
  if (!base && typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/1507")) base = "/1507";
  }

  if (!path.startsWith("/") || path.startsWith("//")) return path
  return `${base}${path}`
}
