# Color System — RatedDocs

All colors are defined as CSS variables in `src/app/globals.css` using
Tailwind CSS v4 `@theme` syntax. Use Tailwind utility classes that map to
these tokens. NEVER hardcode hex values in components.

---

## Token Reference

### Brand — Navy (Primary Text, Sidebar, Headings)

The dominant brand color. Used for sidebar background, all headings, and
primary body text on light surfaces.

| Token              | Hex       | Use                                          |
| ------------------ | --------- | -------------------------------------------- |
| `--color-navy-50`  | `#F1F4F9` | Very light navy tint (subtle backgrounds)    |
| `--color-navy-100` | `#D9E0EC` | Light navy (hover states on dark surfaces)   |
| `--color-navy-200` | `#B3C1D9` | Disabled text on dark surfaces               |
| `--color-navy-300` | `#7A8CA8` | Sidebar inactive labels, muted nav items     |
| `--color-navy-400` | `#5A6B85` | Secondary text on dark backgrounds           |
| `--color-navy-500` | `#2C3E5C` | Mid navy                                     |
| `--color-navy-600` | `#1E2D47` | Sidebar background (darker variant)          |
| `--color-navy-700` | `#152238` | **Main heading color** (Dr. Maya Patel, $48,200) |
| `--color-navy-800` | `#0F1B2D` | Sidebar background                           |
| `--color-navy-900` | `#0A1322` | Deepest navy                                 |

**Tailwind usage:** `bg-navy-800` (sidebar), `text-navy-700` (headings), `text-navy-300` (sidebar labels)

---

### Brand — Sky (Primary Accent, Links, CTAs)

The interactive accent color. Used for verified badges, language pills,
links, and the active tab underline.

| Token             | Hex       | Use                                       |
| ----------------- | --------- | ----------------------------------------- |
| `--color-sky-50`  | `#EFF8FF` | "RDV Verified" badge background           |
| `--color-sky-100` | `#D1E9FF` | Hover state for sky accents               |
| `--color-sky-200` | `#B2DDFF` | Borders on sky-tinted surfaces            |
| `--color-sky-300` | `#84CAFF` | Disabled sky elements                     |
| `--color-sky-400` | `#53B1FD` | Secondary sky                             |
| `--color-sky-500` | `#2E90FA` | **Primary accent** (active tab underline, links) |
| `--color-sky-600` | `#1570EF` | Hover on primary                          |
| `--color-sky-700` | `#175CD3` | Sky text on light backgrounds             |
| `--color-sky-800` | `#1849A9` | Dark sky                                  |
| `--color-sky-900` | `#194185` | Deepest sky                               |

**Tailwind usage:** `bg-sky-500` (CTAs), `text-sky-700` (badge text), `border-b-sky-500` (active tab)

---

### Brand — Gold (Logo Accent, Avatars, Ratings)

The warm signature accent. Used in the RatedDocs logo, user avatars,
star ratings, and the "5-star reviews" progress bar.

| Token              | Hex       | Use                                       |
| ------------------ | --------- | ----------------------------------------- |
| `--color-gold-50`  | `#FFFAEB` | Lightest gold tint                        |
| `--color-gold-100` | `#FEF0C7` | Gold backgrounds (avatar bg)              |
| `--color-gold-200` | `#FEDF89` | Hover on gold                             |
| `--color-gold-300` | `#FEC84B` | **User avatar background** (JS circle)    |
| `--color-gold-400` | `#FDB022` | **Star rating color** (★ 4.9)             |
| `--color-gold-500` | `#F79009` | **5-star reviews bar**                    |
| `--color-gold-600` | `#DC6803` | Hover on gold                             |
| `--color-gold-700` | `#B54708` | Dark gold text                            |
| `--color-gold-800` | `#93370D` |                                           |
| `--color-gold-900` | `#7A2E0E` |                                           |

**Tailwind usage:** `bg-gold-300` (avatar), `text-gold-400` (stars), `bg-gold-500` (progress bar)

---

### Semantic — Success (Green)

For "Active" status, "Phase 3 — Clinical" badge, and "Estimate accuracy" bar.

| Token                | Hex       | Use                                |
| -------------------- | --------- | ---------------------------------- |
| `--color-success-50` | `#ECFDF3` | "Active" badge background          |
| `--color-success-100` | `#D1FADF` | Success surface light             |
| `--color-success-200` | `#A6F4C5` |                                    |
| `--color-success-300` | `#6CE9A6` |                                    |
| `--color-success-400` | `#32D583` |                                    |
| `--color-success-500` | `#12B76A` | **Default success** (Active dot, bar) |
| `--color-success-600` | `#039855` |                                    |
| `--color-success-700` | `#027A48` | Success text                       |
| `--color-success-800` | `#05603A` |                                    |
| `--color-success-900` | `#054F31` |                                    |

**Tailwind usage:** `bg-success-50 text-success-700` (Active badge), `bg-success-500` (progress)

---

### Semantic — Warning (Orange)

For cancellation rate icon background, "Phase 2 — Operations" badge,
"Repeat patients" bar, and warning states.

| Token                | Hex       | Use                                  |
| -------------------- | --------- | ------------------------------------ |
| `--color-warning-50`  | `#FFFAF0` | Warning icon background tint        |
| `--color-warning-100` | `#FEF0C7` | "Phase 2" badge background          |
| `--color-warning-200` | `#FEDF89` |                                      |
| `--color-warning-300` | `#FEC84B` |                                      |
| `--color-warning-400` | `#FDB022` |                                      |
| `--color-warning-500` | `#F79009` | **Default warning** (Repeat patients bar) |
| `--color-warning-600` | `#DC6803` | Warning icon stroke                  |
| `--color-warning-700` | `#B54708` | Warning text                         |
| `--color-warning-800` | `#93370D` |                                      |
| `--color-warning-900` | `#7A2E0E` |                                      |

**Tailwind usage:** `bg-warning-50` (icon bg), `text-warning-600` (icon), `bg-warning-100 text-warning-700` (Phase 2 badge)

---

### Semantic — Destructive (Coral/Red)

For file icons, the "Delete account" button, notification dot, and error states.

| Token                    | Hex       | Use                              |
| ------------------------ | --------- | -------------------------------- |
| `--color-destructive-50` | `#FEF3F2` | File icon background, error bg   |
| `--color-destructive-100` | `#FEE4E2` | Hover on destructive surfaces   |
| `--color-destructive-200` | `#FECDCA` | Borders                          |
| `--color-destructive-300` | `#FDA29B` |                                  |
| `--color-destructive-400` | `#F97066` |                                  |
| `--color-destructive-500` | `#F04438` | **Default destructive** (notification dot) |
| `--color-destructive-600` | `#D92D20` | Hover, Delete account text       |
| `--color-destructive-700` | `#B42318` | Destructive text                 |
| `--color-destructive-800` | `#912018` |                                  |
| `--color-destructive-900` | `#7A271A` |                                  |

**Tailwind usage:** `bg-destructive-50` (file icon bg), `text-destructive-600` (Delete account)

---

### Neutral — Grays (Surfaces, Borders, Muted Text)

The page background, card surfaces, dividers, and muted text.

| Token              | Hex       | Use                                       |
| ------------------ | --------- | ----------------------------------------- |
| `--color-gray-50`  | `#F9FAFB` | **Page background** (main content area)   |
| `--color-gray-100` | `#F2F4F7` | Subtle surface tint, hover states         |
| `--color-gray-200` | `#EAECF0` | **Default border** (card borders, dividers) |
| `--color-gray-300` | `#D0D5DD` | Input borders, stronger dividers          |
| `--color-gray-400` | `#98A2B3` | Placeholder text, disabled                |
| `--color-gray-500` | `#667085` | **Muted text** (secondary labels)         |
| `--color-gray-600` | `#475467` | Body text (lighter than heading)          |
| `--color-gray-700` | `#344054` | Stronger body text                        |
| `--color-gray-800` | `#1D2939` |                                           |
| `--color-gray-900` | `#101828` |                                           |

**Tailwind usage:** `bg-gray-50` (page bg), `border-gray-200` (card border), `text-gray-500` (muted)

---

## Semantic Aliases (Use These Most Often)

These map to design intent, not raw color names. **Prefer these over raw
color tokens in components** — they make dark mode and rebranding trivial.

| Alias                   | Maps to (Light)        | Use                            |
| ----------------------- | ---------------------- | ------------------------------ |
| `bg-background`         | `--color-gray-50`      | Page background                |
| `bg-card`               | `#FFFFFF`              | Card surfaces                  |
| `bg-sidebar`            | `--color-navy-800`     | Sidebar background             |
| `text-foreground`       | `--color-navy-700`     | Default heading/text           |
| `text-muted-foreground` | `--color-gray-500`     | Secondary text                 |
| `text-sidebar-foreground` | `--color-navy-100`   | Sidebar text                   |
| `text-sidebar-muted`    | `--color-navy-300`     | Sidebar inactive labels        |
| `border-border`         | `--color-gray-200`     | Default borders                |
| `border-input`          | `--color-gray-300`     | Input borders                  |
| `ring-ring`             | `--color-sky-500`      | Focus rings                    |

---

## Implementation in Tailwind v4

In `src/app/globals.css`:

\`\`\`css
@import "tailwindcss";

@theme {
  /* Brand — Navy */
  --color-navy-50: #F1F4F9;
  --color-navy-100: #D9E0EC;
  --color-navy-200: #B3C1D9;
  --color-navy-300: #7A8CA8;
  --color-navy-400: #5A6B85;
  --color-navy-500: #2C3E5C;
  --color-navy-600: #1E2D47;
  --color-navy-700: #152238;
  --color-navy-800: #0F1B2D;
  --color-navy-900: #0A1322;

  /* Brand — Sky */
  --color-sky-50: #EFF8FF;
  --color-sky-100: #D1E9FF;
  --color-sky-500: #2E90FA;
  --color-sky-600: #1570EF;
  --color-sky-700: #175CD3;

  /* Brand — Gold */
  --color-gold-100: #FEF0C7;
  --color-gold-300: #FEC84B;
  --color-gold-400: #FDB022;
  --color-gold-500: #F79009;

  /* Semantic — Success */
  --color-success-50: #ECFDF3;
  --color-success-500: #12B76A;
  --color-success-700: #027A48;

  /* Semantic — Warning */
  --color-warning-50: #FFFAF0;
  --color-warning-100: #FEF0C7;
  --color-warning-500: #F79009;
  --color-warning-600: #DC6803;
  --color-warning-700: #B54708;

  /* Semantic — Destructive */
  --color-destructive-50: #FEF3F2;
  --color-destructive-500: #F04438;
  --color-destructive-600: #D92D20;
  --color-destructive-700: #B42318;

  /* Neutral — Grays */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F2F4F7;
  --color-gray-200: #EAECF0;
  --color-gray-300: #D0D5DD;
  --color-gray-400: #98A2B3;
  --color-gray-500: #667085;
  --color-gray-600: #475467;
  --color-gray-700: #344054;

  /* Semantic Aliases */
  --color-background: var(--color-gray-50);
  --color-card: #FFFFFF;
  --color-sidebar: var(--color-navy-800);
  --color-foreground: var(--color-navy-700);
  --color-muted-foreground: var(--color-gray-500);
  --color-sidebar-foreground: var(--color-navy-100);
  --color-sidebar-muted: var(--color-navy-300);
  --color-border: var(--color-gray-200);
  --color-input: var(--color-gray-300);
  --color-ring: var(--color-sky-500);
}
\`\`\`

---

## Usage Examples From the Figma

\`\`\`tsx
// Page background and main card
<main className="bg-background min-h-screen">
  <div className="bg-card border border-border rounded-xl p-6">
    <h2 className="text-foreground font-semibold">Dr. Maya Patel</h2>
    <p className="text-muted-foreground text-sm">maya@clinicx.com</p>
  </div>
</main>

// "RDV Verified · 98" badge
<Badge className="bg-sky-50 text-sky-700">RDV Verified · 98</Badge>

// "Active" status badge
<Badge className="bg-success-50 text-success-700">
  <span className="size-1.5 rounded-full bg-success-500" />
  Active
</Badge>

// "Phase 2 — Operations" badge (warning tone)
<Badge className="bg-warning-100 text-warning-700">Phase 2 — Operations</Badge>

// Stat card warning icon
<div className="bg-warning-50 p-2 rounded-lg">
  <AlertTriangle className="text-warning-600 size-5" />
</div>

// File attachment icon
<div className="bg-destructive-50 p-2 rounded-lg">
  <FileText className="text-destructive-500 size-5" />
</div>

// Sidebar
<aside className="bg-sidebar text-sidebar-foreground">
  <span className="text-sidebar-muted text-xs uppercase">Overview</span>
</aside>
\`\`\`

---

## Strict Rules

1. **Never hardcode hex values** in component files. Always use tokens.
2. **Prefer semantic aliases** over raw color tokens (e.g., `text-foreground`
   not `text-navy-700`) wherever possible.
3. **Never invent new shades.** If a color you need isn't here, ask before
   adding it to the system.
4. **Don't mix scales.** Don't use Tailwind's default `blue-500` — use
   `sky-500` from our system.