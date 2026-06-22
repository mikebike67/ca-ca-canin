---
name: site
description: Use when someone asks to change, update, improve, add, or fix anything on the Ca-Ca Canin website — layout, copy, new pages, new sections, SEO, performance, components, forms, or design. Also load when the user asks about how the site works, what pages exist, how bilingual content is structured, or how the brand colors/styles are applied. This is the primary context skill for all Ca-Ca Canin website work.
---

## Ca-Ca Canin Website — Full Context

Read this before making any changes to the site.

---

## Business Overview

**Ca-Ca Canin** is a dog waste removal (pooper scooper) service operating in Laval and the North Shore of Quebec. The site's job is to convert homeowners into paying customers via a quick quote + booking flow.

- **URL:** cacacanin.com
- **Phone:** +1-438-880-8922
- **Email:** cacacaninqc@gmail.com
- **Service area:** Laval, Blainville, Bois-des-Filion, Boisbriand, Deux-Montagnes, Lorraine, Mirabel, Oka, Pointe-Calumet, Rosemère, Saint-Eustache, Saint-Joseph-du-Lac, Sainte-Anne-des-Plaines, Sainte-Marthe-sur-le-Lac, Sainte-Thérèse
- **Languages:** English (primary, `/`) and French (`/fr`)
- **Target customer:** Busy homeowners with dogs who are tired of cleaning up themselves

**Services:**
- Regular recurring service (weekly, bi-weekly, monthly)
- One-time cleanup
- Pricing: one-time = $60 first 30 min, then $5 per additional 5-min block; recurring = per-visit rate based on dogs/yard size (see `lib/booking.ts` `BASE_PRICING`)
- No contracts, cancel anytime, gate photos after every visit, arrival text notifications

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui |
| UI primitives | Radix UI + class-variance-authority |
| Deployment | Cloudflare Pages via `@opennextjs/cloudflare` |
| Maps | Mapbox GL + react-map-gl |
| Email | Nodemailer |
| Icons | Lucide React |
| Node | >=20 <21 |

**Key scripts:**
- `npm run dev` — local dev
- `npm run deploy` — build + deploy to Cloudflare
- `npm run build:cf` — Cloudflare build only

---

## Brand & Design System

### Colors (defined in `tailwind.config.ts`)

```
brand-green:        #307944   ← primary CTAs, icons, borders, highlights
brand-green-dark:   #265e36   ← hover state for green buttons
brand-brown:        #724420   ← secondary CTA
```

### Recurring Patterns

**Standard card:**
```tsx
className="border border-[#d7e6da] bg-white shadow-[0_18px_45px_rgba(48,121,68,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_24px_60px_rgba(48,121,68,0.14)]"
```

**Green icon container:**
```tsx
className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/15 bg-[#eef7f0]"
```

**Light green accent background:** `bg-[#eef7f0]`

**Section backgrounds:** alternate `bg-white` and `bg-gray-50`

**Primary CTA button:**
```tsx
className="rounded-full bg-brand-green px-6 py-4 text-white hover:bg-brand-green-dark"
```

**Secondary CTA button:**
```tsx
className="rounded-full border-2 border-brand-brown bg-brand-brown text-white hover:bg-brand-brown/90"
```

### Scroll Animations

Elements that should animate in on scroll get `className="scroll-animation"`. The homepage uses an IntersectionObserver that adds `animate-in` when they enter the viewport. Staggered delays use `scroll-delay-1`, `scroll-delay-2`, `scroll-delay-3`.

### Responsive Rules

- Mobile-first; use `md:` and `lg:` breakpoints
- Hero dog image is `hidden lg:flex` (hidden on mobile)
- Section images use two copies: one `hidden md:block` (desktop), one shown inline on mobile with `md:hidden`
- CTA buttons are full-width on mobile (`w-full`), auto on `sm:` (`sm:w-auto`)
- Two-column grids: `grid md:grid-cols-2` or `grid md:grid-cols-3`

---

## Page Map

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | English home — hero, calculator, services, map, FAQ |
| `/fr` | `app/fr/page.tsx` | French home — mirrors English |
| `/about` | `app/about/page.tsx` | About the company |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `/faq` | `app/faq/page.tsx` | FAQ page |
| `/dog-poop-cleanup` | `app/dog-poop-cleanup/page.tsx` | Service landing page |
| `/thank-you` | `app/thank-you/page.tsx` | Post-form confirmation |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |

---

## Key Components

| Component | File | What it does |
|-----------|------|-------------|
| `SiteHeader` | `components/site-header.tsx` | Nav bar. Takes `locale`, `altHref`, `ctaLabel`, `ctaHref` props |
| `SiteFooter` | `components/site-footer.tsx` | Footer. Takes `locale` prop |
| `RegularServiceCalculator` | `components/regular-service-calculator.tsx` | Pricing calculator + quote form. Dynamic import (no SSR). Takes `locale` |
| `BeforeAfterGallery` | `components/before-after-gallery.tsx` | Before/after photo slider. Dynamic import. Takes `locale` |
| `ServiceAreaMap` | `components/service-area-map.tsx` | Mapbox map of service areas. Dynamic import. Takes `locale` |
| `ContactForm` | `components/contact-form.tsx` | Contact/quote request form |
| `RegularServiceLocationPage` | `components/regular-service-location-page.tsx` | Template for city-specific regular service pages |
| `LocationSwitcher` | `components/location-switcher.tsx` | Switcher between service locations |
| `LegalPageShell` | `components/legal-page-shell.tsx` | Wrapper for privacy/terms pages |

**shadcn/ui components** live in `components/ui/`: `Button`, `Card`, `CardHeader`, `CardContent`, `CardDescription`, `CardTitle`.

**Utility:** `lib/utils.ts` has `cn()`. Import it with `import { cn } from "@/lib/utils"`. The `util/cn.ts` file also exists — prefer `lib/utils.ts`.

---

## Bilingual Rules

- English is the primary language at `/`
- French mirrors English at `/fr`
- Pass `locale="en"` or `locale="fr"` to `SiteHeader`, `SiteFooter`, `RegularServiceCalculator`, `BeforeAfterGallery`, `ServiceAreaMap`
- `SiteHeader` takes `altHref` — the link to the alternate language version (e.g., `altHref="/fr"` on the English page)
- When you edit copy on one language page, always make the equivalent change on the other language page
- New components that render user-visible text should accept a `locale` prop and return the correct language string

---

## Development Conventions

**File structure:**
```
app/            ← Next.js App Router pages
components/     ← Shared components
components/ui/  ← shadcn/ui primitives
lib/            ← Data files and utilities
public/         ← Static assets (images, fonts)
```

**Page-level conventions:**
- Add `'use client'` at the top of pages and components that use hooks or browser APIs
- Use `next/dynamic` with `{ ssr: false }` for heavy components (calculator, gallery, map)
- Use `next/image` for all images — always provide `width`, `height`, `sizes`, and `alt`
- Structured data (JSON-LD) goes inline in the page via `<script type="application/ld+json">`
- Skip-to-content link at the top of pages for accessibility

**Imports:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
```

**SEO:**
- `app/sitemap.ts` generates the sitemap
- `app/robots.ts` generates robots.txt
- Meta tags via Next.js `metadata` export (static) or `generateMetadata` (dynamic)

---

## How to Approach Requests

1. **Copy changes:** Find the exact text in the relevant page file. Update both EN (`app/page.tsx`) and FR (`app/fr/page.tsx`) versions. Never change one without noting the other needs updating.

2. **Layout/section changes:** Follow the existing section pattern — `<section>` with `px-4 sm:px-6 lg:px-8`, `max-w-7xl mx-auto`, alternating `bg-white`/`bg-gray-50`. Use the standard card pattern for feature cards.

3. **New pages:** Copy the closest existing page as a starting point. Add the route to `app/sitemap.ts`. Create both EN and FR versions if it's a primary page.

4. **New components:** Accept `locale` if they render text. Use dynamic import in pages if they use browser APIs or are large.

5. **Pricing changes:** Update `components/regular-service-calculator.tsx` for pricing logic. Always check both EN and FR pages for hardcoded copy.

6. **Performance:** Heavy components (map, gallery, calculator) are already dynamically imported. Keep images using `next/image` with proper `sizes`. Avoid adding large client-side dependencies.

7. **When in doubt:** Read the source file first. The patterns are consistent — match what's already there rather than introducing new patterns.
