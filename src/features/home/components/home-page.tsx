import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, CameraIcon, PlayIcon } from "@radix-ui/react-icons";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { buildAuthorDetailSlug } from "@/features/authors/lib/author-slug";
import { getBookFilterOptions } from "@/features/books";
import { buildMultimediaDetailSlug } from "@/features/multimedia/lib/multimedia-slug";
import { HomeHeroSlider } from "@/features/home/components/home-hero-slider";
import { getHomePageData } from "@/features/home/server/get-home-page-data";
import type { Dictionary, Locale } from "@/lib/i18n";

type HomePageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
}>;

type SectionHeadingProps = Readonly<{
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}>;

type MobileScrollViewAllCardProps = Readonly<{
  href: string;
  label: string;
  minWidthClass: string;
}>;

type ViewAllLinkProps = Readonly<{
  href: string;
  label: string;
  className?: string;
}>;

function formatPrice(locale: Locale, value: number) {
  if (locale === "my") {
    return `${new Intl.NumberFormat("my-MM", {
      maximumFractionDigits: 0,
    }).format(value)} ကျပ်`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatAuthorBookCount(template: string, locale: Locale, count: number) {
  const countText =
    locale === "my"
      ? new Intl.NumberFormat("my-MM", { maximumFractionDigits: 0 }).format(count)
      : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(count);

  return template.replace("{count}", countText);
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

function ViewAllLink({ href, label, className }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap font-semibold leading-none text-[var(--color-brand)] transition hover:text-[var(--color-brand-strong)] ${className ?? ""}`}
    >
      <span>{label}</span>
      <ArrowRightIcon className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function SectionHeading({ title, description, actionHref, actionLabel }: SectionHeadingProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl text-[var(--color-text-main)] md:text-4xl">{title}</h2>

        {actionHref && actionLabel ? (
          <ViewAllLink
            href={actionHref}
            label={actionLabel}
            className="hidden md:inline-flex md:text-sm"
          />
        ) : null}
      </div>

      <p className="mt-3 text-base text-[var(--color-text-muted)] md:text-lg">{description}</p>
    </div>
  );
}

function MobileScrollViewAllCard({ href, label, minWidthClass }: MobileScrollViewAllCardProps) {
  return (
    <li className={`${minWidthClass} snap-start flex`}>
      <ViewAllLink
        href={href}
        label={label}
        className="flex h-full min-h-[220px] w-full items-center justify-center px-2 text-center text-xs"
      />
    </li>
  );
}

function getMediaLabel(copy: Dictionary["media"], mediaType: "video" | "photo") {
  return mediaType === "video" ? "Blog" : "Photo Essay";
}

export async function HomePage({ copy, locale }: HomePageProps) {
  const [data, bookFilterOptions] = await Promise.all([
    getHomePageData(locale),
    getBookFilterOptions(locale),
  ]);
  const isMyanmar = locale === "my";
  const navigation = getMarketingNavigation(locale);
  const bookCategoryLinks = bookFilterOptions.categories.map((category) => ({
    label: category.label,
    href: `/${locale}/books?category=${encodeURIComponent(category.value)}`,
  }));
  const photoMediaItems = data.mediaItems.filter((item) => item.mediaType === "photo");
  const videoMediaItems = data.mediaItems.filter((item) => item.mediaType === "video");

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <MarketingSiteHeader
        copy={copy}
        locale={locale}
        navigation={navigation}
        activeNavId="home"
        bookCategoryLinks={bookCategoryLinks}
      />

      <main>
        <section className="mb-8 w-full md:mb-12 lg:mb-16">
          <HomeHeroSlider
            slides={data.heroSlides}
            previousLabel={copy.hero.previousSlide}
            nextLabel={copy.hero.nextSlide}
          />
        </section>

        <section id="books" className="home-shell section-gap">
          <SectionHeading
            title={copy.bestsellers.title}
            description={copy.bestsellers.description}
            actionHref={`/${locale}/books`}
            actionLabel={copy.bookDetail.viewAllBooks}
          />

          <div className="md:hidden">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {data.books.map((book) => {
                const pricing = getDiscountPricing(book);
                const hasDiscount =
                  Boolean(pricing.originalPrice) && (pricing.discountAmount ?? 0) > 0;
                const authorLinks =
                  book.authors.length > 0
                    ? book.authors
                    : [{ id: book.authorId, name: book.author }];

                return (
                  <li
                    key={book.id}
                    className="book-list-card book-list-card-clean min-w-[230px] snap-start flex flex-col"
                  >
                    <Link
                      href={`/${locale}/books/${book.slug}?from=home`}
                      className="book-list-image-wrap relative block overflow-hidden"
                    >
                      <Image
                        src={book.imageSrc}
                        alt={book.imageAlt}
                        width={320}
                        height={420}
                        className="book-list-image h-[300px] w-full object-cover"
                      />
                      {hasDiscount ? (
                        <span className="absolute right-0 top-0 z-10 rounded-bl-md bg-[var(--color-secondary)] px-3 py-1 text-[11px] font-semibold text-white">
                          -{formatPrice(locale, pricing.discountAmount ?? 0)}
                        </span>
                      ) : null}
                    </Link>
                    <h3 className="book-list-title mt-1.5 text-center text-base font-semibold leading-snug text-[var(--color-text-main)] sm:text-[1.05rem]">
                      <Link
                        href={`/${locale}/books/${book.slug}?from=home`}
                        className="line-clamp-2 hover:text-[var(--color-brand)]"
                      >
                        {book.title}
                      </Link>
                    </h3>
                    <p className="-mt-0.5 min-h-[1.25rem] line-clamp-1 px-4 text-center text-sm text-[var(--color-text-muted)]">
                      {authorLinks.map((author, index) => (
                        <span key={author.id}>
                          <Link
                            href={`/${locale}/authors/${buildAuthorDetailSlug({
                              id: author.id,
                              name: author.name,
                            })}?from=home`}
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
                    <div className="mt-1 flex items-center justify-center gap-2 pb-2">
                      <p className="text-[1.15rem] font-semibold leading-none text-[var(--color-brand)] sm:text-[1.3rem]">
                        {formatPrice(locale, pricing.salePrice)}
                      </p>
                      {pricing.originalPrice ? (
                        <p className="text-xs text-[var(--color-text-muted)] line-through">
                          {formatPrice(locale, pricing.originalPrice)}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}

              <MobileScrollViewAllCard
                href={`/${locale}/books`}
                label={copy.bookDetail.viewAllBooks}
                minWidthClass="min-w-[230px]"
              />
            </ul>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.books.map((book) => {
              const pricing = getDiscountPricing(book);
              const hasDiscount =
                Boolean(pricing.originalPrice) && (pricing.discountAmount ?? 0) > 0;
              const authorLinks =
                book.authors.length > 0 ? book.authors : [{ id: book.authorId, name: book.author }];

              return (
                <article
                  key={book.id}
                  className="book-list-card book-list-card-clean flex flex-col"
                >
                  <Link
                    href={`/${locale}/books/${book.slug}?from=home`}
                    className="book-list-image-wrap relative block overflow-hidden"
                  >
                    <Image
                      src={book.imageSrc}
                      alt={book.imageAlt}
                      width={320}
                      height={420}
                      className="book-list-image h-[340px] w-full object-cover"
                    />
                    {hasDiscount ? (
                      <span className="absolute right-0 top-0 z-10 rounded-bl-md bg-[var(--color-secondary)] px-3 py-1 text-[11px] font-semibold text-white">
                        -{formatPrice(locale, pricing.discountAmount ?? 0)}
                      </span>
                    ) : null}
                  </Link>
                  <h3 className="book-list-title mt-1.5 text-center text-base font-semibold leading-snug text-[var(--color-text-main)] sm:text-[1.05rem]">
                    <Link
                      href={`/${locale}/books/${book.slug}?from=home`}
                      className="hover:text-[var(--color-brand)]"
                    >
                      {book.title}
                    </Link>
                  </h3>
                  <p className="-mt-0.5 min-h-[1.25rem] line-clamp-1 px-4 text-center text-sm text-[var(--color-text-muted)]">
                    {authorLinks.map((author, index) => (
                      <span key={author.id}>
                        <Link
                          href={`/${locale}/authors/${buildAuthorDetailSlug({
                            id: author.id,
                            name: author.name,
                          })}?from=home`}
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
                  <div className="mt-1 flex items-center justify-center gap-2 pb-2">
                    <p className="text-[1.15rem] font-semibold leading-none text-[var(--color-brand)] sm:text-[1.3rem]">
                      {formatPrice(locale, pricing.salePrice)}
                    </p>
                    {pricing.originalPrice ? (
                      <p className="text-xs text-[var(--color-text-muted)] line-through">
                        {formatPrice(locale, pricing.originalPrice)}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="authors" className="home-shell section-gap">
          <SectionHeading
            title={copy.authors.title}
            description={copy.authors.description}
            actionHref={`/${locale}/authors`}
            actionLabel={copy.authorDetail.viewAllAuthors}
          />

          <div className="md:hidden">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {data.authors.map((author) => (
                <li key={author.id} className="home-card min-w-[200px] snap-start text-center">
                  <Link
                    href={`/${locale}/authors/${buildAuthorDetailSlug(author)}?from=home`}
                    className="block"
                  >
                    <Image
                      src={author.imageSrc}
                      alt={author.imageAlt}
                      width={152}
                      height={152}
                      className="mx-auto h-[120px] w-[120px] rounded-full border border-[var(--color-border)] object-cover"
                    />
                  </Link>
                  <h3 className="mt-4 text-lg">
                    <Link
                      href={`/${locale}/authors/${buildAuthorDetailSlug(author)}?from=home`}
                      className="hover:text-[var(--color-brand)]"
                    >
                      {author.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-brand)]">
                    {formatAuthorBookCount(
                      copy.authors.bookCountTemplate,
                      locale,
                      author.bookCount,
                    )}
                  </p>
                </li>
              ))}

              <MobileScrollViewAllCard
                href={`/${locale}/authors`}
                label={copy.authorDetail.viewAllAuthors}
                minWidthClass="min-w-[200px]"
              />
            </ul>
          </div>

          <div className="hidden gap-5 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data.authors.map((author) => (
              <article key={author.id} className="home-card text-center">
                <Link
                  href={`/${locale}/authors/${buildAuthorDetailSlug(author)}?from=home`}
                  className="block"
                >
                  <Image
                    src={author.imageSrc}
                    alt={author.imageAlt}
                    width={160}
                    height={160}
                    className="mx-auto h-[124px] w-[124px] rounded-full border border-[var(--color-border)] object-cover"
                  />
                </Link>
                <h3 className="mt-4 text-lg">
                  <Link
                    href={`/${locale}/authors/${buildAuthorDetailSlug(author)}?from=home`}
                    className="hover:text-[var(--color-brand)]"
                  >
                    {author.name}
                  </Link>
                </h3>
                <p className="mt-1 text-xs font-semibold text-[var(--color-brand)]">
                  {formatAuthorBookCount(copy.authors.bookCountTemplate, locale, author.bookCount)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="media" className="home-shell section-gap">
          <SectionHeading
            title={copy.media.title}
            description={copy.media.description}
            actionHref={`/${locale}/multimedia`}
            actionLabel={copy.multimediaDetail.viewAllMedia}
          />

          <div className="space-y-8 md:space-y-10">
            {photoMediaItems.length > 0 ? (
              <section>
                <h3 className="mb-4 text-2xl text-[var(--color-text-main)]">Photo Essay</h3>
                <div className="md:hidden">
                  <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                    {photoMediaItems.map((item) => (
                      <li key={item.id} className="home-card min-w-[250px] snap-start">
                        <div className="relative">
                          <Link
                            href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                          >
                            <Image
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              width={380}
                              height={250}
                              className="h-[160px] w-full rounded-xl object-cover"
                            />
                          </Link>
                          <span
                            className="media-type-pill media-type-pill-photo"
                            aria-label={getMediaLabel(copy.media, item.mediaType)}
                          >
                            <CameraIcon />
                            <span>{getMediaLabel(copy.media, item.mediaType)}</span>
                          </span>
                        </div>
                        <h4 className="mt-4 text-lg">
                          <Link
                            href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                            className="hover:text-[var(--color-brand)]"
                          >
                            {item.title}
                          </Link>
                        </h4>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
                  {photoMediaItems.map((item) => (
                    <article key={item.id} className="home-card">
                      <div className="relative">
                        <Link
                          href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                        >
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            width={420}
                            height={265}
                            className="h-[180px] w-full rounded-xl object-cover"
                          />
                        </Link>
                        <span
                          className="media-type-pill media-type-pill-photo"
                          aria-label={getMediaLabel(copy.media, item.mediaType)}
                        >
                          <CameraIcon />
                          <span>{getMediaLabel(copy.media, item.mediaType)}</span>
                        </span>
                      </div>
                      <h4 className="mt-4 text-xl">
                        <Link
                          href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                          className="hover:text-[var(--color-brand)]"
                        >
                          {item.title}
                        </Link>
                      </h4>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {videoMediaItems.length > 0 ? (
              <section>
                <h3 className="mb-4 text-2xl text-[var(--color-text-main)]">Blog</h3>
                <div className="md:hidden">
                  <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                    {videoMediaItems.map((item) => (
                      <li key={item.id} className="home-card min-w-[250px] snap-start">
                        <div className="relative">
                          <Link
                            href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                          >
                            <Image
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              width={380}
                              height={250}
                              className="h-[160px] w-full rounded-xl object-cover"
                            />
                          </Link>
                          <span
                            className="media-type-pill media-type-pill-video"
                            aria-label={getMediaLabel(copy.media, item.mediaType)}
                          >
                            <PlayIcon />
                            <span>{getMediaLabel(copy.media, item.mediaType)}</span>
                          </span>
                        </div>
                        <h4 className="mt-4 text-lg">
                          <Link
                            href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                            className="hover:text-[var(--color-brand)]"
                          >
                            {item.title}
                          </Link>
                        </h4>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                          {item.description}
                        </p>
                      </li>
                    ))}

                    <MobileScrollViewAllCard
                      href={`/${locale}/multimedia`}
                      label={copy.multimediaDetail.viewAllMedia}
                      minWidthClass="min-w-[250px]"
                    />
                  </ul>
                </div>

                <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
                  {videoMediaItems.map((item) => (
                    <article key={item.id} className="home-card">
                      <div className="relative">
                        <Link
                          href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                        >
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            width={420}
                            height={265}
                            className="h-[180px] w-full rounded-xl object-cover"
                          />
                        </Link>
                        <span
                          className="media-type-pill media-type-pill-video"
                          aria-label={getMediaLabel(copy.media, item.mediaType)}
                        >
                          <PlayIcon />
                          <span>{getMediaLabel(copy.media, item.mediaType)}</span>
                        </span>
                      </div>
                      <h4 className="mt-4 text-xl">
                        <Link
                          href={`/${locale}/multimedia/${buildMultimediaDetailSlug(item)}?from=home`}
                          className="hover:text-[var(--color-brand)]"
                        >
                          {item.title}
                        </Link>
                      </h4>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </main>
      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
