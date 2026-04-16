# Categories Plan

Date: 2026-04-16
Scope: Data layer only

## Goal

Add a categories data layer that fetches from https://bookapi.sabahna.com/api/web/categories through server-side code and exposes normalized data via an internal Next API route. Use the same Myanmar category names for both en and my locales in this phase.

## Decisions

- Included: categories data layer only.
- Excluded: categories UI page, navigation changes, category detail page.
- Locale behavior: use Myanmar backend names for both locales.
- Fetch strategy: server-side through internal app route only.

## Implementation Steps

1. Add categories schema contracts.

- Create src/features/categories/schemas/categories.ts.
- Define backend envelope types for /api/web/categories.
- Define internal list/query response types aligned with existing list APIs.

2. Add categories server adapter.

- Create src/features/categories/server/categories-adapter.ts.
- Implement parseCategoryListQueryFromSearchParams.
- Implement parseCategoryListQueryFromObject.
- Implement normalizeCategoryListQuery.
- Implement searchCategories(locale, query).
- In searchCategories, fetch backend data, normalize items, apply q filtering, and cursor/limit pagination.

3. Add feature exports.

- Create src/features/categories/index.ts.
- Export schema and adapter APIs.

4. Add internal API route.

- Create src/app/api/categories/route.ts.
- Parse lang with defaultLocale/hasLocale.
- Parse query with parseCategoryListQueryFromSearchParams.
- Call searchCategories and return JSON.

5. Add configuration note.

- Use BOOK_API_BASE_URL env key with fallback to https://bookapi.sabahna.com.
- Document this in README.

6. Verify.

- Run npm run lint and npm run typecheck.
- Validate:
  - /api/categories?lang=my
  - /api/categories?lang=en
  - /api/categories?q=<myanmar-text>
  - /api/categories?limit=5 and cursor follow-up

## Risks

- Backend shape drift from provided sample.
- Backend unavailability should return clear API error.
- No translation layer yet for English category names.
