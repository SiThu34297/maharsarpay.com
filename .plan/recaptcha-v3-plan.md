# reCAPTCHA v3 Plan (Login, Register, Place Order)

Add Google reCAPTCHA v3 to credentials login, register, and place-order with client-side token generation and backend API verification only. The Next.js app will collect and forward `recaptchaToken`, enforce required-token checks locally, and map backend captcha failures to clear localized UI errors.

## Decisions

- Score threshold: 0.5
- Verification outage policy: fail-closed
- Verification owner: backend API only
- Login scope: credentials login only (Google sign-in excluded)
- Payload contract: `recaptchaToken` on login/register/place-order requests

## Steps

1. Phase 1 - Preconditions and config
   - Confirm backend API contract for all three endpoints (`recaptchaToken`, actions `login`/`register`/`place_order`, threshold 0.5, fail-closed).
   - Add public site key configuration in `.env.example` and wire runtime checks.
   - Keep backend secret key ownership outside this repo.
2. Phase 2 - Shared frontend reCAPTCHA token flow
   - Introduce a shared client-side reCAPTCHA v3 helper.
   - Add a reusable client pattern for server-action forms to inject `recaptchaToken`.
   - Add robust fallback behavior when token acquisition fails.
3. Phase 3 - Auth integration (credentials login and register)
   - Update login/register form submit flows to include token.
   - Require token in auth server actions and pass to backend adapter.
   - Extend Auth.js credentials authorize handoff to include token.
   - Extend auth payload/types/error mapping for captcha failures.
4. Phase 4 - Place-order integration
   - Update cart place-order submit flow to generate token and include it in request.
   - Require and forward token in `/api/orders` route.
   - Extend order adapter payload for backend pass-through.
   - Surface captcha-specific checkout errors.
5. Phase 5 - i18n and typing updates
   - Add captcha-related keys to dictionary types and both locale dictionaries.
   - Ensure auth/cart UIs use localized captcha messages.
6. Phase 6 - Verification and rollout
   - Verify positive and negative paths for login/register/place-order.
   - Regression checks for existing auth/cart behavior.
   - Coordinate backend deployment first (or behind feature flag).

## Dependencies and parallelism

- Backend contract blocks downstream implementation.
- Shared helper and i18n keys can proceed in parallel after config setup.
- Auth and checkout integrations can proceed in parallel after helper creation.
- Verification depends on backend readiness.

## Scope boundaries

- Included: frontend token generation, pass-through payload updates, local validation, i18n error mapping, adapter and route changes in this repo.
- Excluded: Google `siteverify` implementation and secret management in external backend API service.
