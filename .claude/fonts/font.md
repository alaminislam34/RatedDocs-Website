# Fonts — RatedDocs

This project uses **one font only**: Plus Jakarta Sans.

---

## Font Family

**Plus Jakarta Sans** — a clean, modern geometric sans-serif by Tokotype.
Open source, available via Google Fonts.

- License: Open Font License (OFL)
- Google Fonts: https://fonts.google.com/specimen/Plus+Jakarta+Sans
- GitHub: https://github.com/tokotype/PlusJakartaSans

Why this font:
- Excellent legibility at all sizes (great for dashboards)
- Wide weight range (200–800) — only 400–800 used here
- Friendly, approachable character — suits a patient-facing platform
- Strong numeric forms with tabular variants — important for stat displays

---

## Loaded Weights

Only the weights we actually use are loaded. Loading unused weights
increases bundle size and hurts FCP.

| Weight | Name      | Loaded |
| ------ | --------- | ------ |
| 200    | ExtraLight | ❌ No |
| 300    | Light     | ❌ No  |
| 400    | Regular   | ✅ Yes |
| 500    | Medium    | ✅ Yes |
| 600    | SemiBold  | ✅ Yes |
| 700    | Bold      | ✅ Yes |
| 800    | ExtraBold | ✅ Yes |

If a future design requires Light (300), update this list AND the
`next/font` config simultaneously.

---

## Loading Setup

Load via `next/font/google` in `src/app/layout.tsx`. This is the only
acceptable way to load fonts in this project.

\`\`\`tsx
// src/app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
\`\`\`

---

## Tailwind v4 Integration

In `src/app/globals.css`:

\`\`\`css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-sans), 'Plus Jakarta Sans', system-ui, sans-serif;
}
\`\`\`

Now `font-sans` (Tailwind's default) maps to Plus Jakarta Sans across
the entire app. Because it's the only font, `<body className="font-sans">`
in the root layout means **every element inherits it by default** — you
rarely need to apply `font-sans` again.

---

## Why `next/font` Only

Never load fonts via:

- ❌ `<link rel="stylesheet" href="https://fonts.googleapis.com/...">`
- ❌ `@import url('https://fonts.googleapis.com/...')` in CSS
- ❌ Self-hosted fonts via `@font-face` (unless deliberately needed)

Reasons:

1. **No layout shift.** `next/font` inlines the font CSS and matches
   fallback metrics to prevent Cumulative Layout Shift (CLS).
2. **No external request.** Fonts are self-hosted at build time, served
   from your own origin. Faster, more private, no Google connection.
3. **Automatic preload.** Critical font subsets are preloaded in `<head>`.
4. **GDPR-friendly.** No request to Google Fonts servers from the user.
5. **Variable font support.** Plus Jakarta Sans is variable — `next/font`
   handles axis loading correctly.

---

## Fallback Behavior

If Plus Jakarta Sans fails to load, the fallback stack is:

\`\`\`
'Plus Jakarta Sans', system-ui, sans-serif
\`\`\`

`next/font` uses `size-adjust`, `ascent-override`, and similar properties
to make the fallback render at near-identical dimensions to Plus Jakarta
Sans. This means even if the web font is slow, the page won't shift
when it finally loads.

---

## Numeric Display

For tables, stats, and aligned numbers, use Tailwind's `tabular-nums`
utility. Plus Jakarta Sans supports tabular figures via OpenType:

\`\`\`tsx
<td className="tabular-nums">$48,200</td>
<td className="tabular-nums">312</td>
\`\`\`

This forces all digits to have the same width — essential for columns
of numbers that need to align.

---

## Adding a Custom Font File (Future Reference)

If you ever need to add a custom font file (e.g., a licensed brand font),
the process is:

1. Place font files in `public/fonts/` (e.g., `BrandFont-Regular.woff2`).
2. Use `next/font/local`:

\`\`\`tsx
import localFont from 'next/font/local';

const brand = localFont({
  src: [
    {
      path: '../../public/fonts/BrandFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    // ...other weights
  ],
  variable: '--font-brand',
  display: 'swap',
});
\`\`\`

3. Update this file with the new font's details and rationale.
4. Update `colors.md` and `typography.md` if it changes typography rules.

**Never add a second font without team agreement.** Two fonts means two
loading costs, two scales to maintain, and inconsistency risk.

---

## Strict Rules

1. **One font only: Plus Jakarta Sans.** No exceptions without team approval.
2. **Load via `next/font` only.** No `<link>`, no `@import`, no manual
   `@font-face` (except custom local fonts, which still go through
   `next/font/local`).
3. **Only load weights you use** (400, 500, 600, 700, 800). Adding 100,
   200, 300 wastes bandwidth.
4. **Always use `font-sans`** (Tailwind's default class, mapped to Jakarta).
   Never use `font-serif` or `font-mono` except for code blocks.
5. **For monospace** (like registration numbers `CA-DDS-44192`), use
   `font-mono` — it falls back to the system monospace stack. Don't
   load a second web font for this.