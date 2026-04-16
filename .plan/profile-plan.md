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
