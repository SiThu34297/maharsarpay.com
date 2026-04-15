# Mahar Sarpay Books Page Plan (Saved)

## Goal

Deliver a fast, responsive, Myanmar-first books listing page focused on simple discovery through search and category navigation.

## Completed Scope

- Localized Books page route implemented at `/:lang/books`.
- Shared marketing shell reused (top brand strip, sticky header, mobile menu, footer).
- Header behavior aligned with current UX:
  - `စာအုပ်များ` link shows all books.
  - Books dropdown shows category options (e.g. `ဝတ္ထု`, `သမိုင်း`) and applies category filtering.
- In-page controls simplified:
  - Search box only (`Search books, authors, categories...`).
  - Removed extra filter panels and sorting UI.
- Books list UX:
  - Responsive card grid.
  - Infinite scroll with cursor pagination.
  - Loading skeletons, load-more spinner, retry state.
  - Empty state + browse categories CTA.
- Product card interactions:
  - Local UI feedback for add-to-cart state.

## Data / Architecture

- Feature module under `src/features/books` with typed schemas and server adapter.
- API endpoint available at `/api/books` for incremental fetching.
- Query contract simplified to:
  - `q`, `category`, `cursor`, `limit`
- Filter options simplified to category options only.
- i18n dictionary/contracts for `booksList` trimmed to active UI copy only.

## Validation Checklist

- `npm run lint`
- `npm run typecheck`
- Verify navigation behavior:
  - `/:lang/books` shows all books.
  - Clicking a category from `စာအုပ်များ` dropdown filters list by that category.
- Verify URL sync behavior:
  - Search and category state reflected in URL.
  - Refresh preserves state.
- Verify infinite scroll:
  - No duplicates, stable append order, retry works.
- Verify responsive behavior at 390px, 768px, 1024px, 1440px.

## Plan Artifacts

- Books page plan: `.plan/books-plan.md`
- Legacy history log: `.plan/pages/books.md`
