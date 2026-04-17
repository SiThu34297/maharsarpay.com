# Mahar Sarpay Profile Page Plan (Saved)

## Goal

Deliver a localized user profile flow where authenticated users can view profile details and order history, and unauthenticated users are redirected to login.

## Scope Decisions

- Auth stack: Auth.js (NextAuth style).
- Login methods: Google OAuth + email/password credentials.
- Unauthorized profile access: redirect to localized login route.
- Order data in this phase: mock/in-memory placeholder only.
- Not included in this phase: signup, password reset, profile editing, real order backend integration.

## Implementation Plan

- Add Auth.js dependencies and environment contract.
- Implement centralized auth config and helpers.
- Add Auth.js App Router handlers under API routes.
- Add localized login route (`/:lang/login`) with:
  - Sign in with Google
  - Email/password login form
- Add localized profile route (`/:lang/profile`) with server-side auth guard.
- Create profile feature module (`schemas`, `server`, `components`) and render mock orders.
- Add logout action on profile page.
- Extend i18n dictionary contract and both locale dictionaries for login/profile/order labels.
- Update navigation and header account entry behavior to point to profile route.
- Preserve current locale normalization behavior in proxy and keep definitive auth checks in server route/page logic.

## Validation Checklist

- `npm install`
- `npm run lint`
- `npm run typecheck`
- Verify Google login flow.
- Verify credentials login success and failure handling.
- Verify signed-out access to profile redirects to login.
- Verify profile renders user data and mock orders when signed in.
- Verify logout behavior.
- Verify flows under both `en` and `my` localized paths.
- Verify existing locale redirect behavior remains intact.

## Plan Artifacts

- Profile page plan: `.plan/profile-plan.md`
- Legacy history log (if needed): `.plan/pages/profile.md`

## 2026-04-17 Update - Real User Orders Integration

### Goal

Replace mock profile order history with authenticated backend data from `/api/web/orders/user/{userId}` while keeping profile UX stable.

### Scope Decisions

- UI surface: profile page only (no dedicated orders page in this scope).
- Internal API route: no new app-internal user-orders route; server adapter calls backend directly.
- Failure behavior: graceful empty order state when backend fetch fails.
- Pagination: load all orders for initial release.
- Placed date mapping: derive from first available `items[].createdAt`.
- Status rendering: show backend raw status text directly.

### Implementation Steps

- Add server-only user-orders read adapter in `src/features/cart/server/` for `GET /api/web/orders/user/{userId}` using bearer token and `cache: "no-store"`.
- Reuse response parsing/error normalization patterns from existing order creation adapter.
- Replace email-based mock lookup in `src/features/profile/server/profile-adapter.ts` with backend-backed order fetch + mapping.
- Update profile schema status typing to support backend raw values.
- Update profile UI order status rendering to display raw backend status text.
- Keep profile auth gating and page orchestration unchanged.

### Mapping Rules

- `order.id` -> profile order `id`.
- `order.invoiceNo` -> profile order `orderNumber`.
- `order.totalAmount` -> profile order `totalAmount`.
- `order.items[].qty` -> profile item `quantity`.
- `order.items[].bookTitle` -> profile item `title`.
- First available `order.items[].createdAt` -> profile order `placedAt`.

### Verification

- `npm run lint`
- `npm run typecheck`
- Verify authenticated profile shows real backend orders.
- Verify empty-state fallback when backend is unavailable.
- Verify status text shows backend raw value.

## 2026-04-17 Update - Expanded Profile Details

### Goal

Show more authenticated user information on the profile page to improve account visibility.

### Scope

- Display additional profile attributes: user ID, phone number, address, login type, auth provider, and email verification state.
- Keep existing profile summary and order history layout intact.
- Use localized labels and graceful fallbacks for missing values.

### Implementation

- Extend profile summary schema with additional user detail fields.
- Map new values from authenticated session data in profile server adapter.
- Add localized copy keys in both English and Myanmar dictionaries.
- Render a details grid section on profile page with readable formatting for enum-like values.

### Verification

- `npm run lint`
- `npm run typecheck`
- Confirm both `en` and `my` profile pages show additional details.

## 2026-04-17 Update - Profile Details Simplified + Text Avatar Fallback

### Goal

Show only phone and address in profile details and stop using static default avatar images.

### Scope

- Keep details section focused to phone and address only.
- When user has no profile image, render a text-based avatar fallback using name and initials (example: `Sithu ST`).

### Implementation

- Changed profile summary image field to nullable and mapped image directly from session.
- Removed static default avatar fallback in profile adapter.
- Updated profile page to conditionally render image or text avatar fallback.
- Reduced details grid content to phone and address entries only.

### Verification

- `npm run typecheck`
- `npm run lint`

## 2026-04-17 Update - Order Amount Breakdown in Profile List

### Goal

Show order amount breakdown (subtotal, delivery fee, discount, total) in profile order cards.

### Implementation

- Added `subtotalAmount`, `deliveryFee`, and `discountAmount` to user-order adapter output.
- Mapped new fields into profile order schema and profile adapter.
- Added localized labels for subtotal, delivery fee, and discount.
- Rendered full amount breakdown in each order card with locale-aware number formatting.

### Verification

- `npm run typecheck`
- `npm run lint`

## 2026-04-17 Update - Localized Order Items and Qty Label

### Goal

Use locale dictionaries for order list items/quantity summary instead of hardcoded text.

### Implementation

- Added `orderItemsQtyLabel` to profile dictionary contract.
- Added localized label templates in English and Myanmar dictionaries.
- Updated profile order list to render localized template with locale-aware number formatting.

### Verification

- `npm run typecheck`
- `npm run lint`

## 2026-04-17 Update - Navbar Auth-Aware Profile Icon

### Goal

Show profile avatar/initials in navbar account icon slot when user is logged in, and keep original person icon for guests.

### Implementation

- Updated marketing header to read authenticated session state on server.
- Added account icon rendering rules for desktop, tablet, and mobile header variants.
- Logged-in state now shows either user image or initials fallback.
- Logged-out state preserves original `PersonIcon` appearance and behavior.

### Verification

- `npm run typecheck`
- `npm run lint`
