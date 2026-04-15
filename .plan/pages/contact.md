# Contact Page History

## Page

- Route: `/:lang/contact`
- Owner: Marketing / Frontend

## Entries

### 2026-04-15 - Restore Books Categories Dropdown + Shared Floating Cart

- What changed:
  - Added localized Books category links to Contact header dropdown so Books hover categories are available outside homepage.
  - Floating cart button is now rendered by the shared marketing header, so it appears on Contact page too.
- Why it changed:
  - Keep Books navigation behavior and cart access consistent across all marketing pages.
- Files touched:
  - `src/features/contact/components/contact-page.tsx`
  - `src/components/layout/marketing/marketing-site-header.tsx`
  - `.plan/pages/contact.md`
- Notes:
  - Contact hero and content layout remain unchanged.

### 2026-04-15 - Remove Profile Overlay Layout

- What changed:
  - Removed the Facebook-style overlapping profile avatar from the cover photo.
  - Placed the profile image back into normal flow inside hero content.
  - Removed overlay-specific CSS rules and extra hero bottom spacing used for overlap.
- Why it changed:
  - To keep the profile visible without overlay behavior.
- Files touched:
  - `src/features/contact/components/contact-page.tsx`
  - `src/styles/globals.css`
  - `.plan/pages/contact.md`
- Notes:
  - Profile image now appears directly under hero text, not overlapping the cover edge.

### 2026-04-15 - Facebook-Style Profile Overlay on Cover

- What changed:
  - Redesigned contact hero so profile image overlays the bottom edge of the cover photo.
  - Removed in-hero profile card layout and replaced it with an absolute circular overlay avatar.
  - Added responsive behavior:
    - Mobile: profile image centered on the cover edge.
    - Tablet/Desktop: profile image aligned to the left edge area like a Facebook page cover.
- Why it changed:
  - To match requested Facebook-like visual hierarchy where profile sits above and overlapping the cover photo.
- Files touched:
  - `src/features/contact/components/contact-page.tsx`
  - `src/styles/globals.css`
  - `.plan/pages/contact.md`
- Notes:
  - Hero bottom spacing was increased to accommodate overlap without clipping following content.

### 2026-04-15 - Remove Profile Name and Bio Text

- What changed:
  - Removed profile name and bio text from the contact hero profile card.
  - Kept only the profile image in that card.
  - Simplified contact profile data schema and localized data by removing `name` and `bio` fields.
- Why it changed:
  - To keep only profile visual content and remove the section containing `ဒေါ်စုသန္တာ` and its description.
- Files touched:
  - `src/features/contact/components/contact-page.tsx`
  - `src/features/contact/schemas/contact.ts`
  - `src/features/contact/server/get-contact-page-data.ts`
  - `.plan/pages/contact.md`
- Notes:
  - Contact hero now shows a profile image only.

### 2026-04-15 - Remove Founder Section, Keep Profile Only

- What changed:
  - Removed founder role/title line from the contact profile card UI.
  - Updated contact profile data model by removing the `role` field.
  - Removed founder role values from localized contact seed data in both English and Myanmar.
- Why it changed:
  - To keep the page focused on a single profile block without a founder-specific section.
- Files touched:
  - `src/features/contact/components/contact-page.tsx`
  - `src/features/contact/schemas/contact.ts`
  - `src/features/contact/server/get-contact-page-data.ts`
  - `.plan/pages/contact.md`
- Notes:
  - Profile now displays image, name, and bio only.

### 2026-04-15 - Contact Page V1 Implementation

- What changed:
  - Added a dedicated localized Contact route at `/:lang/contact`.
  - Implemented a new contact feature module with typed schema, server data builder, and page component.
  - Built all required sections:
    - Cover photo with founder profile card
    - Social media information cards
    - Website title display
    - Website description display
    - Google Map embed section
  - Updated marketing navigation contact item to route to `/:lang/contact` instead of `#contact`.
  - Added localized contact-page dictionary copy and type contract updates in both English and Myanmar.
  - Added optional route-level metadata generation using localized contact-page metadata text.
  - Added contact-specific styles to global stylesheet for hero/surface/social/map components.
- Why it changed:
  - To move contact experience from footer-only into a full standalone page aligned with project requirements.
  - To keep the implementation consistent with existing marketing page architecture and i18n system.
- Files touched:
  - `src/app/[lang]/(marketing)/contact/page.tsx`
  - `src/features/contact/components/contact-page.tsx`
  - `src/features/contact/server/get-contact-page-data.ts`
  - `src/features/contact/schemas/contact.ts`
  - `src/features/contact/index.ts`
  - `src/components/layout/marketing/navigation.ts`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
  - `src/styles/globals.css`
- Notes:
  - Contact page uses existing image assets under `public/images/home/real/*` for V1.
  - Social links currently point to standard brand URLs/placeholders and can be replaced with final production accounts.

### 2026-04-15 - Contact Page V1 Planning

- What changed:
  - Planned a dedicated localized contact page route at `/:lang/contact`.
  - Defined required sections:
    - Cover photo with founder profile
    - Social media information
    - Website title
    - Website description
    - Google Map embed
  - Planned to reuse shared marketing shell components for consistency:
    - Top brand strip
    - Marketing site header
    - Marketing site footer
  - Planned to switch contact navigation target from `#contact` to `/:lang/contact`.
  - Planned bilingual dictionary support for English and Myanmar contact-page copy.
- Why it changed:
  - To provide a complete dedicated contact experience instead of relying only on the footer contact block.
  - To satisfy the requested content structure and keep design aligned with the existing marketing pages.
- Files touched:
  - `.plan/pages/contact.md`
- Notes:
  - Profile strategy: founder/owner photo with short bio.
  - Map strategy: use current footer address as Google Map pin target.
  - Implementation follow-up should include route creation, feature module, i18n type/copy updates, navigation update, and responsive UI verification.
