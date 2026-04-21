"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import type {
  BookFilterOptions,
  BookListQuery,
  BookListResponse,
} from "@/features/books/schemas/books";
import type { Dictionary, Locale } from "@/lib/i18n";

type BooksListClientProps = Readonly<{
  copy: Dictionary["booksList"];
  locale: Locale;
  initialResponse: BookListResponse;
  initialQuery: BookListQuery;
  filterOptions: BookFilterOptions;
}>;

type ActiveFilterChip = {
  key: "q" | "category";
  label: string;
};

const SKELETON_COUNT = 4;

function formatPrice(locale: Locale, value: number) {
  const grouped = groupDigits(Math.round(value));

  if (locale === "my") {
    return `${toMyanmarDigits(grouped)} ကျပ်`;
  }

  return `MMK ${grouped}`;
}

function getDiscountPricing(book: {
  price: number;
  salePrice?: number | null;
  originalPrice?: number | null;
  discountAmount?: number | null;
}) {
  const salePrice = book.salePrice && book.salePrice > 0 ? book.salePrice : book.price;
  const originalPrice =
    book.originalPrice && book.originalPrice > salePrice ? book.originalPrice : null;

  if (!originalPrice) {
    return {
      salePrice,
      originalPrice: null,
      discountAmount: null,
    };
  }

  const fallbackDiscountAmount = originalPrice - salePrice;

  return {
    salePrice,
    originalPrice,
    discountAmount: book.discountAmount ?? fallbackDiscountAmount,
  };
}

function replaceResultCount(template: string, count: number, locale: Locale) {
  const countText = locale === "my" ? toMyanmarDigits(groupDigits(count)) : groupDigits(count);
  return template.replace("{count}", countText);
}

function groupDigits(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toMyanmarDigits(value: string) {
  return value.replace(/\d/g, (digit) => String.fromCharCode(0x1040 + Number(digit)));
}

function buildBaseParams(query: BookListQuery) {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", query.q);
  }
  if (query.category) {
    params.set("category", query.category);
  }

  params.set("limit", String(query.limit));

  return params;
}

export function BooksListClient({
  copy,
  locale,
  initialResponse,
  initialQuery,
  filterOptions,
}: BooksListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState(initialResponse.items);
  const [nextCursor, setNextCursor] = useState(initialResponse.nextCursor);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [searchInput, setSearchInput] = useState(initialQuery.q ?? "");

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const categoryLabelMap = useMemo(
    () => new Map(filterOptions.categories.map((option) => [option.value, option.label])),
    [filterOptions.categories],
  );

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        q: initialQuery.q,
        category: initialQuery.category,
        limit: initialQuery.limit,
      }),
    [initialQuery.category, initialQuery.limit, initialQuery.q],
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
    if (initialQuery.category) {
      chips.push({
        key: "category",
        label: `${copy.categoryLabel}: ${
          categoryLabelMap.get(initialQuery.category) ?? initialQuery.category
        }`,
      });
    }

    return chips;
  }, [categoryLabelMap, copy.categoryLabel, initialQuery.category, initialQuery.q]);

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

      if (initialQuery.category) {
        params.set("category", initialQuery.category);
      }

      params.set("lang", locale);

      const response = await fetch(`/api/books?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load more books");
      }

      const payload = (await response.json()) as BookListResponse;

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
      params.delete("category");
    });
  }, [pushQuery]);

  const removeFilter = useCallback(
    (key: "q" | "category") => {
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

  return (
    <section className="section-gap">
      <div className="home-shell">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl text-[var(--color-text-main)] md:text-4xl">{copy.title}</h1>
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
            <div className="book-list-grid">
              {items.map((book) => {
                const pricing = getDiscountPricing(book);
                const hasDiscount =
                  Boolean(pricing.originalPrice) && (pricing.discountAmount ?? 0) > 0;
                const authorLinks =
                  book.authors.length > 0
                    ? book.authors
                    : [{ id: book.authorId, name: book.author }];

                return (
                  <article
                    key={book.id}
                    className="book-list-card book-list-card-clean flex flex-col"
                  >
                    <Link
                      href={`/${locale}/books/${book.slug}?from=books`}
                      className="book-list-image-wrap relative block overflow-hidden"
                    >
                      <Image
                        src={book.coverImageSrc}
                        alt={book.coverImageAlt}
                        width={360}
                        height={470}
                        className="book-list-image h-[300px] w-full object-cover sm:h-[330px] lg:h-[360px]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {hasDiscount ? (
                        <span className="absolute right-0 top-0 z-10 rounded-bl-md bg-[var(--color-secondary)] px-3 py-1 text-[11px] font-semibold text-white">
                          -{formatPrice(locale, pricing.discountAmount ?? 0)}
                        </span>
                      ) : null}
                    </Link>

                    <h3 className="book-list-title mt-5 text-center text-[1.05rem] text-[var(--color-text-main)] sm:text-lg">
                      <Link
                        href={`/${locale}/books/${book.slug}?from=books`}
                        className="hover:text-[var(--color-brand)]"
                      >
                        {book.title}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-1 text-center text-sm text-[var(--color-text-muted)]">
                      {authorLinks.map((author, index) => (
                        <span key={author.id}>
                          <Link
                            href={`/${locale}/authors/${encodeURIComponent(author.id)}?from=books`}
                            className="transition hover:text-[var(--color-brand)]"
                          >
                            {author.name}
                          </Link>
                          {index < authorLinks.length - 1 ? (
                            <span>{locale === "my" ? "၊ " : ", "}</span>
                          ) : null}
                        </span>
                      ))}
                    </p>

                    <div className="mt-3 flex flex-col items-center justify-center gap-1 pb-5">
                      {pricing.originalPrice ? (
                        <p className="text-xs text-[var(--color-text-muted)] line-through">
                          {formatPrice(locale, pricing.originalPrice)}
                        </p>
                      ) : null}
                      <p className="text-[1.15rem] font-semibold leading-none text-[var(--color-brand)] sm:text-[1.3rem]">
                        {formatPrice(locale, pricing.salePrice)}
                      </p>
                    </div>
                  </article>
                );
              })}

              {isFetchingMore
                ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <article
                      key={`skeleton-${index}`}
                      className="book-list-card book-list-card-clean animate-pulse"
                    >
                      <div className="h-[300px] bg-[var(--color-brand-subtle)] sm:h-[330px] lg:h-[360px]" />
                      <div className="mx-auto mt-5 h-4 w-4/5 rounded bg-[var(--color-brand-subtle)]" />
                      <div className="mx-auto mt-2 h-3 w-2/3 rounded bg-[var(--color-brand-subtle)]" />
                      <div className="mx-auto mt-4 h-8 w-28 rounded bg-[var(--color-brand-subtle)]" />
                    </article>
                  ))
                : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
              <h2 className="text-xl text-[var(--color-text-main)]">{copy.noBooksFound}</h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {copy.tryDifferentFilters}
              </p>
              <Link
                href={`/${locale}#categories`}
                className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-main)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                {copy.browseCategories}
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
