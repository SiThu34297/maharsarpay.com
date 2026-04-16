## 2026-04-16 - Backend Authors Integration

### Summary

Implement backend-driven authors using `https://bookapi.sabahna.com/api/web/authors` with fallback to local seed data, keep current `/authors/[slug]` routing, and show `note` + `bookCount` on home and authors list.

### Implementation Changes

- Replace seed-only runtime in `authors-adapter` with backend fetch (`cache: no-store`) and API envelope validation.
- Preserve local seed as fallback when backend is unavailable or payload is invalid.
- Generate deterministic slugs from backend author names (collision-safe) so current detail URLs continue to work.
- Extend author models with `note` and `bookCount` and map those fields through list/detail responses.
- Keep internal `/api/authors` contract unchanged (`AuthorListResponse`) for existing infinite-scroll client.
- Update homepage authors source to use backend-backed `searchAuthors` and randomize 6 authors per render.
- Show `note` and localized book-count text on both home author cards and `/authors` list cards.
- Add temporary authored-books bridge by matching normalized author name in `getBooksByAuthor` when backend UUIDs do not match local seed IDs.
- Extend i18n dictionary/type contract with localized `bookCountTemplate` entries for home and authors list.

### Verification

- Run `npm run lint`
- Run `npm run typecheck`
- Run `npm run build`
- Manual checks: `/my`, `/en`, `/my/authors`, `/en/authors`, and author detail routes.

### Assumptions

- Backend currently returns Myanmar-localized author text for both `en` and `my`; frontend intentionally displays the same backend text in both locales.
- `status === 1` means active author.
- If backend returns fewer than 6 active authors, homepage shows all available authors.
