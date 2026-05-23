## Project Overview
ShopFront is a B2C e-commerce web app for fashion and lifestyle products.
Primary users: shoppers aged 20–35 on mobile devices.

Optimize for:
- fast page load (Core Web Vitals)
- smooth checkout flow (reduce cart abandonment)
- mobile-first responsive design

Avoid over-engineering. Prefer clarity over cleverness.

## Tech Stack
- Next.js 16 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- Ant Design 6

Do not introduce:
- Redux or MobX
- styled-components or Emotion
- Material UI
unless explicitly requested.

## Architecture
- src/app/                   → routes and server components
- src/config/                → app configuration
- src/actions/               → server actions
- src/services/              → API services and data fetching
- src/repositories/          → data access layer
- src/lib/                   → shared utilities and API helpers
- src/types/                 → shared TypeScript interfaces

Rules:
- Keep API calls in lib/ or server actions only
- Never put side effects inside presentational components
- New feature? Create under src/services/{feature-name}/
- Prefer editing existing components over creating near-duplicates

## Coding Conventions
- TypeScript strict mode — avoid `any` at all times
- Named exports only (except Next.js route files)
- async/await over chained .then()
- Keep components under 200 lines unless justified
- Descriptive variable names — no abbreviations (qty → quantity)
- No dead code, no commented-out blocks
- Add comments only when intent is non-obvious
- Extract repeated logic into hooks under src/services/{name}/hooks/

## UI & Design System
- Use antd primitives as default foundation
- 8px spacing rhythm throughout (p-2, p-4, p-8)
- Tailwind utilities only — no custom CSS files
- Product images: always use next/image with proper aspect ratios
- Every interactive element needs: hover, focus, and disabled states
- Forms must be scannable and mobile-friendly
- Meet WCAG 2.1 AA for contrast and keyboard navigation
- CTA buttons: solid primary only — no ghost buttons for main actions

## Content & Copy
- Concise and direct — no hype, no filler phrases
- Product headlines: benefit-first, not feature-first
- Error messages: tell users what to do, not just what went wrong
- CTA labels: action verbs ("Add to Cart", "Continue to Payment")
- Avoid: "World-class", "Cutting-edge", "Seamless experience"
- Price display: always show currency symbol, use comma separator (฿1,290)

## Testing & Quality
Before marking any task complete:
- run typecheck (npm run typecheck)
- run lint (npm run lint)
- run relevant tests (npm run test)

Rules:
- Unit tests required for: cart calculations, discount logic,
  form validation, price formatting
- No heavy test scaffolding for simple presentational components
- For all data-driven UI: verify empty, loading, and error states
- Checkout flow changes require E2E test coverage

## File Placement
- New UI components → src/app/components/
- Shared helpers → src/lib/
- Server actions → src/actions/
- API route handlers → src/app/api/{resource}/route.ts
- Data access logic → src/repositories/
- Business logic → src/services/
- Unit tests: co-locate next to source file (*.test.ts / *.test.tsx)

Rules:
- Do not create a new abstraction for one-off usage
- Edit existing component before creating near-duplicate
- Component filename must match exported name (ProductCard.tsx → ProductCard)

## Safety Rules
- Do not rename or restructure public API routes (/api)
- Do not change Prisma schema without flagging it clearly first
- Do not modify auth flow (login, register, session handling)
- Preserve backward compatibility for all shared components
- Flag major architectural changes before implementing 
— describe the change and wait for approval

## Commands
- Install:       npm install
- Dev:           npm run dev          (runs on localhost:3000)
- Build:         npm run build
- Lint:          npm run lint
- Typecheck:     npm run typecheck
- Test:          npm run test
- Test (watch):  npm run test:watch
- DB generate:   npm run db:generate
- DB migrate:    npm run db:migrate
- DB seed:       npm run db:seed      (dev environment only)
- DB reset:      npm run db:reset     (dev environment only)

## Security Rules
- Never commit .env, .env.local, or any file containing secrets
- Never hardcode API keys, tokens, or passwords in source code
- Never log sensitive data:
  - no console.log(user.password)
  - no logging full request bodies containing payment info
- DATABASE_URL: server-side only, never import in client components
- All user input must be validated server-side before hitting database
- .env.example is the only env file allowed in version control,
  must contain placeholder values only (no real secrets)