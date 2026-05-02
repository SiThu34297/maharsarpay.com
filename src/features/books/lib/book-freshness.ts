const FIVE_MONTHS = 5;

export function isNewBookByReleaseDate(
  bookReleaseDate: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!bookReleaseDate) {
    return false;
  }

  const release = new Date(bookReleaseDate);

  if (Number.isNaN(release.getTime())) {
    return false;
  }

  if (release.getTime() > now.getTime()) {
    return false;
  }

  const threshold = new Date(now);
  threshold.setMonth(threshold.getMonth() - FIVE_MONTHS);

  return release.getTime() >= threshold.getTime();
}
