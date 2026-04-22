"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  PlayIcon,
} from "@radix-ui/react-icons";

import type {
  MediaListResponse,
  MediaType,
  MultimediaPageData,
} from "@/features/multimedia/schemas/multimedia";
import type { Dictionary, Locale } from "@/lib/i18n";

type MultimediaListClientProps = Readonly<{
  copy: Dictionary["multimediaList"];
  locale: Locale;
  initialPhotoResponse: MediaListResponse;
  initialBlogResponse: MediaListResponse;
  initialQuery: MultimediaPageData["initialQuery"];
}>;

type ActiveFilterChip = {
  key: "q";
  label: string;
};

type MediaSection = "photo" | "blog";

const MULTIMEDIA_DISPLAY_LOCALE: Locale = "en";
const PAGINATION_SLOT_COUNT = 8;
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

function buildBaseParams(query: MultimediaPageData["initialQuery"]) {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", query.q);
  }

  params.set("limit", String(query.limit));
  params.set("photoPage", String(Math.max(1, query.photoPage)));
  params.set("blogPage", String(Math.max(1, query.blogPage)));

  return params;
}

function buildPageSlots(currentPage: number, totalPages: number) {
  const start = Math.floor((currentPage - 1) / PAGINATION_SLOT_COUNT) * PAGINATION_SLOT_COUNT + 1;

  return Array.from({ length: PAGINATION_SLOT_COUNT }, (_, index) => {
    const page = start + index;
    return page <= totalPages ? page : null;
  });
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
  return mediaType === "video" ? "Blog" : "Photo Essay";
}

function getTotalPages(response: MediaListResponse, currentPage: number, limit: number) {
  const calculated = Math.ceil(response.total / limit);
  const knownPage = Number.isFinite(calculated) && calculated > 0 ? calculated : 1;

  if (response.nextCursor) {
    return Math.max(knownPage, currentPage + 1);
  }

  return Math.max(knownPage, currentPage);
}

function SectionPagination({
  label,
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  pageSlots,
  isPending,
  onPageChange,
}: {
  label: string;
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  pageSlots: Array<number | null>;
  isPending: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="py-2">
      <div className="mb-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
          {label}: Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isPending}
          className="inline-flex h-10 min-w-24 items-center justify-center gap-1.5 rounded-md border border-[#d9d9df] bg-[#f4f4f5] px-3 text-lg font-medium text-[#42424a] transition hover:bg-[#ececef] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Prev</span>
        </button>
        {pageSlots.map((page, index) => {
          if (page === null) {
            return (
              <div
                key={`slot-${index}`}
                className="h-10 w-12 rounded-md border border-dashed border-[#d9d9df] bg-[#f4f4f5]"
                aria-hidden
              />
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={isPending || isActive}
              aria-current={isActive ? "page" : undefined}
              className={`h-10 w-12 rounded-md border text-lg font-medium transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-[#d9d9df] bg-[#f4f4f5] text-[#42424a] hover:bg-[#ececef]"
              } disabled:cursor-not-allowed disabled:opacity-80`}
            >
              {page}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isPending}
          className="inline-flex h-10 min-w-24 items-center justify-center gap-1.5 rounded-md border border-[#d9d9df] bg-[#f4f4f5] px-3 text-lg font-medium text-[#42424a] transition hover:bg-[#ececef] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span>Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export function MultimediaListClient({
  copy,
  locale,
  initialPhotoResponse,
  initialBlogResponse,
  initialQuery,
}: MultimediaListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [searchInputDraft, setSearchInputDraft] = useState<string | null>(null);
  const searchInput = searchInputDraft ?? initialQuery.q ?? "";

  const photoItems = initialPhotoResponse.items;
  const blogItems = initialBlogResponse.items;
  const totalCount = initialPhotoResponse.total + initialBlogResponse.total;

  const photoTotalPages = useMemo(
    () => getTotalPages(initialPhotoResponse, initialQuery.photoPage, initialQuery.limit),
    [initialPhotoResponse, initialQuery.limit, initialQuery.photoPage],
  );
  const blogTotalPages = useMemo(
    () => getTotalPages(initialBlogResponse, initialQuery.blogPage, initialQuery.limit),
    [initialBlogResponse, initialQuery.blogPage, initialQuery.limit],
  );

  const photoPageSlots = useMemo(
    () => buildPageSlots(initialQuery.photoPage, photoTotalPages),
    [initialQuery.photoPage, photoTotalPages],
  );
  const blogPageSlots = useMemo(
    () => buildPageSlots(initialQuery.blogPage, blogTotalPages),
    [blogTotalPages, initialQuery.blogPage],
  );

  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    if (!initialQuery.q) {
      return [];
    }

    return [{ key: "q", label: initialQuery.q }];
  }, [initialQuery.q]);

  const hasAnyFilter = activeFilterChips.length > 0;
  const hasPrevPhotoPage = initialQuery.photoPage > 1;
  const hasNextPhotoPage =
    Boolean(initialPhotoResponse.nextCursor) || initialQuery.photoPage < photoTotalPages;
  const hasPrevBlogPage = initialQuery.blogPage > 1;
  const hasNextBlogPage =
    Boolean(initialBlogResponse.nextCursor) || initialQuery.blogPage < blogTotalPages;

  const pushQuery = useCallback(
    (updateFn: (params: URLSearchParams) => void) => {
      const params = buildBaseParams(initialQuery);
      updateFn(params);

      const queryString = params.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [initialQuery, pathname, router],
  );

  const gotoPage = useCallback(
    (section: MediaSection, page: number) => {
      setSearchInputDraft(null);

      pushQuery((params) => {
        if (section === "photo") {
          params.set("photoPage", String(Math.max(1, page)));
          return;
        }

        params.set("blogPage", String(Math.max(1, page)));
      });
    },
    [pushQuery],
  );

  const clearAllFilters = useCallback(() => {
    setSearchInputDraft(null);

    pushQuery((params) => {
      params.delete("q");
      params.set("photoPage", "1");
      params.set("blogPage", "1");
    });
  }, [pushQuery]);

  const removeFilter = useCallback(() => {
    setSearchInputDraft(null);

    pushQuery((params) => {
      params.delete("q");
      params.set("photoPage", "1");
      params.set("blogPage", "1");
    });
  }, [pushQuery]);

  const onSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSearchInputDraft(null);

      pushQuery((params) => {
        if (searchInput.trim()) {
          params.set("q", searchInput.trim());
        } else {
          params.delete("q");
        }

        params.set("photoPage", "1");
        params.set("blogPage", "1");
      });
    },
    [pushQuery, searchInput],
  );

  return (
    <section className="section-gap">
      <div className="home-shell">
        <div className="mb-5 md:mb-6">
          <h1 className="text-3xl text-[var(--color-text-main)] md:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
            {copy.description}
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
                onChange={(event) => setSearchInputDraft(event.target.value)}
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
            {replaceResultCount(copy.showingResults, totalCount, MULTIMEDIA_DISPLAY_LOCALE)}
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
                onClick={removeFilter}
                aria-label={`${copy.removeFilterLabel}: ${chip.label}`}
              >
                <span>{chip.label}</span>
                <Cross2Icon />
              </button>
            ))}
          </div>
        ) : null}

        {photoItems.length > 0 || blogItems.length > 0 ? (
          <div className="space-y-8 md:space-y-10">
            <section>
              <h2 className="mb-4 text-2xl text-[var(--color-text-main)] md:text-3xl">
                Photo Essay
              </h2>
              {photoItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {photoItems.map((item) => (
                    <article key={item.id} className="multimedia-list-card">
                      <div className="relative overflow-hidden rounded-xl">
                        <Link href={`/${locale}/multimedia/${item.slug}?from=multimedia`}>
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            width={420}
                            height={265}
                            className="h-[210px] w-full object-cover sm:h-[230px]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                        </Link>
                        <span
                          className="media-type-pill media-type-pill-photo"
                          aria-label={getMediaTypeLabel(copy, item.mediaType)}
                        >
                          <CameraIcon />
                          <span>{getMediaTypeLabel(copy, item.mediaType)}</span>
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold text-[var(--color-text-main)] sm:text-xl">
                        <Link href={`/${locale}/multimedia/${item.slug}?from=multimedia`}>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--color-brand)]">
                        {copy.byLabel} {item.creator}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {copy.publishedOnLabel}{" "}
                        {formatDate(MULTIMEDIA_DISPLAY_LOCALE, item.publishedAt)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">{copy.noMediaFound}</p>
              )}

              <div className="mt-5">
                <SectionPagination
                  label="Photo Essay"
                  currentPage={initialQuery.photoPage}
                  totalPages={photoTotalPages}
                  hasPrevPage={hasPrevPhotoPage}
                  hasNextPage={hasNextPhotoPage}
                  pageSlots={photoPageSlots}
                  isPending={isPending}
                  onPageChange={(page) => gotoPage("photo", page)}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl text-[var(--color-text-main)] md:text-3xl">Blog</h2>
              {blogItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {blogItems.map((item) => (
                    <article key={item.id} className="multimedia-list-card">
                      <div className="relative overflow-hidden rounded-xl">
                        <Link href={`/${locale}/multimedia/${item.slug}?from=multimedia`}>
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            width={420}
                            height={265}
                            className="h-[210px] w-full object-cover sm:h-[230px]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                        </Link>
                        <span
                          className="media-type-pill media-type-pill-video"
                          aria-label={getMediaTypeLabel(copy, item.mediaType)}
                        >
                          <PlayIcon />
                          <span>{getMediaTypeLabel(copy, item.mediaType)}</span>
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold text-[var(--color-text-main)] sm:text-xl">
                        <Link href={`/${locale}/multimedia/${item.slug}?from=multimedia`}>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--color-brand)]">
                        {copy.byLabel} {item.creator}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {copy.publishedOnLabel}{" "}
                        {formatDate(MULTIMEDIA_DISPLAY_LOCALE, item.publishedAt)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">{copy.noMediaFound}</p>
              )}

              <div className="mt-5">
                <SectionPagination
                  label="Blog"
                  currentPage={initialQuery.blogPage}
                  totalPages={blogTotalPages}
                  hasPrevPage={hasPrevBlogPage}
                  hasNextPage={hasNextBlogPage}
                  pageSlots={blogPageSlots}
                  isPending={isPending}
                  onPageChange={(page) => gotoPage("blog", page)}
                />
              </div>
            </section>
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
