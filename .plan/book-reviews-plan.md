# Mahar Sarpay Book Reviews Plan (Saved)

## Goal

Add a new localized Book Reviews section with:

- new menu entry: `စာဖတ်သူတို့စာညွှန်းများ`
- list page with infinite scroll
- detail page per review ID

## Approved Product Decisions

- Detail route: `/:lang/book-reviews/:id`
- Browser query style: `q`, `cursor`, `limit`
- Backend query mapping: `searchName`, `page`, `limit`
- List card style: rich card (reviewer name, book title+cover, excerpt, date, optional reviewer image)
- Menu placement: between Media and Contact
- Result count behavior: loaded count only (backend list response has no total)

## Implementation Phases

1. Framework guardrails

- Align with local Next.js App Router docs for `generateMetadata` and route handlers.

2. Feature module foundation

- Create `src/features/book-reviews` with schemas, adapter, list/detail page-data loaders, and feature barrel exports.
- Integrate backend endpoints:
  - `/api/web/book-reviews`
  - `/api/web/book-reviews/{id}`

3. Pagination translation

- Convert UI cursor offset to backend page:
  - `page = floor(cursor / limit) + 1`
- Determine `nextCursor` from returned item count.
- End pagination when returned count `< limit`.

4. Internal API route

- Add `src/app/api/book-reviews/route.ts` using existing locale/query parsing conventions.

5. UI implementation

- Create list shell + infinite-scroll client component.
- Create detail page component with safe rich text rendering.

6. App Router routes + metadata

- Add list route `src/app/[lang]/(marketing)/book-reviews/page.tsx`.
- Add detail route `src/app/[lang]/(marketing)/book-reviews/[id]/page.tsx`.
- Add metadata via shared `buildRouteMetadata`.

7. Navigation + i18n + sitemap

- Add navigation ID and labels.
- Add EN/MY dictionary entries and type contracts.
- Add `/book-reviews` to sitemap public routes.

8. Validation

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Manual checks: menu visibility, list search, infinite load, detail rendering, metadata and sitemap.

## Planned File Set

- `src/components/layout/marketing/navigation.ts`
- `src/lib/i18n/types.ts`
- `src/lib/i18n/dictionaries/en.ts`
- `src/lib/i18n/dictionaries/my.ts`
- `src/app/sitemap.ts`
- `src/app/api/book-reviews/route.ts`
- `src/app/[lang]/(marketing)/book-reviews/page.tsx`
- `src/app/[lang]/(marketing)/book-reviews/[id]/page.tsx`
- `src/features/book-reviews/index.ts`
- `src/features/book-reviews/schemas/book-reviews.ts`
- `src/features/book-reviews/server/book-reviews-adapter.ts`
- `src/features/book-reviews/server/get-book-reviews-page-data.ts`
- `src/features/book-reviews/server/get-book-review-detail-page-data.ts`
- `src/features/book-reviews/components/book-reviews-page.tsx`
- `src/features/book-reviews/components/book-reviews-list-client.tsx`
- `src/features/book-reviews/components/book-review-detail-page.tsx`
