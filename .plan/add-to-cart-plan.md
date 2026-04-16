# Mahar Sarpay Add-to-Cart & Cart Page Plan (Saved)

## Plan Update

- Date: 2026-04-15
- Summary: Implemented browser-persisted cart management, wired add-to-cart from Books and Home, added floating cart badge, and shipped localized cart page at `/:lang/cart`.

## Goal

Deliver a practical v1 shopping cart flow with persistent client-side state and a localized cart management page.

## Completed Scope

- Cart feature module added under `src/features/cart`.
- Browser persistence implemented via `localStorage` key: `maharsarpay:cart:v1`.
- Cart actions implemented:
  - `addItem`
  - `increment`
  - `decrement`
  - `remove`
  - `clear`
- Cart selectors implemented:
  - `totalItems`
  - `subtotal`
- Product identity unified via canonical `cartProductId` across:
  - Books list data model
  - Home bestsellers data model
- Add-to-cart integration completed on:
  - Books page cards
  - Home bestsellers cards
- Shared floating cart button updated to:
  - Route to `/${lang}/cart`
  - Display live quantity badge
- Localized cart page shipped at:
  - `/en/cart`
  - `/my/cart`
- Cart page behavior includes:
  - Line item list
  - Quantity +/- controls
  - Trash icon shown on decrement when qty is `1`
  - Remove action
  - Clear cart action
  - Subtotal summary
  - Empty state with continue shopping CTA

## i18n / Contracts

- Added `cartPage` dictionary contract to `src/lib/i18n/types.ts`.
- Added `cartPage` copy to:
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
- Updated Myanmar subtotal label to `စုစုပေါင်း`.

## Validation Checklist

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed (with network-enabled run for Google Fonts fetching).

## Plan Artifacts

- Add-to-cart plan: `.plan/add-to-cart-plan.md`
- Existing page plans remain in `.plan/` and `.plan/pages/`.
