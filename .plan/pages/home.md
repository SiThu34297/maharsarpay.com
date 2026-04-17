# Home Page History

## Page

- Route: `/:lang`
- Owner: Marketing / Frontend

## Entries

### 2026-04-17 - Hide Reviews and Seasonal Campaign Sections

- What changed:
  - Removed the reviews/testimonials section (`စာဖတ်သူများ၏ အမြင်များ`) from home page rendering.
  - Removed the seasonal campaign promo section (`ရာသီအလိုက် ကမ်ပိန်း`) from home page rendering.
  - Removed now-unused review star rendering helper from home page component.
- Why it changed:
  - These two sections were requested to be hidden from the homepage.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `.plan/pages/home.md`
- Notes:
  - Other home sections and navigation remain unchanged.

### 2026-04-17 - Mobile Home Books Card Balance for Long Titles

- What changed:
  - Updated mobile home books cards to keep add-to-cart buttons vertically aligned even when titles are long.
  - Added two-line title clamp and fixed title area height.
  - Added single-line author clamp and fixed author row height.
  - Switched mobile card container to a column flex layout and anchored the button area at the bottom.
- Why it changed:
  - Long titles were wrapping unevenly and causing inconsistent card height and button alignment.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `.plan/pages/home.md`
- Notes:
  - This adjustment is mobile-only within the home books carousel section.

### 2026-04-17 - Home Books Discount Overlay on Cover

- What changed:
  - Moved discount amount display to an overlay badge on top of bestseller book cover images (mobile and desktop home sections).
  - Removed inline discount badge from the price row while keeping sale and original strikethrough prices.
- Why it changed:
  - To keep discount visual treatment consistent with books list card behavior.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `.plan/pages/home.md`
- Notes:
  - Overlay appears only when a valid positive discount exists.

### 2026-04-17 - Home Hero Mobile Height Increase (Round 2)

- What changed:
  - Increased mobile banner design height target from `1080 x 1620` to `1080 x 1800`.
  - Increased mobile hero section height again to better support taller mobile banner compositions.
- Why it changed:
  - Additional vertical space was requested for mobile banner layout.
- Files touched:
  - `src/features/home/schemas/home.ts`
  - `src/features/home/components/home-hero-slider.tsx`
  - `.plan/pages/home.md`
- Notes:
  - Desktop/tablet banner spec remains `1920 x 900`.

### 2026-04-17 - Home Hero Mobile Height Increase

- What changed:
  - Increased mobile banner design height target from `1080 x 1350` to `1080 x 1620`.
  - Increased mobile hero section display height to better accommodate taller banner composition.
- Why it changed:
  - Mobile banner composition needed more vertical space for important content.
- Files touched:
  - `src/features/home/schemas/home.ts`
  - `src/features/home/components/home-hero-slider.tsx`
  - `.plan/pages/home.md`
- Notes:
  - Desktop/tablet banner spec remains `1920 x 900`.

### 2026-04-17 - Home Hero Banner Design Dimensions

- What changed:
  - Added explicit home hero banner design dimensions for both desktop and mobile.
  - Exposed canonical values in home schema for design/development alignment.
- Why it changed:
  - To give designers a clear width/height target when preparing banner artwork.
- Files touched:
  - `src/features/home/schemas/home.ts`
  - `.plan/pages/home.md`
- Notes:
  - Desktop/tablet spec: `1920 x 900`
  - Mobile spec: `1080 x 1350`

### 2026-04-17 - Home Hero Banner Full Image Fit

- What changed:
  - Updated hero banner image rendering to show full photos without cropping.
  - Switched slider image fit behavior from cover mode to contain mode.
  - Added a black hero section backdrop so letterboxing areas are intentional and visually clean.
- Why it changed:
  - Banner photos were being cropped on the slider and important parts of the image were not visible.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`
  - `.plan/pages/home.md`
- Notes:
  - This keeps full image visibility across mobile, tablet, and desktop.

### 2026-04-17 - Home Hero Banner Backend Integration

- What changed:
  - Added backend banner fetch adapter for homepage hero slides using `BOOK_API_BASE_URL + /api/web/banner-images`.
  - Replaced static inline `heroSlides` assembly with backend-first loading in home server data.
  - Added resilient static fallback hero slides when backend fails or returns no usable banners.
  - Updated hero slide schema to support responsive sources (`imageDesktopSrc`, `imageMobileSrc`) and normalized action metadata.
  - Updated hero slider UI to:
    - render `webImage` equivalent on tablet/desktop and `mobileImage` equivalent on mobile.
    - make the entire active slide clickable when action is valid.
    - support `EXTERNAL` (new tab) and `DEEPLINK` (internal navigation) actions.
  - Added deeplink normalization rule that converts legacy `/book/:id` to `/{locale}/books/:id`.
- Why it changed:
  - To fetch banner slider content from backend while matching responsive image requirements and preserving safe navigation behavior.
- Files touched:
  - `src/features/home/server/banner-images-adapter.ts`
  - `src/features/home/server/get-home-page-data.ts`
  - `src/features/home/schemas/home.ts`
  - `src/features/home/components/home-hero-slider.tsx`
  - `.plan/banner-slider-backend-fetch-plan.md`
  - `.plan/pages/home.md`
- Notes:
  - Backend Myanmar content is reused for both `en` and `my`.
  - Missing/invalid action URLs intentionally produce non-clickable slides.

### 2026-04-15 - Home to Book Detail Breadcrumb Source

- What changed:
  - Updated home books cards (mobile + desktop image/title links) to include `?from=home` when opening detail routes.
- Why it changed:
  - To allow book detail breadcrumb to render Home-based context when user enters from homepage.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `.plan/pages/home.md`
- Notes:
  - Add-to-cart interactions remain unchanged.

### 2026-04-15 - Home Books Cards Link to Detail Route

- What changed:
  - Added slug-based routing support to home page books data contract.
  - Added home book slug mapping in server seed builder and returned `slug` with each home book item.
  - Updated home books section cards (mobile carousel + desktop grid) so cover image and title link to `/:lang/books/[slug]`.
- Why it changed:
  - To let users open the new book detail page directly from the home page bestseller cards.
- Files touched:
  - `src/features/home/schemas/home.ts`
  - `src/features/home/server/get-home-page-data.ts`
  - `src/features/home/components/home-page.tsx`
  - `.plan/pages/home.md`
- Notes:
  - Add-to-cart behavior on home cards remains unchanged.

### 2026-04-15 - Remove Rating Stars from Home Book Cards

- What changed:
  - Removed star rating display from Home page book cards in both mobile carousel cards and desktop grid cards.
  - Kept book title, author, price, and add-to-cart button unchanged.
  - Left testimonial/review star ratings unchanged.
- Why it changed:
  - To simplify the Home books card UI per latest requirement.
- Files touched:
  - `src/features/home/components/home-page.tsx`
- Notes:
  - This affects only the `#books` section on Home.

### 2026-04-15 - Mobile Navbar Expandable Books Submenu + Scrollable Overflow

- What changed:
  - Updated shared marketing mobile header to make `စာအုပ်များ` submenu expandable/collapsible with a dedicated toggle button.
  - Added animated open/close behavior with chevron rotation for submenu state.
  - Added overflow handling for large datasets:
    - Mobile nav panel now has max viewport height and vertical scrolling.
    - Books submenu category list now has max height with internal vertical scrolling.
  - Kept menu-close behavior consistent when a nav link or category link is selected.
- Why it changed:
  - To improve mobile usability for long category lists and match expected expandable navigation behavior.
- Files touched:
  - `src/components/layout/marketing/marketing-mobile-header.tsx`
- Notes:
  - Change applies to all pages using `MarketingSiteHeader`, including Home and Books routes.

### 2026-04-15 - Categories Navigation to Books + Filtered Category Chips

- What changed:
  - Updated top navigation `အမျိုးအစား` route to open the Books page (`/:lang/books`) instead of in-page `#categories`.
  - Converted category chips in `အမျိုးအစားအလိုက် ကြည့်ရှုပါ` from static blocks to clickable links.
  - Wired each category chip (for example, `ဝတ္ထု`) to open `/:lang/books` with the related `category` query filter.
  - Added fallback query behavior (`q=<category label>`) when a category label does not have a direct category-id match.
  - Added hover/focus styles for linked category chips.
- Why it changed:
  - To make category interactions route users directly into the books discovery flow with relevant filtered results.
- Files touched:
  - `src/components/layout/marketing/navigation.ts`
  - `src/features/home/components/home-page.tsx`
  - `src/styles/globals.css`
- Notes:
  - Category-id mappings are sourced from `getBookFilterOptions(locale)` to keep home links aligned with the books filter dataset.

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

### 2026-04-14 - Mobile Hamburger Navbar Interaction

- What changed:
  - Added interactive hamburger behavior for the mobile navbar (`<md`) with open/close state.
  - Implemented a collapsible mobile navigation panel that lists existing nav links and closes on link tap.
  - Replaced static mobile header markup in homepage with a dedicated client component.
- Why it changed:
  - To make the mobile navbar actionable and improve navigation usability on small screens.
- Files touched:
  - `src/features/home/components/home-page-mobile-header.tsx`
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Hero Slider Minimal Fullscreen Mode

- What changed:
  - Simplified hero slider content to only show slide title and image.
  - Removed badge, description, CTA buttons, dots, and arrow controls from the hero section.
  - Updated hero image to render full-screen (`100svh`) with cover behavior.
- Why it changed:
  - To match the requested minimal slider layout and full-screen image presentation.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Hero Slider Height Tuning

- What changed:
  - Reduced hero slider height from full screen (`100svh`) to slightly shorter (`92svh`).
- Why it changed:
  - To keep the same visual style while decreasing vertical dominance.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`

### 2026-04-14 - Slider Bottom Spacing

- What changed:
  - Added responsive bottom spacing below the hero slider wrapper (`mb-8 md:mb-12 lg:mb-16`).
- Why it changed:
  - To create clear separation between the slider and the section below.
- Files touched:
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Responsive Hero Image (Mobile + Desktop)

- What changed:
  - Updated hero slider height to responsive breakpoints for mobile/tablet/desktop.
  - Added explicit `next/image` responsive sizing (`sizes=\"100vw\"`) for full-width hero rendering.
  - Tuned hero title typography so it scales better on smaller screens.
- Why it changed:
  - To ensure the slider image and title layout adapt cleanly across both mobile and desktop views.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`

### 2026-04-14 - Hero Title Size Reduction

- What changed:
  - Reduced slider title font sizes across breakpoints (`text-xl sm:text-2xl md:text-4xl lg:text-5xl`).
- Why it changed:
  - To make hero title scale less dominant on both mobile and desktop.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`

### 2026-04-14 - Hero Title Size Exact Breakpoints

- What changed:
  - Set hero title to exactly `text-2xl` on mobile and `text-3xl` on desktop (`lg` and up).
- Why it changed:
  - To match the requested typography scale precisely for mobile and desktop.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`

### 2026-04-14 - Hero Slider Manual Navigation Buttons

- What changed:
  - Added previous/next navigation buttons overlayed on the hero slider.
  - Wired slider button accessibility labels from localized hero copy.
- Why it changed:
  - To enable direct manual navigation between slides in addition to auto-rotation.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Hero Slider Transition + Navigator Bar

- What changed:
  - Added smooth crossfade/zoom transition between hero slides.
  - Added a bottom navigator bar with clickable slide indicators.
- Why it changed:
  - To make manual slider navigation feel smoother and provide direct slide jumping.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`

### 2026-04-14 - Mobile Slider Arrow Button Visibility

- What changed:
  - Hid hero slider previous/next arrow buttons on mobile and kept them visible from `md` and up.
- Why it changed:
  - To reduce control clutter in mobile responsive view as requested.
- Files touched:
  - `src/features/home/components/home-hero-slider.tsx`

### 2026-04-14 - Real Mobile Interaction Reliability Fixes

- What changed:
  - Added legacy `MediaQueryList` listener fallback for mobile header menu behavior on older mobile browsers.
  - Increased mobile header interaction layer priority and added touch-optimized interaction class for menu button.
  - Updated hero slider interaction layers to avoid overlay tap interception and improve mobile navigator tap handling.
- Why it changed:
  - To address reports that mobile navbar menu and slider navigation actions were not responding on real devices.
- Files touched:
  - `src/features/home/components/home-page-mobile-header.tsx`
  - `src/features/home/components/home-hero-slider.tsx`

### 2026-04-14 - Hydration Warning Tolerance (Newsletter Form)

- What changed:
  - Added `suppressHydrationWarning` to newsletter `<form>` and `<input>` in footer.
- Why it changed:
  - To avoid hydration mismatch warnings when browser extensions inject runtime attributes (e.g. `__gcruniqueid`) on real devices/browsers.
- Files touched:
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Root HTML Hydration Warning Tolerance

- What changed:
  - Added `suppressHydrationWarning` to the root `<html>` element in app layout.
- Why it changed:
  - To avoid hydration mismatch warnings when browser extensions inject runtime attributes on `<html>` (e.g. `__gcrremoteframetoken`) before React hydration.
- Files touched:
  - `src/app/layout.tsx`

### 2026-04-14 - Books Navbar Dropdown For Categories

- What changed:
  - Removed `အမျိုးအစားများ` from top-level navbar items.
  - Added dropdown under `စာအုပ်များ` that contains `အမျိုးအစားများ` link.
  - Implemented desktop/tablet hover/focus dropdown and mobile expandable submenu behavior.
- Why it changed:
  - To keep navbar cleaner while preserving access to categories through `စာအုပ်များ`.
- Files touched:
  - `src/features/home/components/home-page.tsx`
  - `src/features/home/components/home-page-mobile-header.tsx`

### 2026-04-14 - Books Dropdown Rehide Behavior

- What changed:
  - Removed focus-persistent behavior from desktop/tablet `စာအုပ်များ` dropdown visibility.
  - Kept hover-based dropdown visibility so submenu does not remain stuck after click.
- Why it changed:
  - To ensure `အမျိုးအစားများ` submenu rehides when users click `စာအုပ်များ` or `အမျိုးအစားများ`.
- Files touched:
  - `src/features/home/components/home-page.tsx`

### 2026-04-14 - Brand Favicon Update

- What changed:
  - Replaced app favicon with an `.ico` generated from the Mahar Sarpay logo asset.
- Why it changed:
  - To align browser tab icon branding with the official site logo.
- Files touched:
  - `src/app/favicon.ico`
