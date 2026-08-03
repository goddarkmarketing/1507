import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Prefix public asset paths when deployed under GitHub Pages basePath */
export function assetPath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  if (!path.startsWith("/") || path.startsWith("//")) return path
  return `${base}${path}`
}
