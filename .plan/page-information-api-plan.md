# Page Information API Plan

Date: 2026-04-17

## Goal

Integrate backend /api/web/pages into a server-side page-info feature, then consume it across marketing brand strip, footer/contact content, privacy-policy page, and metadata generation with static fallback safety.

## Scope

- Include: contact page content, footer org info/social links, global metadata/branding, privacy-policy page/content.
- Exclude for now: payment/app URL UI exposure (kpay/appUrl not surfaced yet).

## Product Decisions

- Record selection: use first element in response data array.
- Failure mode: fallback to existing static content.
- Privacy route: create localized route and link from footer.
- Footer support links: replace FAQ with Privacy Policy; keep Help placeholder.
- Social rendering: show only non-empty links with platform icons; hide unknown/empty entries.
- Privacy HTML safety: sanitize before rendering.
- SEO: dynamic site title should propagate to all metadata templates currently using static site title.

## Phases

1. Data foundation

- Add page-info server module under src/features.
- Fetch BOOK_API_BASE_URL + /api/web/pages with no-store and Accept-Language.
- Validate envelope and normalize nullable fields.
- Map to WebsitePageInfo and expose helpers.

2. Shared UI integration

- Replace hardcoded brand strip title/message with dynamic values.
- Update footer with dynamic contact/social and privacy link behavior.
- Keep i18n dictionary labels while swapping value sources.

3. Contact + Privacy

- Refactor contact data mapper to use page-info with fallback.
- Add localized privacy-policy route and render sanitized privacyPolicy HTML.

4. Metadata propagation

- Replace static site-title usage with dynamic site-title resolver in root and marketing metadata templates.
- Keep siteConfig fallback for failures.

5. Hardening

- Centralize sanitizer config for privacy HTML.
- Preserve behavior on missing/invalid fields.
- Remove redundant repeated hardcoded branding literals.

## Verification

1. npm run lint
2. npm run typecheck
3. npm run build
4. Manual check /my and /en home/contact/privacy content.
5. Verify metadata titles/descriptions on contact/login/profile/books detail/authors detail/multimedia detail.
6. Verify privacy HTML sanitization.
7. Simulate backend failure and confirm static fallback.
8. Confirm social link filtering and footer support-link behavior.
