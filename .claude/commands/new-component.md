# New Component

Create a new component following project rules.

## Instructions

Before creating any component:

1. Ask me where the component will be used:
   - Generic UI primitive → `src/components/ui/`
   - Layout piece → `src/components/layout/`
   - Form helper → `src/components/forms/`
   - Single feature → `src/modules/<role>/<feature>/components/`
   - Single page → that page's `_components/` folder

2. Search the codebase for existing components with similar names or
   purposes. If one exists, ask whether to extend it instead.

3. When creating, include:
   - TypeScript interface for props
   - Default export
   - 'use client' directive ONLY if needed (state, effects, event handlers)
   - Matching skeleton component if it fetches/displays data
   - Dark mode support

4. Use only design tokens — no hardcoded colors, fonts, or spacing.

5. Show me the file path before writing the file.