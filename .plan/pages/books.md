# Books Page History

## Page

- Route: `/:lang/books`
- Owner: Marketing / Frontend

## Entries

### 2026-04-16 - Inline Hover Zoom on Main Detail Photo (No Side Pane)

- What changed:
  - Removed separate side zoom preview pane from detail image interaction.
  - Removed hover lens overlay.
  - Updated zoom behavior to magnify directly inside the main photo on hover and follow cursor position.
- Why it changed:
  - To match requested behavior: zoom directly on the same photo without showing another preview container.
- Files touched:
  - `src/features/books/components/book-detail-image-preview.tsx`
  - `src/styles/globals.css`
  - `.plan/pages/books.md`
- Notes:
  - Multi-image grid selector remains unchanged and still controls the active photo.

### 2026-04-16 - Multi-Image Grid View on Book Detail Preview

- What changed:
  - Extended book detail data with `galleryImages` array.
  - Seeded each book detail with multiple gallery images for preview browsing.
  - Updated detail preview to consume gallery image list (instead of single cover image).
  - Switched preview selector from strip-style thumbnails to a multi-image grid view.
- Why it changed:
  - To support requested multiple image grid viewing in detail preview experience.
- Files touched:
  - `src/features/books/schemas/books.ts`
  - `src/features/books/server/books-adapter.ts`
  - `src/features/books/components/book-detail-page.tsx`
  - `src/styles/globals.css`
  - `.plan/pages/books.md`
- Notes:
  - Active image still supports desktop hover zoom pane behavior.

### 2026-04-16 - Alibaba-Style Book Image Preview with Zoom

- What changed:
  - Added interactive image preview component for book detail hero with:
    - main image area
    - thumbnail selector
    - hover lens
    - desktop zoom preview pane
  - Wired book detail hero to use the new zoomable preview component.
  - Added detail image preview styles for desktop zoom behavior and mobile-safe fallback.
- Why it changed:
  - To match requested Alibaba-like product image inspection experience.
- Files touched:
  - `src/features/books/components/book-detail-image-preview.tsx`
  - `src/features/books/components/book-detail-page.tsx`
  - `src/styles/globals.css`
  - `.plan/pages/books.md`
- Notes:
  - Zoom pane is enabled for pointer/hover desktop environments and degrades gracefully on touch devices.

### 2026-04-15 - Remove Rating and Stock Text from Book Detail Hero

- What changed:
  - Removed star rating display (`★★★★★` + numeric value) from book detail hero section.
  - Removed stock status badge text (`လက်ကျန်ရှိ` / `Out of Stock`) from book detail hero section.
- Why it changed:
  - To keep the detail hero cleaner and match latest UI requirement.
- Files touched:
  - `src/features/books/components/book-detail-page.tsx`
  - `.plan/pages/books.md`
- Notes:
  - Book data model still retains `rating` and `inStock` fields for future use if needed.

### 2026-04-15 - Source-Aware Breadcrumb on Book Detail

- What changed:
  - Updated book detail route to read `from` query source (`home` or `books`).
  - Updated breadcrumb rendering:
    - from Home -> `ပင်မ / <စာအုပ်အမည်>`
    - from Books list -> `စာအုပ်များ / <စာအုပ်အမည်>`
  - Updated books list card links to include `?from=books`.
  - Updated related books links on detail page to preserve current breadcrumb source.
- Why it changed:
  - To make breadcrumb path reflect the actual entry context as requested.
- Files touched:
  - `src/app/[lang]/(marketing)/books/[slug]/page.tsx`
  - `src/features/books/components/book-detail-page.tsx`
  - `src/features/books/components/books-list-client.tsx`
  - `.plan/pages/books.md`
- Notes:
  - Unknown/missing source falls back to books context.

### 2026-04-15 - Book Detail Page V1 (Modern Layout + Dynamic Slug Route)

- What changed:
  - Added localized dynamic route for book details at `/:lang/books/[slug]`.
  - Implemented dynamic metadata generation from book data for detail pages.
  - Added modern detail layout including breadcrumb, hero cover + primary CTA, key metadata cards, and related books.
  - Added slug-based linking from books list cards (image/title now navigate to detail).
  - Extended books schemas/adapter with detail-safe fields (`slug`, `description`, `publishYear`, `pageCount`, `language`, `format`, `isbn`, `inStock`).
  - Added new books adapter helpers for detail and recommendations:
    - `getBookBySlug`
    - `getRelatedBooks`
  - Added new localized `bookDetail` dictionary contract for English and Myanmar.
  - Added dedicated detail-page styling utilities in global styles.
- Why it changed:
  - To introduce a complete modern book detail experience while preserving existing books list behavior and shared marketing shell consistency.
- Files touched:
  - `src/app/[lang]/(marketing)/books/[slug]/page.tsx`
  - `src/features/books/components/book-detail-page.tsx`
  - `src/features/books/server/books-adapter.ts`
  - `src/features/books/server/get-book-detail-page-data.ts`
  - `src/features/books/schemas/books.ts`
  - `src/features/books/components/books-list-client.tsx`
  - `src/features/books/index.ts`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
  - `src/styles/globals.css`
  - `.plan/books-detail-plan.md`
  - `.plan/pages/books.md`
- Notes:
  - Detail page data is still mock-seeded in the adapter and ready for future backend swap.

### 2026-04-15 - Revert Add-to-Cart CTA to Full Original Text

- What changed:
  - Removed mobile-only short CTA labels for add-to-cart button on books cards.
  - Restored original full localized text for all breakpoints.
- Why it changed:
  - To keep button copy consistent and match requested original wording.
- Files touched:
  - `src/features/books/components/books-list-client.tsx`
- Notes:
  - Button state text remains dictionary-driven (`addToCart` / `addedToCart`) on every screen size.

### 2026-04-15 - Books Grid Mobile Single Column

- What changed:
  - Updated books list grid layout to render one card per row on mobile.
  - Preserved existing multi-column behavior from `sm` and above.
- Why it changed:
  - To improve readability and tap comfort on small screens.
- Files touched:
  - `src/features/books/components/books-list-client.tsx`
- Notes:
  - Mobile breakpoint now uses `grid-cols-1`; `sm+` remains `2/3/4` columns by breakpoint.

### 2026-04-15 - Responsive Add-to-Cart Button Labels on Book Cards

- What changed:
  - Updated add-to-cart CTA on books cards to use responsive label lengths.
  - Mobile (`<sm`) now shows compact text with icon:
    - Myanmar: `ထည့်` / `ထည့်ပြီး`
    - English: `Add` / `Added`
  - Desktop (`sm+`) keeps full existing localized labels from dictionary.
  - Added explicit `aria-label` on the button using full action text for accessibility.
- Why it changed:
  - To reduce visual crowding on small screens while preserving clarity and accessibility.
- Files touched:
  - `src/features/books/components/books-list-client.tsx`
- Notes:
  - Icons now appear for both states (`Plus` when idle, `Check` when added).

### 2026-04-15 - Remove Wishlist and Rating from Book Cards

- What changed:
  - Removed wishlist button/icon from each books list card.
  - Removed star rating display from each books list card.
  - Kept title, author, price, and add-to-cart interaction unchanged.
  - Removed now-unused wishlist/rating UI logic in client component state/render path.
- Why it changed:
  - To simplify book card UI per latest requirement.
- Files touched:
  - `src/features/books/components/books-list-client.tsx`
- Notes:
  - This change applies to cards rendered on the `/:lang/books` page.

### 2026-04-15 - Mobile Navbar Expandable Books Submenu + Scrollable Overflow

- What changed:
  - Updated shared marketing mobile header used on the Books page.
  - Changed `စာအုပ်များ` categories from always-visible into expandable/collapsible submenu.
  - Added max-height + scroll behavior for large category lists and for overall mobile menu content.
  - Preserved close-on-select behavior for both primary nav links and category links.
- Why it changed:
  - To keep mobile navigation manageable when category data grows and improve submenu interaction clarity.
- Files touched:
  - `src/components/layout/marketing/marketing-mobile-header.tsx`
- Notes:
  - Shared header update also affects Home route behavior.

### 2026-04-14 - Books List V1 Implementation

- What changed:
  - Added a dedicated localized books list route at `/:lang/books`.
  - Implemented responsive books listing UI with URL-synced search, filtering, sorting, result chips, and infinite scroll.
  - Added loading skeletons, empty state, and load-more error retry path.
  - Added API-backed mock adapter (`/api/books`) and typed books feature contracts for easy backend swap later.
  - Extracted shared marketing shell components (top brand strip, sticky header/mobile nav, footer) and reused them on Home and Books pages.
  - Extended localization dictionaries and i18n types with `booksList` copy for `en` and `my`.
- Why it changed:
  - To support scalable book discovery and browsing while keeping homepage visual consistency and `.plan` history conventions.
- Files touched:
  - `src/app/[lang]/(marketing)/books/page.tsx`
  - `src/app/api/books/route.ts`
  - `src/features/books/components/books-page.tsx`
  - `src/features/books/components/books-list-client.tsx`
  - `src/features/books/server/books-adapter.ts`
  - `src/features/books/server/get-books-page-data.ts`
  - `src/features/books/schemas/books.ts`
  - `src/components/layout/marketing/*`
  - `src/features/home/components/home-page.tsx`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
- Notes:
  - Cart and wishlist are UI-interactive with local optimistic feedback only in this version.

### 2026-04-15 - Books List Refactor (Search + Category Only)

- What changed:
  - Refactored books listing controls to keep only the search box filter in-page.
  - Kept category filtering through the `စာအုပ်များ` navigation dropdown (all books from `စာအုပ်များ`, category-specific view from dropdown items).
  - Removed sorting and non-essential filters (author, price, rating, availability) from the books query contract and adapter logic.
  - Simplified `booksList` i18n shape by removing unused filter/sort copy keys in both English and Myanmar dictionaries.
  - Reduced filter options payload to category options only.
- Why it changed:
  - To align the page behavior with the latest UX direction: simple search UX plus quick category drill-down from the header.
- Files touched:
  - `src/features/books/components/books-list-client.tsx`
  - `src/features/books/schemas/books.ts`
  - `src/features/books/server/books-adapter.ts`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
