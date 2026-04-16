export function getSafeRedirectPath(
  candidatePath: string | null | undefined,
  fallbackPath: string,
): string {
  if (!candidatePath) {
    return fallbackPath;
  }

  const normalized = candidatePath.trim();

  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return fallbackPath;
  }

  return normalized;
}

export function buildLoginRedirectPath(
  locale: string,
  nextPath: string,
  errorCode?: string,
): string {
  const query = new URLSearchParams();

  query.set("next", nextPath);

  if (errorCode) {
    query.set("error", errorCode);
  }

  const queryString = query.toString();

  return queryString ? `/${locale}/login?${queryString}` : `/${locale}/login`;
}
