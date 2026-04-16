# Mahar Sarpay Book Detail Page Plan (Saved)

## Goal

Ship a modern localized book detail page at `/:lang/books/[slug]` that reuses existing marketing layout and cart flow, while improving content depth and visual quality.

## Planned Scope

- Add dynamic detail route with Next.js App Router at `src/app/[lang]/(marketing)/books/[slug]/page.tsx`.
- Add per-book metadata generation (`title`, `description`) based on book detail content.
- Upgrade books data contracts with detail fields:
  - `slug`, `description`, `publishYear`, `pageCount`, `language`, `format`, `isbn`, `inStock`
- Add adapter helpers:
  - `getBookBySlug(locale, slug)`
  - `getRelatedBooks(locale, book, limit)`
- Build a modern book detail UI:
  - breadcrumb
  - hero with cover + key info + add-to-cart
  - info cards for metadata
  - related books grid
- Update book list cards to link to detail routes by `slug`.
- Add localized dictionary copy for detail labels in both `en` and `my`.
- Add dedicated detail-page styles in `src/styles/globals.css`.

## Validation Checklist

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Manual checks:
  - Valid slug renders detail page.
  - Invalid slug returns not found.
  - Add-to-cart works from detail page.
  - Related books link correctly.
  - Responsive behavior is stable on mobile/tablet/desktop.
