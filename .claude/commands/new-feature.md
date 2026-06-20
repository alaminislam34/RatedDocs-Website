# New Feature

Create a new feature module following the project structure exactly.

## Instructions

When I say "create a new feature for [role] called [feature]":

1. Confirm the role is one of: patient, dentist, admin.
2. Create the folder structure at `src/modules/<role>/<feature>/`:
   - `components/`
   - `hooks/`
   - `services/`
   - `schemas/`
   - `types/`
3. Create an `index.ts` barrel export (empty for now).
4. Create the page route at `src/app/(dashboard)/<role>/<feature>/page.tsx`.
5. Create a matching `loading.tsx` and `error.tsx` for the route.
6. Add a navigation entry in `src/config/navigation.ts` under the correct role.
7. STOP and show me the structure before writing any component code.

Do NOT create any extra files. Do NOT skip steps.