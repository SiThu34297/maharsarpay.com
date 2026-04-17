# Multimedia Backend Fetch Integration Plan

Date: 2026-04-17

## Plan: Multimedia Backend Fetch Integration

Replace seed-only multimedia data with backend-driven multimedia from https://bookapi.sabahna.com/api/web/multimedia (or BOOK_API_BASE_URL override), while keeping the current app architecture and seed fallback safety. The implementation will normalize backend payloads into existing multimedia UI types, support video/photo URL behavior, generate human-readable slugs, and show 4 random active multimedia items on the home page.

## Steps

1. Phase 1: Define backend contract and normalization rules (blocks later phases)
2. In /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/schemas/multimedia.ts add backend response types for multimedia records and response envelope, including fields used by UI mapping: id, title, uploadedTime, content, mediaType, active, deletedStatus, youtubeUrl, videoUrl, imageUrl.
3. Define mapping rules for missing UI fields from backend: description/lead/storyParagraphs from HTML content, creator fallback label, imageAlt derived from title, tags default empty list, durationLabel optional, photoCount from imageUrl length, galleryImages from imageUrl values.
4. Define locale policy: always render backend Myanmar content for both en and my locales (UI chrome still localized via dictionary).
5. Phase 2: Add backend fetch and adapter transforms in multimedia adapter (depends on 1)
6. In /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/server/multimedia-adapter.ts add MULTIMEDIA_ENDPOINT and BOOK_API_BASE_URL fallback config, then implement fetchMultimediaFromBackend with no-store fetch, API error checks, and payload guards (same pattern as books/categories adapters).
7. Add backend filtering/sorting helpers: active=1 and deletedStatus=0 filter, sort by uploadedTime descending, keyword/mediaType filtering, cursor pagination.
8. Implement transformer helpers for list/detail models that preserve existing component contracts and include media source metadata for detail-page action behavior (YouTube first, then uploaded video URL).
9. Keep existing seed generation and fallback path as resilience path when backend fails.
10. Phase 3: Slug strategy and detail resolution (depends on 2)
11. Implement a deterministic human-readable slug builder from title plus stable id suffix (to avoid collisions while keeping readability).
12. Update getMediaBySlug to resolve by generated backend slug (primary) and keep backward-safe fallback matching for existing seed slugs.
13. Ensure all list responses (multimedia list + home media cards + related media) emit the generated slug used by route /[lang]/multimedia/[slug].
14. Phase 4: Wire backend data into multimedia public flows (depends on 2, 3)
15. Update searchMultimedia in /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/server/multimedia-adapter.ts to use backend-first then seed fallback.
16. Update getRelatedMedia to compute related items from backend results when available; keep seed fallback.
17. Keep getMediaRelatedBooks behavior as-is (books already backend-driven) but preserve graceful fallback for missing relation metadata.
18. Confirm /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/app/api/media/route.ts continues to parse lang and delegates to searchMultimedia without shape changes to client fetchers.
19. Phase 5: Home page multimedia integration (depends on 4)
20. In /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/home/server/get-home-page-data.ts replace static mediaItemsByLocale dependency with backend-driven home media loader using existing pickRandomItems utility.
21. Select exactly 4 random items from filtered active backend media for each request.
22. Reuse Myanmar payload values for both locales (do not translate backend fields).
23. Keep home card rendering unchanged in /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/home/components/home-page.tsx by preserving MediaItem-compatible shape.
24. Phase 6: Detail-page media action behavior (depends on 4)
25. In /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/components/multimedia-detail-page.tsx replace disabled hero action button with actionable link behavior:
26. For video: open YouTube URL if present, otherwise uploaded video URL, in same tab.
27. For photo: keep/view gallery action and ensure gallery renders all backend imageUrl entries.
28. Keep existing UX for missing external URLs (non-breaking fallback display).
29. Phase 7: Documentation and safeguards (parallel with 5-6 once mapping is stable)
30. Update /Users/sithu/Sites/maharsarpay/maharsarpay.com/README.md backend integration notes to include multimedia endpoint, locale policy (Myanmar reused for en/my), and fallback behavior.
31. Record repo memory update for multimedia backend conventions after implementation is validated.

## Relevant files

- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/schemas/multimedia.ts
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/server/multimedia-adapter.ts
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/app/api/media/route.ts
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/home/server/get-home-page-data.ts
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/home/schemas/home.ts
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/components/multimedia-detail-page.tsx
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/components/multimedia-list-client.tsx
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/server/get-multimedia-page-data.ts
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/src/features/multimedia/server/get-multimedia-detail-page-data.ts
- /Users/sithu/Sites/maharsarpay/maharsarpay.com/README.md

## Verification

1. Run npm run typecheck.
2. Run npm run lint.
3. Manual: load /my and /en home pages multiple refreshes; verify media section always shows 4 items, randomized, and items are backend-driven.
4. Manual: open /my/multimedia and /en/multimedia; verify list/search/filter/pagination still work with backend data.
5. Manual: open a backend-driven video detail page; verify action opens YouTube first else uploaded video in same tab.
6. Manual: open a backend-driven photo detail page; verify gallery renders all imageUrl values.
7. Manual: validate slug URLs are human-readable and stable; direct navigation to detail URL resolves correctly.
8. Failure-path test: temporarily simulate backend failure and confirm seed fallback still renders multimedia list/detail/home media cards.

## Decisions

- Included: backend endpoint https://bookapi.sabahna.com + path /api/web/multimedia, with BOOK_API_BASE_URL override.
- Included: homepage shows 4 random multimedia items from active/non-deleted backend records.
- Included: mediaType video supports YouTube or uploaded video, with YouTube precedence.
- Included: mediaType photo uses all imageUrl entries as detail gallery.
- Included: reuse Myanmar backend content for both en and my locales.
- Included: human-readable slug generation instead of raw UUID-only route segment.
- Excluded for now: embedded in-page video player, multimedia admin workflows, backend API contract changes.
