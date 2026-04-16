## Multimedia Detail Page Plan (Editorial Modern)

### Summary

Build a new localized multimedia detail route with an editorial-modern design, progressive media hero treatment, and discovery modules that connect stories to more media and books.

### Implementation Changes

- Add dynamic route: `/:lang/multimedia/:slug` with locale validation and `notFound()` handling.
- Add route metadata via `generateMetadata` using localized multimedia detail data.
- Expand multimedia schema/model to support detail pages:
  - `MediaListItem` includes `slug`
  - new `MediaDetail` for long-form story fields and media metadata
  - new `MultimediaDetailPageData` with `media`, `relatedMedia`, `relatedBooks`, `filterOptions`.
- Refactor multimedia adapter seed data to be detail-first and derive list/search responses from the same source.
- Add multimedia detail data loaders:
  - `getMediaBySlug(locale, slug)`
  - `getRelatedMedia(locale, currentMedia, limit?)`
  - `getMediaRelatedBooks(locale, currentMedia, limit?)`
  - `getMultimediaDetailPageData(locale, slug)`.
- Create new `MultimediaDetailPage` component:
  - breadcrumb (`Home/Media > Story`)
  - hero with media type badge, title, creator, date, lead, and progressive CTA
  - narrative story content section
  - media info/tags section
  - optional gallery strip
  - related media grid
  - related books grid.
- Update multimedia list cards to link into detail route using slug.
- Update home media cards to link into detail route using slug.
- Extend i18n contract and both dictionaries with `multimediaDetail` keys.
- Add modern multimedia detail styling classes in global CSS with responsive behavior and reduced-motion handling.
- Keep current list page and API behavior intact (search/filter/pagination), only extending capabilities.

### Public APIs / Types

- Update: `MediaListItem` (`slug` added).
- Add: `MediaDetail`.
- Add: `MultimediaDetailPageData`.
- Export new multimedia detail functions and component via `src/features/multimedia/index.ts`.

### Validation Checklist

1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. Verify:
   - `/en/multimedia/:slug` and `/my/multimedia/:slug` render correctly.
   - unknown slug returns not-found.
   - multimedia list cards route correctly to detail.
   - home media cards route correctly to detail.
   - related media and related books sections display expected fallback behavior.

### Assumptions and Defaults

- Visual direction: editorial modern.
- Media behavior: progressive hero (embed-ready UI with poster-style fallback).
- Scope: full feature slice (routing, data, UI, links, i18n, styles).
- Supporting modules: related media and related books.
