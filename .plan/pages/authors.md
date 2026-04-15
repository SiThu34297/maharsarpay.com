# Authors Page History

## Page

- Route: `/:lang/authors`
- Owner: Marketing / Frontend

## Entries

### 2026-04-15 - Remove Genre/Category Text From Author Cards

- What changed:
  - Removed genre/category-like text rendering (for example, `စာပေရေးရာဝတ္ထု`) from each author card.
  - Updated author search behavior to match author names only (no genre matching).
  - Updated Authors page search copy in both locales to reference author-name search only.
- Why it changed:
  - Authors page should not present categories/genres as part of the author list experience.
- Files touched:
  - `src/features/authors/components/authors-list-client.tsx`
  - `src/features/authors/server/authors-adapter.ts`
  - `src/features/authors/schemas/authors.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
  - `.plan/pages/authors.md`
- Notes:
  - Authors navigation category removal from the previous entry remains unchanged.

### 2026-04-15 - Remove Categories Nav From Authors Page

- What changed:
  - Removed `အမျိုးအစား / Categories` navigation visibility for the Authors page shell.
  - Updated Authors page to pass category-filtered navigation into shared header and footer.
  - This also removes the Books submenu category entry on Authors page mobile/desktop nav.
- Why it changed:
  - Authors page does not require category navigation and should keep a simpler menu.
- Files touched:
  - `src/features/authors/components/authors-page.tsx`
  - `.plan/pages/authors.md`
- Notes:
  - Home and Books pages keep existing categories navigation behavior.

### 2026-04-15 - Authors List Page V1 (Search + Infinite Scroll)

- What changed:
  - Added a dedicated localized Authors route at `/:lang/authors`.
  - Implemented URL-synced search box (`q`) with sticky search UI, active filter chip, and clear-search behavior.
  - Added cursor-based infinite scroll with loading skeletons, retry on load-more failure, and empty-state fallback.
  - Added API-backed mock adapter at `/api/authors` and typed author list contracts for future backend replacement.
  - Updated top navigation `စာရေးသူများ/Authors` to route to the new authors page.
  - Added localized `authorsList` dictionary copy and typings for both `en` and `my`.
- Why it changed:
  - To provide a dedicated author discovery experience with the same interaction model as the books list page.
- Files touched:
  - `src/app/[lang]/(marketing)/authors/page.tsx`
  - `src/app/api/authors/route.ts`
  - `src/features/authors/components/authors-page.tsx`
  - `src/features/authors/components/authors-list-client.tsx`
  - `src/features/authors/server/authors-adapter.ts`
  - `src/features/authors/server/get-authors-page-data.ts`
  - `src/features/authors/schemas/authors.ts`
  - `src/features/authors/index.ts`
  - `src/components/layout/marketing/navigation.ts`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
- Notes:
  - Current data source is mock seeded content in the authors adapter; this can be replaced by a backend/CMS source later without changing page UI contracts.
