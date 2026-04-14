import Image from "next/image";
import Link from "next/link";

import {
  BackpackIcon,
  CameraIcon,
  GlobeIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  PersonIcon,
  PlayIcon,
} from "@radix-ui/react-icons";

import { HomeHeroSlider } from "@/features/home/components/home-hero-slider";
import { HomePageMobileHeader } from "@/features/home/components/home-page-mobile-header";
import { getHomePageData } from "@/features/home/server/get-home-page-data";
import type { NavItem } from "@/features/home/schemas/home";
import type { Dictionary, Locale } from "@/lib/i18n";

type HomePageProps = Readonly<{
  copy: Dictionary;
  locale: Locale;
}>;

type SectionHeadingProps = Readonly<{
  title: string;
  description: string;
}>;

function getNavigationLabel(copy: Dictionary["navigation"], id: NavItem["id"]) {
  switch (id) {
    case "home":
      return copy.home;
    case "books":
      return copy.books;
    case "authors":
      return copy.authors;
    case "categories":
      return copy.categories;
    case "media":
      return copy.media;
    case "contact":
      return copy.contact;
    default:
      return copy.home;
  }
}

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
  const data = await getHomePageData(locale);
  const isMyanmar = locale === "my";

  return (
    <div
      id="top"
      className={`min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-main)] ${
        isMyanmar ? "locale-my" : ""
      }`}
    >
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="home-shell py-4 md:py-5">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
            <Image
              src="/images/brand/maharsarpay-logo.png"
              alt="မဟာစာပေ logo"
              width={500}
              height={219}
              className="h-16 w-auto object-contain md:h-20"
              priority
            />
            <h2 className="text-2xl font-semibold text-[var(--color-text-main)] md:text-3xl">
              မဟာစာပေ
            </h2>
            <p className="max-w-3xl text-sm text-[var(--color-text-muted)] md:text-base">
              သိမ်းထားတဲ့အရာတွေ ပုပ်သိုးမသွားခင် လိုအပ်သူကို ပေးအပ်လိုက်ဖို့ ၀န်မလေးပါနဲ့
            </p>
          </div>
        </div>
      </section>

      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-md">
        <div className="home-shell hidden h-20 items-center gap-8 xl:grid xl:grid-cols-[1fr_auto_1fr]">
          <div aria-hidden />

          <nav aria-label={copy.header.desktopNavigationLabel}>
            <ul className="flex items-center justify-center gap-5 lg:gap-7">
              {data.navigation.map((item) => {
                const isActive = item.id === "home";
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                    >
                      {getNavigationLabel(copy.navigation, item.id)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2 lg:gap-3">
            <button type="button" className="icon-button" aria-label={copy.header.accountLabel}>
              <PersonIcon />
            </button>
          </div>
        </div>

        <div className="home-shell hidden items-center gap-3 py-3 md:flex xl:hidden">
          <nav
            aria-label={copy.header.desktopNavigationLabel}
            className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap pb-1"
          >
            <ul className="flex w-max items-center gap-5 pr-2">
              {data.navigation.map((item) => {
                const isActive = item.id === "home";
                return (
                  <li key={`tablet-${item.id}`}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                    >
                      {getNavigationLabel(copy.navigation, item.id)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            className="icon-button shrink-0"
            aria-label={copy.header.accountLabel}
          >
            <PersonIcon />
          </button>
        </div>

        <HomePageMobileHeader copy={copy} navigation={data.navigation} />
      </header>

      <Link
        href="#books"
        aria-label={copy.header.cartLabel}
        className="fixed bottom-6 right-5 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-[0_10px_24px_rgba(122,172,35,0.4)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] md:right-7"
      >
        <BackpackIcon />
      </Link>

      <main>
        <section className="mb-8 w-full md:mb-12 lg:mb-16">
          <HomeHeroSlider slides={data.heroSlides} />
        </section>

        <section id="categories" className="home-shell pb-5">
          <SectionHeading
            title={copy.categorySpotlight.title}
            description={copy.categorySpotlight.description}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {data.categories.map((category) => (
              <div key={category.id} className="category-chip">
                {category.name}
              </div>
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
                  <p
                    className="mt-2 text-sm text-[var(--color-text-muted)]"
                    aria-label={`${book.rating} stars`}
                  >
                    {renderStars(book.rating)}
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-full bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
                  >
                    {copy.bestsellers.addToCart}
                  </button>
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
                  <p
                    className="text-sm text-[var(--color-text-muted)]"
                    aria-label={`${book.rating} stars`}
                  >
                    {renderStars(book.rating)}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-full bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
                >
                  {copy.bestsellers.addToCart}
                </button>
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

      <footer id="contact" className="border-t border-[var(--color-border)] bg-white">
        <div className="home-shell py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <h3 className="text-xl font-semibold">{copy.header.logo}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {copy.footer.description}
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold">{copy.footer.navigationTitle}</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {data.navigation.map((item) => (
                  <li key={`footer-nav-${item.id}`}>
                    <Link href={item.href} className="footer-link">
                      {getNavigationLabel(copy.navigation, item.id)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold">{copy.footer.supportTitle}</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="#" className="footer-link">
                    {copy.footer.supportFaq}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="footer-link">
                    {copy.footer.supportHelp}
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="footer-link">
                    {copy.footer.supportContact}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold">{copy.footer.contactTitle}</h4>
              <div className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
                <p>{copy.footer.address}</p>
                <p>{copy.footer.phone}</p>
                <p>{copy.footer.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t border-[var(--color-border)] pt-6 md:mt-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium text-[var(--color-text-main)]">
                {copy.footer.newsletterLabel}
              </p>
              <form className="flex max-w-md flex-wrap gap-2" action="#" method="post">
                <label htmlFor="newsletter-email" className="sr-only">
                  {copy.footer.newsletterLabel}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={copy.footer.newsletterPlaceholder}
                  className="min-w-[220px] flex-1 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-brand)]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
                >
                  {copy.footer.newsletterButton}
                </button>
              </form>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">
                {copy.footer.socialLabel}
              </span>
              <Link href="#" className="icon-button" aria-label="Global">
                <GlobeIcon />
              </Link>
              <Link href="#" className="icon-button" aria-label="Instagram">
                <InstagramLogoIcon />
              </Link>
              <Link href="#" className="icon-button" aria-label="LinkedIn">
                <LinkedInLogoIcon />
              </Link>
            </div>
          </div>

          <p className="mt-6 text-xs text-[var(--color-text-muted)]">{copy.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
