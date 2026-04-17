## Plan: Web Auth and Protected Book Orders

Implement backend-driven email signup/login through Auth.js, persist authenticated user identity plus auth token in session flow, and enforce login before placing book orders to /api/web/orders. This approach reuses existing Auth.js route/actions and current cart/profile architecture with minimal disruption.

**Steps**

1. Phase 1 - Auth contract and adapter foundation.
1. Add a dedicated server auth adapter for backend endpoints /api/web/users/auth/register and /api/web/users/auth/login with typed request/response parsing, normalized error mapping, and BOOK_API_BASE_URL usage.
1. Define shared auth domain types for backend user payload fields (id, email, name, phoneNumber, address, authToken, etc.) and explicit error codes (email_in_use, invalid_credentials, missing_fields, unknown).
1. Add/update environment documentation for backend auth integration and remove dependency on demo-only behavior for production path.

1. Phase 2 - Wire Auth.js credentials provider to backend login (depends on Phase 1).
1. Update Auth.js credentials authorize flow in src/auth.ts to call backend login adapter instead of verifyDemoCredentials.
1. Extend Auth.js callbacks to persist backend user identity + authToken in JWT/session in a controlled shape that can be consumed by server actions and protected API routes.
1. Preserve existing Google provider behavior and keep current redirect/error flow compatibility.

1. Phase 3 - Signup and login UX updates (parallel with late Phase 2 callback polish).
1. Add register route and register page component under [lang]/(marketing), following the existing login page layout pattern and i18n structure.
1. Extend auth server actions with register action that submits required fields (email, password, name, phoneNumber, address), handles backend error states (especially Email already in use), and auto-signs in user on success.
1. Extend auth error schema and localized dictionaries to include registration and backend error messages; keep existing login error parsing behavior intact.
1. Add login/register cross-links and callback/next handling consistent with getSafeRedirectPath and buildLoginRedirectPath.

1. Phase 4 - Protect and execute book order placement (depends on Phase 2).
1. Add a server-side order action/adapter for POST /api/web/orders with payload mapping from cart state and authenticated user context: userId from session, items bookId/qty, customerPhone, customerName, shippingAddress, note.
1. Attach Authorization Bearer authToken from authenticated session on order requests and normalize 401/403 handling to login redirect behavior.
1. Add cart checkout entry point and enforce login before order submission; unauthenticated users redirect to /{lang}/login?next=... as agreed.
1. On successful order placement, clear cart state and redirect to profile/orders confirmation state.

1. Phase 5 - Profile/order consistency updates (depends on Phase 4).
1. Replace or gate current mock order-history assumptions so profile reflects real backend order results where available.
1. Keep safe fallback behavior if backend order list is unavailable, while not breaking authenticated user profile rendering.

**Decisions**

- Token storage: Keep backend authToken inside Auth.js JWT/session flow (not localStorage).
- Signup behavior: Auto-login immediately after successful registration.
- Register fields: email, password, name, phoneNumber, and address are all required.
- Order auth enforcement: redirect unauthenticated checkout attempts to login with next return URL.
- Order API contract provided: POST /api/web/orders with payload { userId, items[{bookId, qty}], customerPhone, customerName, shippingAddress, note }.
