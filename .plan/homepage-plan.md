# Mahar Sarpay Homepage Plan (Saved)

## Plan Update

- Date: 2026-04-15
- Summary: Moved floating cart button into shared marketing header so it appears on every marketing page, and removed the duplicate home-only button.

## Goal

Deliver a Myanmar-first bookstore homepage that is clean, modern, responsive, and ready for future data/API integration.

## Completed Scope

- Full homepage sections implemented:
  - Top brand section
  - Responsive navbar
  - Hero slider (multi-slide)
  - Categories, bestsellers, featured authors, multimedia, reviews, promo, footer
- Myanmar-first behavior:
  - Locale routing forced to `/my`
  - Localization switch removed from navbar
- Navbar action simplification:
  - Removed search and wishlist
  - Kept user profile
  - Added floating cart button (icon-only)
- Multimedia enhancements:
  - Supports both `photo` and `video` media types with badges
- Real image migration:
  - Replaced placeholder visuals with local real image assets
- Readability and copy updates:
  - Myanmar typography tuning (smaller type + larger line-height)
  - Currency display format updated to `ကျပ်`
  - Brand wording standardized to `မဟာစာပေ`

## Data / Architecture

- Feature-based structure kept under `src/features/home`
- Typed seed data and schemas for books/authors/media/reviews/promo
- Bilingual dictionaries maintained, with Myanmar-first routing behavior

## Validation Checklist

- `npm run lint`
- `npm run typecheck`
- Responsive checks at 390px, 768px, 1024px, 1440px
- Verify hero slider behavior and multimedia type badges
- Verify floating cart button visibility and non-overlap

## Plan Artifacts

- Home page plan: `.plan/homepage-plan.md`
- Page plans directory (legacy): `.plan/pages/`
