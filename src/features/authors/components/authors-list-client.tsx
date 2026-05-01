"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { buildAuthorDetailSlug } from "@/features/authors/lib/author-slug";
import type { AuthorListQuery, AuthorListResponse } from "@/features/authors/schemas/authors";
import type { Dictionary, Locale } from "@/lib/i18n";

type AuthorsListClientProps = Readonly<{
  copy: Dictionary["authorsList"];
  locale: Locale;
  initialResponse: AuthorListResponse;
  initialQuery: AuthorListQuery;
}>;

const SKELETON_COUNT = 4;

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

function replaceAuthorBookCount(template: string, count: number, locale: Locale) {
  const countText = locale === "my" ? toMyanmarDigits(groupDigits(count)) : groupDigits(count);
  return template.replace("{count}", countText);
}

export function AuthorsListClient({
  copy,
  locale,
  initialResponse,
  initialQuery,
}: AuthorsListClientProps) {
  const [items, setItems] = useState(initialResponse.items);
  const [nextCursor, setNextCursor] = useState(initialResponse.nextCursor);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        limit: initialQuery.limit,
      }),
    [initialQuery.limit],
  );

  useEffect(() => {
    setItems(initialResponse.items);
    setNextCursor(initialResponse.nextCursor);
    setLoadMoreError(false);
  }, [initialQuery, initialResponse.items, initialResponse.nextCursor, queryKey]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isFetchingMore) {
      return;
    }

    setIsFetchingMore(true);
    setLoadMoreError(false);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(initialQuery.limit));

      const nextOffset = Number(nextCursor);
      const page =
        Number.isFinite(nextOffset) && nextOffset >= 0
          ? Math.floor(nextOffset / initialQuery.limit) + 1
          : 1;
      params.set("page", String(page));

      if (initialQuery.q) {
        params.set("searchName", initialQuery.q);
      }

      params.set("lang", locale);

      const response = await fetch(`/api/authors?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load more authors");
      }

      const payload = (await response.json()) as AuthorListResponse;

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
    if (!nextCursor || isFetchingMore) {
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
  }, [isFetchingMore, loadMore, nextCursor, queryKey]);

  return (
    <section className="section-gap">
      <div className="home-shell">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl text-[var(--color-text-main)] md:text-4xl">{copy.title}</h1>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            {replaceResultCount(copy.showingResults, initialResponse.total, locale)}
          </p>
        </div>

        <div>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-6">
              {items.map((author) => {
                const authorDetailSlug = buildAuthorDetailSlug({
                  id: author.id,
                  name: author.name,
                });

                return (
                  <article key={author.id} className="book-list-card rounded-none">
                    <Link
                      href={`/${locale}/authors/${authorDetailSlug}?from=authors`}
                      className="relative block overflow-hidden rounded-none"
                    >
                      <Image
                        src={author.imageSrc}
                        alt={author.imageAlt}
                        width={192}
                        height={192}
                        className="mx-auto h-[192px] w-[192px] object-cover"
                        sizes="192px"
                      />
                    </Link>

                    <h2 className="mt-3 text-lg font-semibold text-[var(--color-text-main)]">
                      <Link href={`/${locale}/authors/${authorDetailSlug}?from=authors`}>
                        {author.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-[var(--color-brand)]">
                      {replaceAuthorBookCount(copy.bookCountTemplate, author.bookCount, locale)}
                    </p>
                  </article>
                );
              })}

              {isFetchingMore
                ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <article
                      key={`skeleton-${index}`}
                      className="book-list-card rounded-none animate-pulse"
                    >
                      <div className="mx-auto h-[192px] w-[192px] rounded-none bg-[var(--color-brand-subtle)]" />
                      <div className="mt-3 h-4 w-2/3 rounded bg-[var(--color-brand-subtle)]" />
                    </article>
                  ))
                : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
              <h2 className="text-xl text-[var(--color-text-main)]">{copy.noAuthorsFound}</h2>
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
    </section>
  );
}
