## Mahar Sar Pay Web

Next.js 16 App Router project with a maintainable, route-first structure:

- `src/app` for routing and special route files.
- `src/features` for domain/feature modules (public entrypoint via `index.ts`).
- `src/components/ui` for shared UI primitives.
- `src/lib` for shared utilities/constants.
- `src/styles` for global styles and style tokens.
- Radix UI is configured globally via `@radix-ui/themes`.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` Start local development server.
- `npm run format` Auto-format project files with Prettier.
- `npm run format:check` Validate formatting.
- `npm run lint` Lint with ESLint (fails on warnings).
- `npm run lint:fix` Auto-fix lint issues where possible.
- `npm run typecheck` Run TypeScript checks.
- `npm run build` Create production build.

## Pre-commit and CI

- Pre-commit is managed by Husky + lint-staged.
- CI runs checks in this order:
  1. `npm run format:check`
  2. `npm run lint`
  3. `npm run typecheck`
  4. `npm run build`

## UI Library

- Primary UI library: `@radix-ui/themes` + `@radix-ui/react-icons`
- Global setup is in:
  - `src/components/providers/app-theme-provider.tsx`
  - `src/app/layout.tsx`

## Folder Conventions

```text
src
├── app
│   ├── (marketing)
│   │   ├── _components
│   │   └── page.tsx
│   ├── error.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   └── not-found.tsx
├── components
│   └── ui
├── features
│   └── home
│       ├── components
│       ├── schemas
│       ├── server
│       └── index.ts
├── lib
│   └── constants
└── styles
```

## Notes

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router project structure](https://nextjs.org/docs/app/getting-started/project-structure)
