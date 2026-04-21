"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import type {
  BookReviewListQuery,
  BookReviewListResponse,
} from "@/features/book-reviews/schemas/book-reviews";
import type { Dictionary, Locale } from "@/lib/i18n";

type BookReviewsListClientProps = Readonly<{
  copy: Dictionary["bookReviewsList"];
  locale: Locale;
  initialResponse: BookReviewListResponse;
  initialQuery: BookReviewListQuery;
}>;

type ActiveFilterChip = {
  key: "q" | "bookId";
  label: string;
};

const SKELETON_COUNT = 4;
const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function groupDigits(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toMyanmarDigits(value: string) {
  return value.replace(/\d/g, (digit) => String.fromCharCode(0x1040 + Number(digit)));
}

function formatCount(locale: Locale, value: number) {
  const grouped = groupDigits(Math.max(0, value));
  return locale === "my" ? toMyanmarDigits(grouped) : grouped;
}

function replaceResultCount(template: string, count: number, locale: Locale) {
  return template.replace("{count}", formatCount(locale, count));
}

function formatDate(locale: Locale, value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = parsed.getUTCDate();
  const month = parsed.getUTCMonth() + 1;
  const year = parsed.getUTCFullYear();

  if (locale === "my") {
    return toMyanmarDigits(`${day}/${month}/${year}`);
  }

  return `${EN_MONTHS[month - 1]} ${day}, ${year}`;
}

function getInitial(name: string) {
  const firstChar = Array.from(name.trim())[0];
  return firstChar ? firstChar.toLocaleUpperCase() : "R";
}

function buildBaseParams(query: BookReviewListQuery) {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", query.q);
  }

  if (query.bookId) {
    params.set("bookId", query.bookId);
  }

  params.set("limit", String(query.limit));

  return params;
}

export function BookReviewsListClient({
  copy,
  locale,
  initialResponse,
  initialQuery,
}: BookReviewsListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initialResponse.items);
  const [nextCursor, setNextCursor] = useState(initialResponse.nextCursor);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [searchInput, setSearchInput] = useState(initialQuery.q ?? "");

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        q: initialQuery.q,
        bookId: initialQuery.bookId,
        limit: initialQuery.limit,
      }),
    [initialQuery.bookId, initialQuery.limit, initialQuery.q],
  );

  useEffect(() => {
    setItems(initialResponse.items);
    setNextCursor(initialResponse.nextCursor);
    setLoadMoreError(false);
    setSearchInput(initialQuery.q ?? "");
  }, [initialQuery, initialResponse.items, initialResponse.nextCursor, queryKey]);

  const activeBookTitle = useMemo(() => {
    if (!initialQuery.bookId) {
      return null;
    }

    const matchedReview = initialResponse.items.find(
      (item) => item.book.id === initialQuery.bookId || item.bookId === initialQuery.bookId,
    );

    return matchedReview?.book.title?.trim() || null;
  }, [initialQuery.bookId, initialResponse.items]);

  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];

    if (initialQuery.q) {
      chips.push({ key: "q", label: initialQuery.q });
    }

    if (initialQuery.bookId) {
      chips.push({
        key: "bookId",
        label: activeBookTitle
          ? `${copy.reviewedBookLabel}: ${activeBookTitle}`
          : copy.reviewedBookLabel,
      });
    }

    return chips;
  }, [activeBookTitle, copy.reviewedBookLabel, initialQuery.bookId, initialQuery.q]);

  const hasAnyFilter = activeFilterChips.length > 0;

  const pushQuery = useCallback(
    (updateFn: (params: URLSearchParams) => void) => {
      const params = buildBaseParams(initialQuery);
      updateFn(params);
      params.delete("cursor");

      const queryString = params.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [initialQuery, pathname, router],
  );

  const loadMore = useCallback(async () => {
    if (!nextCursor || isFetchingMore) {
      return;
    }

    setIsFetchingMore(true);
    setLoadMoreError(false);

    try {
      const params = buildBaseParams(initialQuery);
      params.set("cursor", nextCursor);
      params.set("lang", locale);

      const response = await fetch(`/api/book-reviews?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load more book reviews");
      }

      const payload = (await response.json()) as BookReviewListResponse;

      setItems((currentItems) => {
        const existingIds = new Set(currentItems.map((item) => item.id));
        const nextItems = [...currentItems];

        for (const item of payload.items) {
          if (!existingIds.has(item.id)) {
            existingIds.add(item.id);
            nextItems.push(item);
          }
        }

        return nextItems;
      });

      setNextCursor(payload.nextCursor);
    } catch {
      setLoadMoreError(true);
    } finally {
      setIsFetchingMore(false);
    }
  }, [initialQuery, isFetchingMore, locale, nextCursor]);

  useEffect(() => {
    if (!nextCursor || isFetchingMore || isPending) {
      return;
    }

    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "220px",
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isFetchingMore, isPending, loadMore, nextCursor, queryKey]);

  const clearAllFilters = useCallback(() => {
    pushQuery((params) => {
      params.delete("q");
      params.delete("bookId");
    });
  }, [pushQuery]);

  const removeFilter = useCallback(
    (key: "q" | "bookId") => {
      pushQuery((params) => {
        params.delete(key);
      });
    },
    [pushQuery],
  );

  const onSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      pushQuery((params) => {
        if (searchInput.trim()) {
          params.set("q", searchInput.trim());
        } else {
          params.delete("q");
        }
      });
    },
    [pushQuery, searchInput],
  );

  const loadedCount = items.length;

  return (
    <section className="section-gap">
      <div className="home-shell">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl text-[var(--color-text-main)] md:text-4xl">
            {locale === "my" ? "စာဖတ်သူတို့စာညွှန်းများ" : copy.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-text-muted)] md:text-base">
            {locale === "my"
              ? "စာဖတ်သူများ၏ တကယ့်အမြင်နှင့် စာညွှန်းများကို လေ့လာဖတ်ရှုနိုင်ပါသည်။"
              : copy.description}
          </p>
        </div>

        <div className="sticky top-[72px] z-30 -mx-2 mb-4 rounded-xl border border-[var(--color-border)] bg-white/95 px-2 py-2 backdrop-blur-md md:top-[68px] lg:static lg:mx-0 lg:mb-6 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0">
          <div className="flex">
            <form
              onSubmit={onSearchSubmit}
              className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:outline-none"
                aria-label={copy.searchPlaceholder}
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--color-button-secondary)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-95"
              >
                {copy.searchButton}
              </button>
            </form>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            {replaceResultCount(copy.showingResults, loadedCount, locale)}
          </p>

          {hasAnyFilter ? (
            <button
              type="button"
              className="text-sm font-semibold text-[var(--color-brand)] transition hover:opacity-80"
              onClick={clearAllFilters}
            >
              {copy.clearAllFilters}
            </button>
          ) : null}
        </div>

        {hasAnyFilter ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {activeFilterChips.map((chip) => (
              <button
                key={`${chip.key}-${chip.label}`}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-text-main)]"
                onClick={() => removeFilter(chip.key)}
                aria-label={`${copy.removeFilterLabel}: ${chip.label}`}
              >
                <span>{chip.label}</span>
                <Cross2Icon />
              </button>
            ))}
          </div>
        ) : null}

        <div>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3">
              {items.map((item) => {
                const detailHref = `/${locale}/book-reviews/${item.id}`;
                const bookHref = item.book.id
                  ? `/${locale}/books/${item.book.id}?from=books`
                  : `/${locale}/books`;

                return (
                  <article
                    key={item.id}
                    className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-subtle)] text-sm font-semibold text-[var(--color-brand)]">
                        {getInitial(item.reviewerName)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--color-brand)]">
                          {copy.byLabel} {item.reviewerName}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {copy.onLabel} {formatDate(locale, item.createdAt)}
                          {" • "}
                          {copy.viewsLabel} {formatCount(locale, item.viewCount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
                      <Link
                        href={bookHref}
                        prefetch={false}
                        className="relative block h-20 w-14 shrink-0 overflow-hidden rounded-md"
                      >
                        <Image
                          src={item.book.coverImageSrc}
                          alt={item.book.coverImageAlt}
                          width={112}
                          height={160}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                          {copy.reviewedBookLabel}
                        </p>
                        <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-[var(--color-text-main)] sm:text-base">
                          <Link
                            href={bookHref}
                            prefetch={false}
                            className="hover:text-[var(--color-brand)]"
                          >
                            {item.book.title}
                          </Link>
                        </h2>
                      </div>
                    </div>

                    <p className="my-4 line-clamp-4 min-h-[5.6rem] text-sm leading-relaxed text-[var(--color-text-main)]">
                      {item.excerpt}
                    </p>

                    <Link
                      href={detailHref}
                      prefetch={false}
                      className="mt-auto inline-flex items-center justify-center whitespace-nowrap text-center rounded-full bg-[var(--color-button-secondary)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-95"
                    >
                      {copy.readReviewLabel}
                    </Link>
                  </article>
                );
              })}

              {isFetchingMore
                ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <article
                      key={`skeleton-${index}`}
                      className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-soft)] animate-pulse"
                    >
                      <div className="h-11 w-11 rounded-full bg-[var(--color-brand-subtle)]" />
                      <div className="mt-4 h-20 rounded-xl bg-[var(--color-brand-subtle)]" />
                      <div className="mt-4 h-4 w-4/5 rounded bg-[var(--color-brand-subtle)]" />
                      <div className="mt-2 h-4 w-3/4 rounded bg-[var(--color-brand-subtle)]" />
                    </article>
                  ))
                : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
              <h2 className="text-xl text-[var(--color-text-main)]">{copy.noReviewsFound}</h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {copy.tryDifferentFilters}
              </p>
              <Link
                href={`/${locale}/books`}
                className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                {copy.browseBooks}
              </Link>
            </div>
          )}

          {loadMoreError ? (
            <div className="mt-6 rounded-xl border border-[var(--color-accent)]/35 bg-[var(--color-accent-soft)] p-4 text-sm text-[var(--color-text-main)]">
              <p>{copy.loadMoreError}</p>
              <button
                type="button"
                className="mt-3 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-xs font-semibold text-white"
                onClick={() => void loadMore()}
              >
                {copy.retry}
              </button>
            </div>
          ) : null}

          {isFetchingMore ? (
            <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
              {copy.loadingMore}
            </p>
          ) : null}

          <div ref={sentinelRef} className="h-4" aria-hidden />
        </div>
      </div>

      {isPending ? (
        <div className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-main)] shadow-[var(--shadow-soft)]">
            {copy.loadingMore}
          </div>
        </div>
      ) : null}
    </section>
  );
}
