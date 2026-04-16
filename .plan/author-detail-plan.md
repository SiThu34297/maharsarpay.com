## Author Detail Page Plan (Modern Editorial)

### Summary

Build a new localized author detail route with an editorial-premium look, balanced profile + books content, and SEO-friendly URLs (`/authors/[slug]`).
The page will feel modern through large portrait hero treatment, soft layered backgrounds, clear typography hierarchy, and high-quality card layouts while staying consistent with current brand tokens.

### Implementation Changes

- Introduce a canonical author identity model in `src/features/authors/schemas/authors.ts` so list/detail/books can share one source of truth:
  - `id` (stable internal id), `slug`, `name`, `genre`, `imageSrc`, `imageAlt`, `shortBio`, `longBio`.
- Refactor author seed data in the authors adapter to emit canonical `slug/id` (not `author-list-*`) and add detail-ready fields.
- Add author detail data loaders:
  - `getAuthorBySlug(locale, slug)`
  - `getAuthorDetailPageData(locale, slug)` returning:
    - `author` profile
    - `authoredBooks` (from books adapter by `authorId`, sorted newest first, capped)
    - `relatedAuthors` (same genre first, then fallback)
    - `filterOptions` for header categories.
- Add new route `src/app/[lang]/(marketing)/authors/[slug]/page.tsx`:
  - `params: Promise<{ lang: string; slug: string }>`
  - locale validation + `notFound()` behavior
  - `generateMetadata` with localized title/description from author data.
- Build `AuthorDetailPage` UI component with section order:
  1. Breadcrumb (`Home/Authors > Author Name`)
  2. Hero (portrait, name, genre chip, short bio, primary CTA)
  3. About section (long bio)
  4. Authored books grid (book cover, title, price, link to book detail, add-to-cart)
  5. Related authors strip/grid.
- Update entry points to link into detail:
  - Authors list cards link to `/${locale}/authors/${author.slug}?from=authors`
  - Home authors cards link to `/${locale}/authors/${author.slug}?from=home`.
- Add new modern styling classes in global stylesheet (author-detail namespace) using existing tokens:
  - layered gradient surfaces, elevated cards, responsive 1/2-column transitions, reduced-motion-safe transitions.
- Extend i18n contract in `src/lib/i18n/types.ts` and both dictionaries with `authorDetail` copy keys (breadcrumb labels, section titles, CTA labels, empty states).

### Public APIs / Types to Add or Change

- `AuthorListItem` gains `slug` and standardized `id`.
- New `AuthorDetail` and `AuthorDetailPageData` types.
- Authors feature exports include detail data accessors and detail page component.
- Books adapter adds `getBooksByAuthor(locale, authorId, limit?)` for deterministic author-book lookup.

### Test Plan

1. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
2. Verify route behavior:
   - valid slug renders detail in `en` and `my`
   - unknown slug returns not-found page
   - invalid locale segment returns not-found page.
3. Verify UX flows:
   - from authors list and home authors section to detail
   - authored books link to book detail route
   - add-to-cart works from authored books cards.
4. Verify visual acceptance:
   - mobile (<768), tablet, desktop breakpoints
   - no layout shift on image load
   - readable contrast and focus states
   - reduced-motion behavior with `prefers-reduced-motion`.

### Assumptions and Defaults

- Goal confirmed: balanced profile + books.
- Style confirmed: editorial premium.
- Scope confirmed: core now, extensible later (no timeline/awards/social in v1).
- URL strategy confirmed: `/authors/[slug]`.
- Bios/metadata are seeded for now (same mock-data approach already used by books/authors); structure will remain API-ready for later backend integration.
