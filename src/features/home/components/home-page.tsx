import Image from "next/image";
import Link from "next/link";

import { CameraIcon, PlayIcon } from "@radix-ui/react-icons";

import {
  MarketingSiteFooter,
  MarketingSiteHeader,
  MarketingTopBrandStrip,
  getMarketingNavigation,
} from "@/components/layout/marketing";
import { getBookFilterOptions } from "@/features/books";
import { HomeHeroSlider } from "@/features/home/components/home-hero-slider";
import { getHomePageData } from "@/features/home/server/get-home-page-data";
import type { Dictionary, Locale } from "@/lib/i18n";
import { HomeAddToCartButton } from "./home-add-to-cart-button";

type HomePageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
}>;

type SectionHeadingProps = Readonly<{
  title: string;
  description: string;
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

function renderStars(rating: number) {
  const fullStars = Math.round(rating);
  return `${"★".repeat(fullStars)}${"☆".repeat(Math.max(5 - fullStars, 0))}`;
}

function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-3xl text-[var(--color-text-main)] md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
        {description}
      </p>
    </div>
  );
}

function getMediaLabel(copy: Dictionary["media"], mediaType: "video" | "photo") {
  return mediaType === "video" ? copy.videoLabel : copy.photoLabel;
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
  const categoryHrefByLabel = new Map(
    bookCategoryLinks.map((category) => [category.label, category.href]),
  );

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <MarketingTopBrandStrip
        title="မဟာစာပေ"
        message="သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့"
      />
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

        <section id="categories" className="home-shell pb-5">
          <SectionHeading
            title={copy.categorySpotlight.title}
            description={copy.categorySpotlight.description}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {data.categories.map((category) => (
              <Link
                key={category.id}
                href={
                  categoryHrefByLabel.get(category.name) ??
                  `/${locale}/books?q=${encodeURIComponent(category.name)}`
                }
                className="category-chip"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        <section id="books" className="home-shell section-gap">
          <SectionHeading
            title={copy.bestsellers.title}
            description={copy.bestsellers.description}
          />

          <div className="md:hidden">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {data.books.map((book) => (
                <li key={book.id} className="home-card min-w-[230px] snap-start">
                  <Image
                    src={book.imageSrc}
                    alt={book.imageAlt}
                    width={320}
                    height={420}
                    className="h-[220px] w-full rounded-xl object-cover"
                  />
                  <h3 className="mt-4 text-lg leading-snug">{book.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{book.author}</p>
                  <p className="mt-3 text-base font-semibold text-[var(--color-brand)]">
                    {formatPrice(locale, book.price)}
                  </p>
                  <HomeAddToCartButton
                    book={book}
                    addLabel={copy.bestsellers.addToCart}
                    addedLabel={copy.booksList.addedToCart}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.books.map((book) => (
              <article key={book.id} className="home-card">
                <Image
                  src={book.imageSrc}
                  alt={book.imageAlt}
                  width={320}
                  height={420}
                  className="h-[250px] w-full rounded-xl object-cover"
                />
                <h3 className="mt-4 text-xl leading-snug">{book.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{book.author}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-base font-semibold text-[var(--color-brand)]">
                    {formatPrice(locale, book.price)}
                  </p>
                </div>
                <HomeAddToCartButton
                  book={book}
                  addLabel={copy.bestsellers.addToCart}
                  addedLabel={copy.booksList.addedToCart}
                />
              </article>
            ))}
          </div>
        </section>

        <section id="authors" className="home-shell section-gap">
          <SectionHeading title={copy.authors.title} description={copy.authors.description} />

          <div className="md:hidden">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {data.authors.map((author) => (
                <li key={author.id} className="home-card min-w-[200px] snap-start text-center">
                  <Image
                    src={author.imageSrc}
                    alt={author.imageAlt}
                    width={152}
                    height={152}
                    className="mx-auto h-[120px] w-[120px] rounded-full border border-[var(--color-border)] object-cover"
                  />
                  <h3 className="mt-4 text-lg">{author.name}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{author.genre}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden gap-5 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data.authors.map((author) => (
              <article key={author.id} className="home-card text-center">
                <Image
                  src={author.imageSrc}
                  alt={author.imageAlt}
                  width={160}
                  height={160}
                  className="mx-auto h-[124px] w-[124px] rounded-full border border-[var(--color-border)] object-cover"
                />
                <h3 className="mt-4 text-lg">{author.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{author.genre}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="media" className="home-shell section-gap">
          <SectionHeading title={copy.media.title} description={copy.media.description} />

          <div className="md:hidden">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {data.mediaItems.map((item) => (
                <li key={item.id} className="home-card min-w-[250px] snap-start">
                  <div className="relative">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={380}
                      height={250}
                      className="h-[160px] w-full rounded-xl object-cover"
                    />
                    <span
                      className={`media-type-pill ${
                        item.mediaType === "video"
                          ? "media-type-pill-video"
                          : "media-type-pill-photo"
                      }`}
                      aria-label={getMediaLabel(copy.media, item.mediaType)}
                    >
                      {item.mediaType === "video" ? <PlayIcon /> : <CameraIcon />}
                      <span>{getMediaLabel(copy.media, item.mediaType)}</span>
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
            {data.mediaItems.map((item) => (
              <article key={item.id} className="home-card">
                <div className="relative">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    width={420}
                    height={265}
                    className="h-[180px] w-full rounded-xl object-cover"
                  />
                  <span
                    className={`media-type-pill ${
                      item.mediaType === "video" ? "media-type-pill-video" : "media-type-pill-photo"
                    }`}
                    aria-label={getMediaLabel(copy.media, item.mediaType)}
                  >
                    {item.mediaType === "video" ? <PlayIcon /> : <CameraIcon />}
                    <span>{getMediaLabel(copy.media, item.mediaType)}</span>
                  </span>
                </div>
                <h3 className="mt-4 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-shell section-gap">
          <SectionHeading title={copy.reviews.title} description={copy.reviews.description} />

          <div className="md:hidden">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {data.reviews.map((review) => (
                <li key={review.id} className="home-card min-w-[260px] snap-start">
                  <p
                    className="text-sm text-[var(--color-text-muted)]"
                    aria-label={`${review.rating} stars`}
                  >
                    {renderStars(review.rating)}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-[var(--color-text-main)]">
                    “{review.quote}”
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[var(--color-brand)]">
                    {review.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
            {data.reviews.map((review) => (
              <article key={review.id} className="home-card">
                <p
                  className="text-sm text-[var(--color-text-muted)]"
                  aria-label={`${review.rating} stars`}
                >
                  {renderStars(review.rating)}
                </p>
                <p className="mt-4 text-base leading-relaxed text-[var(--color-text-main)]">
                  “{review.quote}”
                </p>
                <p className="mt-5 text-sm font-semibold text-[var(--color-brand)]">
                  {review.name}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-shell pb-14 pt-4 md:pb-20">
          <div className="rounded-[24px] border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] p-6 md:p-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
              {data.promo.badge}
            </p>
            <h2 className="text-3xl text-[var(--color-text-main)] md:text-4xl">
              {data.promo.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
              {data.promo.description}
            </p>
            <Link
              href={data.promo.ctaHref}
              className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {copy.promo.cta}
            </Link>
          </div>
        </section>
      </main>
      <MarketingSiteFooter copy={copy} navigation={navigation} />
    </div>
  );
}
