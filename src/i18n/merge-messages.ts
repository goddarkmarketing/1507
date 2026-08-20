function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge<T>(base: T, overlay: unknown): T {
  if (!isRecord(base) || !isRecord(overlay)) {
    return (overlay as T) ?? base;
  }

  const next: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const previous = next[key];
    next[key] = isRecord(previous) && isRecord(value)
      ? deepMerge(previous, value)
      : value;
  }
  return next as T;
}
