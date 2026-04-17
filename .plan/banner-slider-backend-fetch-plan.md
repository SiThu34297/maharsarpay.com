# Banner Slider Backend Fetch Plan

## Plan Update

- Date: 2026-04-17
- Summary: Integrate homepage hero banner slider with backend `/api/web/banner-images`, including responsive image source selection and action routing behavior.

## Goal

Replace static homepage hero slides with backend-driven banners while preserving robust fallback behavior and existing slider UX.

## Scope

- Backend base URL: `https://bookapi.sabahna.com` via `BOOK_API_BASE_URL` fallback.
- Endpoint: `/api/web/banner-images`.
- Locale behavior: backend Myanmar content reused for both `en` and `my`.
- Responsive image behavior:
  - Desktop + tablet: `webImage`
  - Mobile: `mobileImage`
- Action behavior:
  - `EXTERNAL`: open new tab.
  - `DEEPLINK`: internal route navigation.
  - Missing/invalid action URL: slide is not clickable.
- Deeplink normalization:
  - Convert `/book/:id` to `/{locale}/books/:id`.

## Implementation Plan

1. Add banner fetch adapter under home server layer.
1. Validate payload and map backend records to hero slide contract.
1. Filter records by `active === 1` and `deletedStatus === 0`.
1. Integrate adapter into `getHomePageData(locale)` and preserve static fallback slides.
1. Update hero slider component to:

- render `mobileImage` on mobile and `webImage` on tablet/desktop.
- make entire slide clickable when valid action exists.
- keep controls and dot navigation working.

1. Run lint and typecheck.
1. Update home page plan history.

## Files To Touch

- `src/features/home/server/banner-images-adapter.ts` (new)
- `src/features/home/server/get-home-page-data.ts`
- `src/features/home/schemas/home.ts`
- `src/features/home/components/home-hero-slider.tsx`
- `.plan/pages/home.md`

## Validation

- `npm run lint`
- `npm run typecheck`
- Manual checks:
  - Mobile uses `mobileImage`.
  - Tablet/desktop uses `webImage`.
  - `EXTERNAL` opens new tab.
  - `DEEPLINK` navigates internally.
  - Invalid/missing URL yields non-clickable slide.
  - Slider autoplay, arrows, and dots still function.
