# Profile History

## Page

- Route: /{lang}/profile
- Owner: web team

## Entries

### 2026-04-17 - Real User Orders Integration Plan

- What changed: Added implementation plan to replace mock profile orders with backend user-order data from /api/web/orders/user/{userId}.
- Why it changed: Profile order history must reflect real user purchases instead of static demo data.
- Files touched: .plan/profile-plan.md
- Notes: Initial scope keeps profile page only, no pagination, and empty-state fallback on backend fetch failure.

### 2026-04-17 - Expanded Profile Details

- What changed: Added plan update to show more account fields on the profile page, including user ID, phone, address, login type, auth provider, and email verification.
- Why it changed: Users need more account visibility directly from their profile.
- Files touched: .plan/profile-plan.md
- Notes: Added localized labels and fallback values for missing profile attributes.

### 2026-04-17 - Simplified Details and Removed Default Avatar

- What changed: Reduced visible detail cards to phone and address only, and replaced default profile image fallback with text avatar fallback using name + initials.
- Why it changed: Keep profile details focused and avoid static default avatar imagery.
- Files touched: .plan/profile-plan.md
- Notes: Missing user image now shows text like `Sithu ST` in avatar placeholder.

### 2026-04-17 - Navbar Profile Icon by Login State

- What changed: Added auth-aware navbar account icon behavior so logged-in users see profile image/initials and logged-out users keep original person icon.
- Why it changed: Make navbar reflect login state while preserving existing guest UX.
- Files touched: .plan/profile-plan.md
- Notes: Applied to desktop, tablet, and mobile marketing headers.

### 2026-04-17 - Localized Items and Qty Label

- What changed: Replaced hardcoded `items X qty Y` with localized dictionary-driven template in profile order cards.
- Why it changed: Ensure order summary text follows selected locale.
- Files touched: .plan/profile-plan.md
- Notes: Counts are now formatted with locale-aware numerals.

### 2026-04-17 - Order Amount Breakdown in Order Cards

- What changed: Added subtotal, delivery fee, and discount fields to profile order cards alongside total amount.
- Why it changed: Make order list show full financial breakdown from backend response.
- Files touched: .plan/profile-plan.md
- Notes: Amount labels and values are localized.
