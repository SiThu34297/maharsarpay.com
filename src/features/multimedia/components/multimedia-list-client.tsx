"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { CameraIcon, Cross2Icon, MagnifyingGlassIcon, PlayIcon } from "@radix-ui/react-icons";

import type {
  MediaListQuery,
  MediaListResponse,
  MediaType,
} from "@/features/multimedia/schemas/multimedia";
import type { Dictionary, Locale } from "@/lib/i18n";

type MultimediaListClientProps = Readonly<{
  copy: Dictionary["multimediaList"];
  locale: Locale;
  initialResponse: MediaListResponse;
  initialQuery: MediaListQuery;
}>;

type ActiveFilterChip = {
  key: "q" | "mediaType";
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

function replaceResultCount(template: string, count: number, locale: Locale) {
  const countText = locale === "my" ? toMyanmarDigits(groupDigits(count)) : groupDigits(count);
  return template.replace("{count}", countText);
}

function buildBaseParams(query: MediaListQuery) {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", query.q);
  }
  if (query.mediaType) {
    params.set("mediaType", query.mediaType);
  }

  params.set("limit", String(query.limit));

  return params;
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

function getMediaTypeLabel(copy: Dictionary["multimediaList"], mediaType: MediaType) {
  return mediaType === "video" ? copy.videoFilterLabel : copy.photoFilterLabel;
}

export function MultimediaListClient({
  copy,
  locale,
  initialResponse,
  initialQuery,
}: MultimediaListClientProps) {
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
        mediaType: initialQuery.mediaType,
        limit: initialQuery.limit,
      }),
    [initialQuery.limit, initialQuery.mediaType, initialQuery.q],
  );

  useEffect(() => {
    setItems(initialResponse.items);
    setNextCursor(initialResponse.nextCursor);
    setLoadMoreError(false);
    setSearchInput(initialQuery.q ?? "");
  }, [initialQuery, initialResponse.items, initialResponse.nextCursor, queryKey]);

  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];

    if (initialQuery.q) {
      chips.push({ key: "q", label: initialQuery.q });
    }

    if (initialQuery.mediaType) {
      chips.push({
        key: "mediaType",
        label: `${copy.mediaTypeLabel}: ${getMediaTypeLabel(copy, initialQuery.mediaType)}`,
      });
    }

    return chips;
  }, [copy, initialQuery.mediaType, initialQuery.q]);

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

      const response = await fetch(`/api/media?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load more media");
      }

      const payload = (await response.json()) as MediaListResponse;

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
      params.delete("mediaType");
    });
  }, [pushQuery]);

  const removeFilter = useCallback(
    (key: "q" | "mediaType") => {
      pushQuery((params) => {
        params.delete(key);
      });
    },
    [pushQuery],
  );

  const setMediaTypeFilter = useCallback(
    (mediaType?: MediaType) => {
      pushQuery((params) => {
        if (mediaType) {
          params.set("mediaType", mediaType);
        } else {
          params.delete("mediaType");
        }
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

  return (
    <section className="section-gap">
      <div className="home-shell">
        <div className="multimedia-hero">
          <p className="multimedia-hero-badge">{copy.heroBadge}</p>
          <h1 className="mt-2 text-3xl text-[var(--color-text-main)] md:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
            {copy.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className={`multimedia-filter-chip ${
                !initialQuery.mediaType ? "multimedia-filter-chip-active" : ""
              }`}
              onClick={() => setMediaTypeFilter(undefined)}
            >
              {copy.allFilterLabel}
            </button>
            <button
              type="button"
              className={`multimedia-filter-chip ${
                initialQuery.mediaType === "video" ? "multimedia-filter-chip-active" : ""
              }`}
              onClick={() => setMediaTypeFilter("video")}
            >
              {copy.videoFilterLabel}
            </button>
            <button
              type="button"
              className={`multimedia-filter-chip ${
                initialQuery.mediaType === "photo" ? "multimedia-filter-chip-active" : ""
              }`}
              onClick={() => setMediaTypeFilter("photo")}
            >
              {copy.photoFilterLabel}
            </button>
          </div>
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
                className="rounded-full bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-95"
              >
                {copy.searchButton}
              </button>
            </form>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            {replaceResultCount(copy.showingResults, initialResponse.total, locale)}
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <article key={item.id} className="multimedia-list-card">
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={420}
                      height={265}
                      className="h-[210px] w-full object-cover sm:h-[230px]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <span
                      className={`media-type-pill ${
                        item.mediaType === "video"
                          ? "media-type-pill-video"
                          : "media-type-pill-photo"
                      }`}
                      aria-label={getMediaTypeLabel(copy, item.mediaType)}
                    >
                      {item.mediaType === "video" ? <PlayIcon /> : <CameraIcon />}
                      <span>{getMediaTypeLabel(copy, item.mediaType)}</span>
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-[var(--color-text-main)] sm:text-xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {item.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--color-brand)]">
                    {copy.byLabel} {item.creator}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {copy.publishedOnLabel} {formatDate(locale, item.publishedAt)}
                  </p>
                </article>
              ))}

              {isFetchingMore
                ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <article
                      key={`skeleton-${index}`}
                      className="multimedia-list-card animate-pulse"
                    >
                      <div className="h-[210px] rounded-xl bg-[var(--color-brand-subtle)] sm:h-[230px]" />
                      <div className="mt-3 h-4 w-4/5 rounded bg-[var(--color-brand-subtle)]" />
                      <div className="mt-2 h-3 w-2/3 rounded bg-[var(--color-brand-subtle)]" />
                      <div className="mt-3 h-3 w-1/2 rounded bg-[var(--color-brand-subtle)]" />
                    </article>
                  ))
                : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
              <h2 className="text-xl text-[var(--color-text-main)]">{copy.noMediaFound}</h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {copy.tryDifferentFilters}
              </p>
              <Link
                href={`/${locale}`}
                className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                {copy.browseHome}
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
