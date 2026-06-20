# Spacing, Radii & Shadows — RatedDocs

Based directly on the spacing rhythm observed in the Figma. Use Tailwind's
default spacing scale (4px base unit) — no custom additions unless explicitly
needed.

---

## Spacing Scale

Tailwind's default scale, with the most commonly used values flagged.

| Class    | Value   | Common use                                  |
| -------- | ------- | ------------------------------------------- |
| `0`      | 0px     | Reset                                       |
| `0.5`    | 2px     | Hairline gap                                |
| `1`      | 4px     | Tight icon-text gap                         |
| `1.5`    | 6px     | Badge inner padding                         |
| `2` ⭐   | 8px     | **Small gap, icon padding**                 |
| `3`      | 12px    | Compact element gap                         |
| `4` ⭐   | 16px    | **Default element gap, card-internal spacing** |
| `5`      | 20px    | Larger element gap                          |
| `6` ⭐   | 24px    | **Card padding, section gap**               |
| `8` ⭐   | 32px    | **Major section spacing**                   |
| `10`     | 40px    | Large vertical rhythm                       |
| `12`     | 48px    | Page section margin (mobile)                |
| `16`     | 64px    | Page section margin (desktop)               |
| `20`     | 80px    | Marketing section spacing                   |
| `24`     | 96px    | Hero spacing                                |

---

## Common Patterns (Observed in the Figma)

### Card

\`\`\`tsx
<div className="bg-card border border-border rounded-xl p-6">
  {/* Internal content uses space-y-4 between major elements */}
</div>
\`\`\`

- Padding: `p-6` (24px) — the card outer padding.
- Internal vertical rhythm: `space-y-4` (16px) between elements.
- Internal section breaks: `space-y-6` (24px) between major sections.

### Stat Card

\`\`\`tsx
<div className="bg-card border border-border rounded-xl p-6 space-y-3">
  <div className="size-10 rounded-lg bg-sky-50 grid place-items-center">
    <Icon className="size-5 text-sky-600" />
  </div>
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">Total bookings</p>
    <p className="text-2xl font-bold">312</p>
    <p className="text-xs text-muted-foreground">+18 this month</p>
  </div>
</div>
\`\`\`

- Icon container: `size-10` (40px) with `rounded-lg`.
- Gap between icon and content block: `space-y-3` (12px).
- Gap inside content block: `space-y-1` (4px) — tight.

### Sidebar

\`\`\`tsx
<aside className="w-64 bg-sidebar p-6 space-y-8">
  {/* Logo */}
  <div className="px-2">...</div>

  {/* Nav group */}
  <div className="space-y-2">
    <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-muted px-3">
      Overview
    </p>
    <nav className="space-y-1">
      {/* Nav items: px-3 py-2 */}
    </nav>
  </div>
</aside>
\`\`\`

- Sidebar width: `w-64` (256px).
- Sidebar padding: `p-6` (24px).
- Gap between nav groups: `space-y-8` (32px).
- Gap between section label and nav: `space-y-2` (8px).
- Gap between nav items: `space-y-1` (4px).
- Nav item padding: `px-3 py-2` (12px / 8px).

### Page Layout

\`\`\`tsx
<main className="flex-1 bg-background">
  <div className="px-8 py-6 space-y-6">
    {/* Breadcrumb */}
    {/* Header card */}
    {/* Stats grid */}
    {/* Content */}
  </div>
</main>
\`\`\`

- Main content padding: `px-8 py-6` (32px / 24px).
- Vertical rhythm between major blocks: `space-y-6` (24px).

### Forms

- Field-to-field gap: `space-y-4` (16px).
- Label-to-input gap: `space-y-1.5` (6px).
- Input internal padding: `px-3 py-2` (12px / 8px) for default height (40px).
- Submit button margin-top: `mt-6` (24px) after last field.

### Badges & Pills

- Padding: `px-2.5 py-0.5` (10px / 2px) — tight, pill-style.
- Gap from adjacent text: `gap-1.5` (6px) when in a flex row.
- Status dot size: `size-1.5` (6px) with `rounded-full`.

### Buttons

- Padding `sm`: `px-3 py-1.5` (32px height).
- Padding `default`: `px-4 py-2` (40px height).
- Padding `lg`: `px-6 py-2.5` (48px height).
- Icon-text gap: `gap-2` (8px).

---

## Border Radius

Mapped from observed radii in the Figma.

| Token            | Value   | Use                                  |
| ---------------- | ------- | ------------------------------------ |
| `rounded-none`   | 0       | Never on UI elements                 |
| `rounded-sm`     | 4px     | Tiny tags, micro-elements            |
| `rounded-md`     | 6px     | Inputs, small buttons                |
| `rounded-lg` ⭐  | 8px     | **Buttons, icon containers, badges with backgrounds** |
| `rounded-xl` ⭐  | 12px    | **Cards, modals, major surfaces**    |
| `rounded-xl`    | 16px    | Featured cards, hero surfaces        |
| `rounded-full` ⭐ | Circle  | **Avatars, status dots, pills**     |

---

## Shadows

The Figma uses very subtle shadows — mostly just relying on borders.

| Token         | Use                                          |
| ------------- | -------------------------------------------- |
| `shadow-none` | Default — most cards use border, no shadow   |
| `shadow-sm`   | Subtle elevation (hovering state on cards)   |
| `shadow-md`   | Dropdowns, popovers                          |
| `shadow-lg`   | Modals, dialogs                              |
| `shadow`   | Avoid in this design language — too heavy    |

**Rule of thumb:** Prefer `border-border` over `shadow-*` for static
surfaces. Reserve shadows for floating UI (dropdowns, modals, toasts).

---

## Border Widths

| Token             | Use                                  |
| ----------------- | ------------------------------------ |
| `border` (1px) ⭐ | **Default for cards, inputs, dividers** |
| `border-2`        | Active tab indicator (`border-b-2 border-sky-500`) |
| `border-0`        | Reset                                |

---

## Container & Layout Widths

| Token             | Value     | Use                                 |
| ----------------- | --------- | ----------------------------------- |
| Sidebar          | `w-64`     | 256px — collapsed dashboard sidebar |
| Sidebar (collapsed) | `w-16`   | 64px — icon-only mode               |
| Main content     | `flex-1`   | Fills remaining space               |
| Right rail       | `w-80`     | 320px — Performance + Admin actions card |
| Modal (sm)       | `max-w-md` | 448px                               |
| Modal (default)  | `max-w-lg` | 512px                               |
| Modal (lg)       | `max-w-2xl`| 672px                               |
| Page max         | `max-w-7xl`| 1280px — marketing site             |

---

## Responsive Breakpoints

Tailwind's defaults, with usage guidance:

| Breakpoint | Min width | Use                            |
| ---------- | --------- | ------------------------------ |
| `sm`       | 640px     | Phone landscape, small tablets |
| `md`       | 768px     | Tablets                        |
| `lg` ⭐    | 1024px    | **Desktop — sidebar appears**  |
| `xl`       | 1280px    | Large desktop                  |
| `2xl`      | 1536px    | Wide screens                   |

**Mobile-first rule:** Always design for mobile first, then add `md:` /
`lg:` overrides. The dashboard sidebar should collapse to a Sheet on
mobile (below `lg`).

---

## Strict Rules

1. **Use the scale.** Never write `p-[13px]` or `gap-[18px]`. If you need
   something off-scale, ask first.
2. **Prefer `space-y-*` over manual margins** for vertical rhythm — it's
   more maintainable.
3. **Card padding is `p-6` by default.** Don't randomize between `p-4`,
   `p-5`, `p-6`.
4. **Radius is `rounded-xl` for cards, `rounded-lg` for buttons.** Stay
   consistent.
5. **Borders over shadows** for static surfaces.