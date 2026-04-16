## Plan: Backend Books Fetch Integration

Switch the books domain from seed-only data to backend-driven data via https://bookapi.sabahna.com/api/web/books, while preserving resilience with seed fallback. Reuse current architecture patterns from categories/authors adapters, keep API/list/detail/home flows aligned, and show 8 random books on home from backend data. For localization, use backend Myanmar content as-is for both en and my.

**Steps**

1. Phase 1: Contract and schema alignment.
2. Add backend response types for books in src/features/books/schemas/books.ts.
3. Define backend record types matching current API payload fields (error/authorized/message/data[], nested authors/categories, image fields, about, preview, status, pricing, release metadata).
4. Keep current UI-facing types (BookListItem, BookDetail, BookListResponse) unchanged to avoid broad component churn.
5. Phase 2: Backend fetch layer in books adapter. Depends on 1.
6. In src/features/books/server/books-adapter.ts, add BOOK_API_BASE_URL fallback and BOOKS_ENDPOINT constants, following categories-adapter style.
7. Add fetchBooksFromBackend(locale) with no-store fetch, JSON validation, and backend error handling. Send Accept-Language header but treat response text as Myanmar for both locales.
8. Centralize a mapping helper from backend book record to internal list/detail models. Required mapping rules:
9. slug should be backend id (so /books/:slug becomes /books/:id).
10. cartProductId should be deterministic from id (example pattern: book:{id}).
11. title should use bookTitle directly for both locales.
12. author should use first authors[].name (fallback safe label if missing).
13. category should use first categories[].name (fallback safe label if missing).
14. price should prefer salePrice then originalPrice.
15. cover image should prefer coverImage, then bookImageFront, then safe static fallback image.
16. detail description should transform HTML about to plain text for current rendering model.
17. detail metadata should map from existing API fields (publish year from bookReleaseDate, pageCount from pages, format from size, language fixed label from locale dictionary strategy, isbn from serial or id).
18. inStock should derive from status and units.
19. galleryImages should be built from available image URLs (front/back/cover/side) with duplicates removed.
20. Phase 3: Replace seed-path read operations with backend-first logic plus fallback. Depends on 2.
21. Update searchBooks to use backend-first list with existing query normalization, category filtering, keyword filtering, offset pagination, and appliedFilters shape unchanged.
22. Update getBookBySlug to resolve by backend id-as-slug first, fallback to existing seed slug lookup when backend fails.
23. Update getBooksByAuthor and getRelatedBooks to use backend relationships (authors[].id and categories[].id/name), fallback to seed behavior on backend failure.
24. Update getBookFilterOptions to derive categories from backend categories endpoint when available, with existing fallback logic retained.
25. Ensure all adapter public exports keep signatures unchanged so callers in routes/components do not need API-level rewrites.
26. Phase 4: Home page books integration. Depends on 3.
27. In src/features/home/server/get-home-page-data.ts, remove hardcoded booksByLocale/cartProductIdByHomeBookId/slugByHomeBookId for books.
28. Add backend-driven home books helper that calls searchBooks(locale, { limit: 24 }) and then picks 8 random books per request using existing pickRandomItems utility.
29. Map BookListItem to Home BookItem fields directly (id, slug=id, cartProductId, title, author, price, imageSrc from coverImageSrc, imageAlt from coverImageAlt).
30. Keep category/author/media/review logic untouched.
31. Phase 5: Route and metadata consistency. Depends on 3 and 4.
32. Keep route files unchanged in shape but ensure id-based slug works end-to-end in links already generated from book.slug.
33. Verify generateMetadata in /books/[slug]/page.tsx resolves book by id-slug and still returns SEO title/description.
34. Ensure /api/books route continues to call searchBooks without contract changes.
35. Phase 6: Compatibility checks and polish. Parallel with 5 after 3 is stable.
36. Confirm next.config.ts remotePatterns already support API image host; no change unless backend host expands.
37. Validate multimedia adapter fallback behavior still works with backend-driven searchBooks and deterministic IDs.
38. Add/update concise docs note in README.md under backend API section to include books endpoint and home random-8 behavior.

**Verification**

1. Run npm run typecheck.
2. Run npm run lint.
3. Run npm run build.
4. Manual: open /my and /en home pages and confirm 8 books are shown from backend data, with Myanmar titles visible in both locales.
5. Manual: refresh home multiple times and confirm random selection changes.
6. Manual: open /my/books and /en/books, test search, category filter, infinite scroll, and query persistence.
7. Manual: open a detail page from list/home and verify route uses id slug, metadata loads, description displays clean text, and images render.
8. Manual: simulate backend failure (temporary bad BOOK_API_BASE_URL) and verify seed fallback still serves list/home/detail.
9. Manual: verify /api/books?lang=my and /api/books?lang=en return same Myanmar content shape without runtime errors.
