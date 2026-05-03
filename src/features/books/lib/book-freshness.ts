const ONE_WEEK_IN_DAYS = 7;

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
  threshold.setDate(threshold.getDate() - ONE_WEEK_IN_DAYS);

  return release.getTime() >= threshold.getTime();
}
