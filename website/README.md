# ClyCites Website

Public-facing Next.js website for ClyCites, aligned with the shared design language used in `clycites-workspaces-ui`.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- shadcn-style UI primitives

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Design System Alignment

- Theme tokens are generated from `src/styles/design-system.ts`.
- Global variables are injected in `src/app/layout.tsx`.
- Shared primitives in `src/components/ui` mirror the workspace visual language.

