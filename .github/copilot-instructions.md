# RatedDocs — Copilot Instructions

You are working on an enterprise dental tourism / patient management platform.
Follow every rule below exactly. Do not substitute libraries, create new folders, or guess — ask first.

---

## STACK (Do Not Substitute)

- **Framework:** Next.js 16+ App Router only (never Pages Router)
- **Language:** TypeScript strict mode
- **Styling:** Tailwind CSS **v4** — see Tailwind rules below
- **UI:** Shadcn UI + Radix UI primitives
- **Animation:** `motion/react` (formerly Framer Motion)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React for UI icons. `react-icons` only for brand logos (Google, Apple, Facebook, X). Never react-icons for generic icons.
- **Notifications:** react-hot-toast
- **State:** Context API (global UI/auth), React Query (server state), local state (component)

---

## TAILWIND V4 — KEY DIFFERENCES FROM V3

- No `tailwind.config.js` — config lives in `@theme {}` inside `globals.css`
- Use `@import "tailwindcss"` not `@tailwind base/components/utilities`
- Custom utilities go in `@utility {}` blocks
- Use v4 shorthand classes: `max-w-110` not `max-w-[440px]`, `stroke-3` not `stroke-[3]`, `size-4.5`, `h-11.5`, `bg-linear-to-r`, etc.

---

## PROJECT STRUCTURE — STRICT, DO NOT DEVIATE

```
src/
├── app/
│   ├── (marketing)/        # Public pages
│   ├── (auth)/             # Auth pages
│   └── (dashboard)/
│       ├── patient/
│       ├── dentist/
│       └── admin/
├── modules/                # Feature modules
│   ├── patient/<feature>/{components,hooks,services,schemas,types}
│   ├── dentist/<feature>/...
│   ├── admin/<feature>/...
│   └── shared/
├── components/
│   ├── ui/                 # Shadcn primitives only
│   ├── layout/             # Sidebar, topbar shells
│   ├── forms/              # Reusable form primitives
│   ├── feedback/           # Skeletons, spinners, error states
│   ├── data-display/       # Tables, cards, pagination
│   └── common/             # Logo, avatar, theme toggle
├── lib/
│   ├── api/                # API client, endpoints
│   ├── auth/               # Session, permissions, role guard
│   ├── utils/
│   ├── hooks/              # Generic reusable hooks
│   └── constants/
├── config/
├── context/
├── providers/
├── styles/
├── types/
└── middleware.ts
```

**File placement rules:**
- Generic UI primitive → `src/components/ui/`
- Used by one feature only → `src/modules/<role>/<feature>/components/`
- Used by one page only → `_components/` next to the page file
- Generic hook → `src/lib/hooks/`
- Feature hook → `src/modules/<role>/<feature>/hooks/`
- API call → `src/modules/<role>/<feature>/services/`
- Zod schema → `src/modules/<role>/<feature>/schemas/`

**Critical:**
1. Never create folders outside this structure
2. Never duplicate existing components — search first
3. Import flow: `modules/` → `components/` → `lib/` (never reverse)
4. Always use `@/` alias, never `../../../`

---

## COMPONENT RULES

- TypeScript interface for every prop set
- File names: `kebab-case.tsx` | Component names: `PascalCase`
- Hook files: `use-kebab-case.ts`
- `"use client"` at top for any component using state, effects, or browser APIs
- Default to Server Components — only add `"use client"` when necessary
- Every component needs: props interface, loading state, error state, empty state (for lists)

---

## SKELETON LOADING

- Every data-fetching component gets a matching skeleton: `card.tsx` → `card-skeleton.tsx`
- Skeleton lives in the same folder as the component
- Use `<Skeleton>` from `@/components/feedback/skeleton`
- Page-level: use `loading.tsx` — call a skeleton component, never render "Loading..."
- Never use a spinner where a skeleton fits

---

## DESIGN TOKENS (Primary Colors)

- Navy: `#113254` (primary), `#0d2844` (hover), `#1A1A2E` (headings)
- Gray text: `#6B7280` (secondary), `#9CA3AF` (muted)
- Border: `#E5E7EB` (default), `#CEE0F4` (card border)
- Success green: `#10B981`
- Background: `#F9FAFB`
- Never hardcode colors — use Tailwind classes tied to CSS variables

---

## EXISTING CODE POLICY

Before creating anything:
1. Read existing related files
2. Match the style, naming, and patterns exactly
3. Never overwrite existing design without explicit confirmation
4. If existing code conflicts with these rules, flag it and ask before fixing
