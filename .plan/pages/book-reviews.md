# Book Reviews Page History

## Page

- Route: `/:lang/book-reviews`
- Owner: Marketing / Frontend

## Entries

### 2026-04-18 - Book Reviews Section V1 (Menu + List + Detail)

- What changed:
  - Added new top-level marketing navigation item for Book Reviews (`စာဖတ်သူတို့စာညွှန်းများ`) between Media and Contact.
  - Added localized list page route at `/:lang/book-reviews` with infinite scroll and URL-synced search (`q`, `cursor`, `limit`).
  - Added localized detail page route at `/:lang/book-reviews/:id`.
  - Added internal API route at `/api/book-reviews` for load-more requests.
  - Implemented backend adapter mapping UI query params to backend query params (`q/cursor/limit` -> `searchName/page/limit`).
  - Added EN/MY dictionary keys and i18n type contracts for book review list/detail copy.
  - Added `/book-reviews` to sitemap public routes.
- Why it changed:
  - To launch a dedicated reader-review experience and expose it from primary navigation.
- Files touched:
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
  - `.plan/book-reviews-plan.md`
  - `.plan/pages/book-reviews.md`
- Notes:
  - Backend list response has no `total`; UI shows loaded-count only (`Showing {count} reviews loaded`).
  - Detail pages sanitize review HTML before rendering.
