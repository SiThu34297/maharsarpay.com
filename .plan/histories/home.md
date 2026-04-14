# Home Page History

## Page

- Route: `/:lang`
- Owner: Marketing / Frontend

## Entries

### 2026-04-14 - Homepage V1 Implementation

- What changed:
  - Replaced starter marketing UI with a full bookstore homepage.
  - Added sticky header, navigation, hero, categories, bestsellers, authors, media, reviews, promo banner, and footer.
  - Added static typed seed data and bilingual content (`en` + `my`).
  - Added global design tokens and typography setup.
- Why it changed:
  - To deliver the approved Mahar Sarpay homepage design and establish scalable page structure.
- Files touched:
  - `src/app/[lang]/(marketing)/page.tsx`
  - `src/features/home/components/home-page.tsx`
  - `src/features/home/server/get-home-page-data.ts`
  - `src/features/home/schemas/home.ts`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
  - `src/styles/globals.css`
  - `src/app/layout.tsx`
- Notes:
  - Static seed data for V1; API/CMS integration can be added later.

### 2026-04-14 - Hero Slider Multi-Slide Upgrade

- What changed:
  - Replaced static single hero panel with an interactive carousel.
  - Added previous/next controls, clickable indicator dots, and auto-rotation.
  - Expanded hero data from 1 slide to 3 localized slides.
- Why it changed:
  - To support multiple promotional hero messages and improve homepage engagement.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`
  - `src/features/home/components/home-page.tsx`
  - `src/features/home/server/get-home-page-data.ts`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
  - `public/images/home/hero-stack-02.svg`
  - `public/images/home/hero-stack-03.svg`
- Notes:
  - Auto-rotation interval is set to 6 seconds and pauses only when component unmounts.

### 2026-04-14 - Navbar Brand Logo Integration

- What changed:
  - Added real brand logo image to navbar across desktop, tablet, and mobile headers.
  - Replaced text-only brand blocks with reusable `BrandIdentity` component (logo + brand name + slogan).
  - Added responsive safeguards for slogan overflow on small widths.
- Why it changed:
  - To align navbar branding with the provided logo and brand identity.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `public/images/brand/maharsarpay-logo.png`
- Notes:
  - Logo source imported from user-provided PNG.

### 2026-04-14 - Top Brand Message Section

- What changed:
  - Added a dedicated top-of-page brand section above the navbar.
  - Section includes the logo, `မဟာစာပေ`, and the Myanmar message requested by user.
- Why it changed:
  - To highlight brand identity and mission statement at the very top of the homepage.
- Files touched:
  - `src/features/home/components/home-page.tsx`
- Notes:
  - Uses the existing brand logo image from `public/images/brand/maharsarpay-logo.png`.

### 2026-04-14 - Myanmar-Only Header Simplification

- What changed:
  - Removed localization switch buttons from navbar.
  - Removed search and wishlist actions from navbar.
  - Kept user profile action in navbar.
  - Added floating cart CTA button fixed at bottom-right of the page.
  - Updated locale proxy to force Myanmar-only routing (`/my`) and redirect other locale paths to Myanmar.
- Why it changed:
  - To simplify navigation for Myanmar-only experience and emphasize primary actions.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `proxy.ts`
- Notes:
  - Existing i18n dictionary structure remains for now, but runtime routing now enforces Myanmar locale.

### 2026-04-14 - Tablet Navbar Responsive Fix (768/1024)

- What changed:
  - Reworked tablet navbar (`md` to `xl`) into a single-row layout.
  - Added horizontal scrolling nav lane with profile icon pinned to the right.
  - Removed stacked tablet header rows that caused unstable behavior at 768px and 1024px widths.
- Why it changed:
  - To ensure the navbar remains usable and visually consistent on common tablet/laptop breakpoints.
- Files touched:
  - `src/features/home/components/home-page.tsx`
- Notes:
  - Desktop (`xl+`) and mobile (`<md`) navbar variants remain unchanged.

### 2026-04-14 - Multimedia Photo + Video Support

- What changed:
  - Added media type support (`video` and `photo`) to multimedia items.
  - Updated multimedia cards to show type-specific icon + label badges.
  - Mixed media seed data now includes both videos and photos in English/Myanmar content.
- Why it changed:
  - To clearly represent mixed multimedia content in one section.
- Files touched:
  - `src/features/home/schemas/home.ts`
  - `src/features/home/server/get-home-page-data.ts`
  - `src/features/home/components/home-page.tsx`
  - `src/lib/i18n/types.ts`
  - `src/lib/i18n/dictionaries/en.ts`
  - `src/lib/i18n/dictionaries/my.ts`
  - `src/styles/globals.css`
- Notes:
  - Media badge labels are localized (`Video/Photo`, `ဗီဒီယို/ဓာတ်ပုံ`).

### 2026-04-14 - Real Image Asset Migration

- What changed:
  - Replaced placeholder SVG images with real photo assets for hero, books, authors, and multimedia cards.
  - Downloaded and stored local JPG assets under `public/images/home/real/*`.
  - Updated all homepage seed-data image paths to use those local real images.
- Why it changed:
  - To use realistic visual content across all homepage image slots.
- Files touched:
  - `public/images/home/real/books/*.jpg`
  - `public/images/home/real/authors/*.jpg`
  - `public/images/home/real/media/*.jpg`
  - `public/images/home/real/hero/*.jpg`
  - `src/features/home/server/get-home-page-data.ts`
- Notes:
  - Assets are local, so runtime does not depend on remote image hosts.

### 2026-04-14 - Brand Naming Standardization (Myanmar)

- What changed:
  - Updated Myanmar brand wording from `မဟာဆာပေး` to `မဟာစာပေ` across homepage copy and data text.
- Why it changed:
  - To keep brand naming consistent with requested official Myanmar wording.
- Files touched:
  - `src/lib/i18n/dictionaries/my.ts`
  - `src/features/home/server/get-home-page-data.ts`

### 2026-04-14 - Myanmar Typography Readability Tuning

- What changed:
  - Added Myanmar-locale typography overrides with slightly smaller type scale.
  - Increased line-height for Myanmar text content across sections.
- Why it changed:
  - To improve readability and visual balance for Myanmar text rendering.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `src/styles/globals.css`

### 2026-04-14 - Navbar Brand Cleanup

- What changed:
  - Removed logo from navbar and later removed navbar brand text/slogan as well.
  - Kept dedicated top brand section as the primary branding area.
- Why it changed:
  - To reduce navbar clutter and focus branding at the top section only.
- Files touched:
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Floating Cart Button Refinement

- What changed:
  - Changed floating cart button from icon+text to icon-only UI.
- Why it changed:
  - To keep the floating action compact and less intrusive on smaller screens.
- Files touched:
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Myanmar Price Label Formatting

- What changed:
  - Updated Myanmar currency display from `K` suffix to `ကျပ်` suffix (e.g. `၁၉,၈၀၀ ကျပ်`).
- Why it changed:
  - To match Myanmar language expectations and clearer local price formatting.
- Files touched:
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - TypeScript Root Proxy Import Fix

- What changed:
  - Added root-level `proxy.ts` to TypeScript project include list to resolve `@/*` alias imports in editor diagnostics.
- Why it changed:
  - To fix `Cannot find module '@/lib/i18n/config'` issue on root middleware file.
- Files touched:
  - `tsconfig.json`
