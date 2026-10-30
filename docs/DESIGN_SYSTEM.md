# Octopus — Design System & Brand Reference

> Source: Figma file **"Octopus Website – Test"** (pages *Design System* and *Flows*).
> The file is shared **view-only with export/copy disabled** and no Dev Mode seat, so every value below was read manually from the Figma properties panel (variables, text styles, auto-layout) and from the canvas. Values marked **(est.)** could not be read exactly and are measured/estimated from the canvas. Images cannot be exported → see [§10 Assets](#10-assets).

---

## 1. Brand

| | |
|---|---|
| Brand | **Octopus** — consumer electronics (ZURU Tech design system) |
| Personality | Clean, product-first, lots of white space, soft light-grey surfaces, a single strong red accent |
| Logo | Octopus mark (stylised tentacles) + "Octopus" wordmark. Variants: *Logo + type large* (horizontal), *Logo + type small* (stacked), *Logo* (mark only). Red on white, white on red |
| Favicon | White mark on a red (#DE2027) rounded square |
| Primary colour | **Octopus Red `#DE2027`** — CTAs, category labels, footer, find-us banner |
| Typeface | **Satoshi Variable** (Indian Type Foundry / Fontshare, free licence) — used for everything |
| Imagery | Product cut-outs on `#F9F9F9` tiles + warm lifestyle photography (beige / pink tones), one hero video |

---

## 2. Breakpoints & grid

Defined in *Foundations → Grid and Layout* (layout grid styles `≥ 1200 px`, `1199 – 810 px`, `< 810 px`). The grid is **Flexbox-based** (auto-layout), not a 12-col grid.

| Token | Range | Page side margin (`--page-gutter`) | Content width | Figma frame |
|---|---|---|---|---|
| `desktop` | ≥ 1200 px | 48 px | fill, **max-width 1344 px**, centred | 1600 px |
| `tablet` | 810 – 1199 px | 32 px | fill | 810 px |
| `mobile` | < 810 px | 16 px | fill | 402 px |

At 1600 px the Figma "Desktop" padding variable resolves to 128 px = (1600 − 1344) / 2, i.e. the content is simply centred at 1344 px max with a 48 px minimum gutter.

**Tailwind mapping:** `md: 810px`, `lg: 1200px` (mobile-first; base = mobile).

---

## 3. Colour

### 3.1 Primitives

| Token | Hex | Notes |
|---|---|---|
| `red-500` | `#DE2027` | Octopus Red — primary bg, accent text, footer |
| `red-400` | `#F23F45` | primary hover |
| `red-600` | `#C2151B` | primary border |
| `red-700` | `#B1191E` | primary pressed |
| `white` | `#FFFFFF` | |
| `grey-50` | `#F9F9F9` | card / tile / accordion surface |
| `grey-100` | `#F5F5F5` | disabled bg, pressed secondary, light stroke |
| `grey-200` | `#E8E8E8` | secondary button border |
| `grey-700` | `#575757` | secondary text |
| `grey-800` | `#414141` | nav link text (ghost light) |
| `grey-900` | `#2C2C2C` | dark surface (ghost dark) |
| `grey-950` | `#1B1B1B` | primary text |
| `blue-focus` | `rgba(32,105,232,0.35)` | focus ring |

### 3.2 Semantic (Figma variable names → CSS token)

| Figma variable | Value | CSS token |
|---|---|---|
| Alias tokens/Text/Primary | `#1B1B1B` | `--color-text` |
| Alias tokens/Text/Secondary | `#575757` | `--color-text-muted` |
| Alias tokens/Text/Accent | `#DE2027` | `--color-text-accent` |
| Alias tokens/Text/White Primary | `#FFFFFF` | `--color-text-inverse` |
| Background/Main/Primary | `#FFFFFF` | `--color-bg` |
| Card/Background/Primary · FAQ/Background | `#F9F9F9` | `--color-surface` |
| Background/Footer | `#DE2027` | `--color-brand` |
| Alias tokens/Stroke/Light | `#F5F5F5` | `--color-border-subtle` |
| Color Selection/Stroke | `rgba(0,0,0,0.08)` | `--color-border-swatch` |
| Navbar/Background | `rgba(255,255,255,0.85)` | `--color-nav-bg` |
| tokens/Color/Focus Stroke | `rgba(32,105,232,0.35)` | `--color-focus` |

### 3.3 Button colours

| Variant | State | Background | Border | Text |
|---|---|---|---|---|
| **Primary** | default | `#DE2027` | `#C2151B` | `#FFFFFF` |
| | hover | `#F23F45` | `#C2151B` | `#FFFFFF` |
| | pressed | `#B1191E` | `#C2151B` | `#FFFFFF` |
| | disabled | `#F5F5F5` | `#F5F5F5` | grey (≈ `#BDBDBD`, est.) |
| **Secondary** ("Special") | default | `#FFFFFF` | `#E8E8E8` | `#1B1B1B` |
| | hover | `#F9F9F9` | `#E8E8E8` | `#1B1B1B` |
| | pressed | `#F5F5F5` | `#E8E8E8` | `#1B1B1B` |
| **Ghost light** | default | transparent | – | `#414141` |
| | hover / pressed | `#F5F5F5` / `#E8E8E8` (est.) | – | `#1B1B1B` |
| **Ghost dark** | default | transparent (on `#2C2C2C` / red) | – | `#FFFFFF` |
| All | focus | + 2 px outer ring `rgba(32,105,232,0.35)` | | |

### 3.4 Contrast check (WCAG AA)

| Pair | Ratio | Result |
|---|---|---|
| `#1B1B1B` on `#FFFFFF` | 17.2 : 1 | ✅ |
| `#575757` on `#FFFFFF` | 7.2 : 1 | ✅ |
| `#414141` on `#FFFFFF` (nav links) | 10.2 : 1 | ✅ |
| `#575757` on `#F9F9F9` | 6.9 : 1 | ✅ |
| `#FFFFFF` on `#DE2027` | 4.8 : 1 | ✅ (normal text) |
| `#DE2027` on `#FFFFFF` (category label 18 px) | 4.8 : 1 | ✅ |
| `#FFFFFF` on `#F23F45` (hover) | 3.8 : 1 | ⚠️ fails AA for 16 px text. Transient state, but in code hover uses `#C2151B` (6.2 : 1) |
| `#FFFFFF` on `#B1191E` (pressed) | 6.9 : 1 | ✅ |

---

## 4. Typography

**Font:** Satoshi Variable (weights used: 470, 500, 700). Self-host via `next/font/local` (WOFF2 from Fontshare), `display: swap`, subset Latin. Fallback: `ui-sans-serif, system-ui, sans-serif`.

### 4.1 Text styles (from Figma local styles)

| Style | Size / line-height | Weight | Letter-sp. | Usage |
|---|---|---|---|---|
| H1/L · M · S | 60 · 48 · 40 / 110% | 700 | 0 | Hero title (desktop · tablet · mobile) |
| H2/L · M · S | 44 · 40 · 32 / 110% | 700 | 0 | Section titles, banner title, PDP title |
| H3/L · M · S | 32 · 28 · 24 / 110% | 700 | 0 | "Best sellers", card titles |
| Subtitle/L · M · S | 24 · 20 · 18 / 100% | 470 | 0 | Section subtitles, banner text |
| Title/Bold | 24 / auto · 20 / auto | 700 | 0 | Small card title, PDP feature title (20) |
| Title/Weight 470 | 24 / auto · 20 / auto | 470 | 0 | Card description in flows (20) |
| Body/Bold | 16 / 100% | 700 | 0 | Footer column headings, accordion headings |
| Body/Weight 470 | 16 · 18 / 100% | 470 | 0 | PDP description, colour label, category label (18) |
| Body/Regular | 18 / auto | 400 | 0 | |
| CTA | 16 / 110% (cap-height trim) | 500 | 0 | Buttons, nav links, footer links |
| Link | 16 / 110% | 500 | 0 | |
| Small label | 14 / 110% | 470 | 0 | Copyright, small meta |
| Smallest label | 10 / 110% | 470 | 0 | |

> Body text set at 100% line-height in Figma is tight for multi-line paragraphs; in code I use `line-height: 1.3` for multi-line body copy (documented deviation, improves readability/a11y).

### 4.2 Responsive mapping

| Role | Mobile < 810 | Tablet 810–1199 | Desktop ≥ 1200 |
|---|---|---|---|
| Display (hero) | 40 | 48 | 60 |
| Heading 2 | 32 | 40 | 44 |
| Heading 3 | 24 | 28 | 32 |
| Subtitle | 18 | 20 | 24 |
| Card description | 16 | 18 | 20 |

Implemented as fluid `clamp()` tokens so sizes interpolate smoothly between breakpoints.

---

## 5. Spacing, radius, elevation

### 5.1 Spacing scale (observed values)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 60 · 64 · 80 · 120 · 160 · 180` px — Tailwind default 4 px base covers all of them (`1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 30, 40, 45`).

Recurring gaps: **24** (card grids, carousel), **32** (heading → CTA, banner content), **40** (section title → carousel), **48** (explore categories), **80** (section heading → content), **16** (PDP bento, spec rows).

### 5.2 Section vertical rhythm (desktop)

| Section | Padding top / bottom |
|---|---|
| Best sellers | 120 / 60 |
| Kitchen | 60 / 180 |
| Home Security | 180 / 120 |
| Accessories | 120 / 120 |
| Explore all categories | 120 / 180 |
| Tablet sections | 80 / 80 |

### 5.3 Radius

| Token | Value | Usage |
|---|---|---|
| `radius-pill` | 9999 px | Buttons ("Button" variable), focus ring (32 at 40 px height) |
| `radius-nav` | 32 px | Floating navbar & mobile menu |
| `radius-card` | 24 px (est.) desktop/tablet · 16 px mobile | Cards, tiles, images ("Card" variable) |
| `radius-specifics` | 16 px (est.) | Accordion / downloads box ("Specifics" variable) |
| `radius-full` | 50% | Colour swatch, icon buttons |

### 5.4 Elevation & effects

| Token | Value |
|---|---|
| `shadow-nav` | `0 0 16px 8px rgba(0,0,0,0.08)` |
| `blur-nav` | Figma background blur 64 → CSS `backdrop-filter: blur(32px)` |
| `shadow-hard` / `shadow-soft` | Effect styles exist ("Shadow/Hard", "Shadow/Soft") but values are hidden in view-only mode → not used by the two pages |

---

## 6. Components

### 6.1 Button
- Height **40**, padding **11 × 16**, gap 10 (icon), border 1 px, pill radius, label = **CTA** style.
- **Icon-only:** 40 × 40 circle, chevron icon 24 px.
- Variants: `primary` · `secondary` · `ghost` (light) · `ghost-inverse` (dark / on red). States: default · hover · focus-visible · pressed · disabled.
- Used as `<a>` (links: "Learn more", "Where to buy", "Explore all products") or `<button>` (carousel arrows, menu toggle) → polymorphic component.

### 6.2 Navbar (floating pill)
- Floats over the page at the top (inset ~24 px desktop, 8–16 px mobile), `position: fixed` / sticky.
- Container: max-width 1344, height **64**, radius **32**, padding **12 / 12 / 12 / 20**, `justify: space-between`, bg `rgba(255,255,255,.85)` + backdrop blur + `shadow-nav`.
- **Desktop ≥ 1200:** logo + wordmark left · links (Kitchen, Home Security, Hair Care, Accessories — ghost buttons) + primary "Where to buy" right.
- **Tablet (Figma):** same inline links in a narrower pill (content-hugging). ⚠️ The brief says the nav must collapse into a menu **below 1200 px** → I follow the brief (see §11).
- **Mobile:** pill with logo mark + hamburger (≡). **Open state:** card (radius 32, padding 8 × 16, gap 16, same glass bg) with logo + close (✕), stacked links, full-width primary "Where to buy".

### 6.3 Footer
- bg `#DE2027`, padding **60 top / 24 bottom**, horizontal = page gutter, gap 60, top border 0.5–1 px (separates it from the red find-us banner).
- Row: big white stacked logo (left) · columns right: **Our Products** (Kitchen, Hair Care / Home Security, Accessories — 2 sub-columns) and **Learn** (Where to buy, Contact us). Headings **Body/Bold** white, links CTA white (ghost-inverse).
- Bottom row: "Copyright 2026 Octopus - All rights reserved" (Small label) left · "Policies & Terms" right.
- Tablet: same structure, narrower. Mobile: fully stacked (logo → Our Products 1-col → Learn → copyright → Policies & Terms).

### 6.4 Section heading ("Heading" component)
- Centered vertical stack, max-width 1344, gap **32** between text group and CTA.
- Type `Heading 1` (hero): H1 + Subtitle + primary CTA. Type `Heading 2` (sections): H2 + Subtitle (secondary text) + **secondary** button "Explore all products".
- Left-aligned variant for "Best sellers" / "Explore all categories" titles (H3).

### 6.5 Cards

| Card | Layout | Desktop size | Content |
|---|---|---|---|
| **Carousel card** (best sellers, home) | horizontal: text column (450 px) left, product image right | 1048 × 589 (padding-left 80) | Category (Body 18, red) · Name (H3/L) · Description (Title 470/20, muted) · primary "Learn more" |
| — tablet | horizontal | 688 × 413 (pad 40 / 64, gap 32) | |
| — mobile | vertical, centered text top, image bottom | 320 × 512 (pad 32 × 24, gap 24, radius 16) | |
| **Card Large** | image background (lifestyle), text over it; *horizontal* (text left) or *vertical* (text centred top) | 1344 × 755 (16:9-ish), padding 80, gap 32 | Name (H3/L) · description · "Learn more" |
| **Card Medium** | `#F9F9F9`; *vertical* (text centred top, product image 600² bottom) or *horizontal* (text left, image right) | 660 × 880 (vertical), 660 × ~508 (horizontal) | same |
| **Card Small** (accessories) | `#F9F9F9`; image top, left-aligned text | ~432 wide (3 cols) | Name (Title/Bold 24) · description · "Learn more" |
| **Product card** (PDP best sellers) | image tile `#F9F9F9` square + text below | ~ 1/5 of row | Name (Title bold) · short description (muted) — whole card is a link |
| **Category tile** (explore) | square image tile `#F9F9F9` + centred label below | ~318 × 318 | Kitchen · Home Security · Hair Care · Accessories |

### 6.6 Carousel
- Horizontal scroll container, gap **24**, scroll-snap per card, next card **peeks** at the edge.
- Controls row under the track, right-aligned: prev / next **icon buttons** (40 px, ghost/secondary circle), gap 8. Prev disabled at start, next disabled at end.
- Figma shows **no pagination dots** — the brief requires dots on desktop → added under the track (see §11).
- Touch: native swipe via `scroll-snap`. Keyboard: arrows focusable, track is a labelled region.
- Home "Best sellers": 3 carousel cards (1 visible + peek on desktop/tablet/mobile). PDP "Best sellers": product cards, ~5 visible desktop, 3 tablet, 2 mobile.

### 6.7 Banner (full-bleed)
- Full viewport width, height ≈ width / 2.4 on desktop (1600 × 667). Background image `object-fit: cover`.
- Content aligned to the page grid, vertically centred, gap 32 (title) / 24 (find-us).
- **Hair Care banner:** H2 "Octopus Ionic Hair Dryer" + Subtitle (max 450 px, dark text) + primary "Learn more". Mobile: text centred on top, image below.
- **Find-us banner:** red product photo, "Find us at" + retailer logo (white) + white secondary button "Find your nearest store" (→ placeholder route).

### 6.8 Hero (homepage)
- Full-bleed **video** (`OctopusHairDryer_4K.mp4`) 1600 × 900 desktop · 810 × 1132 tablet · full-height mobile; grey studio shot of the hair dryer.
- Overlay heading (centred, top area under the navbar): H1 "Octopus Ionic Hair Dryer" + subtitle + primary "Learn more". Play/pause control in the centre.
- Implementation: poster image as LCP, video `preload="none"`, muted/loop/playsInline, pause button for a11y, `prefers-reduced-motion` → poster only.

### 6.9 PDP — Product info
- Right column (desktop) 555 px, padding-top 160, gap 32, **sticky** while the gallery scrolls; inner content 355 px.
- Title **H2/L** · Description **Body 470 / 16** muted · "Colour - {name}" (Body 470, muted) · swatches · full-width primary "Where to buy".
- **Colour swatch:** 30 × 30 circle, border 1 px `rgba(0,0,0,.08)`; selected = red ring (`#DE2027`, 1–2 px with white gap). Implemented as a `radiogroup`.
- Mobile: title/description stacked under the image; "Where to buy" becomes a **sticky bottom bar**.

### 6.10 PDP — Gallery & feature bento
- Left column 709 px, vertical, gap **80**: product image (709 × 900, `#F9F9F9`), lifestyle image (709 × 945), **feature bento**, second lifestyle image, product details.
- **Feature bento** (gap 16): F1 full-width (text left over image) · F2 + F3 half-width tall (text top, image) · F4 full-width. Title **Title/Bold 20**, description **Body 470/16**.
- Tablet / mobile: single column, features stacked full-width.

### 6.11 PDP — Specification accordion & downloads
- Container bg `#F9F9F9`, radius "Specifics", padding 4 × 20.
- Row: header (Body/Bold) + chevron, padding 16 / 16, gap 16, bottom border 1 px `#F5F5F5`. Open content = bullet list "Label: value" (Body 470, muted).
- Sections: Technical specifications · Dimensions & weight · Product information (+ optional Performance & display, Movement & control, Connectivity, In the box — hidden for the blender).
- **Downloads** box (separate, same surface): "Downloads" + download icon + "User manual".
- Implementation: accessible accordion (button + `aria-expanded` + `aria-controls`, region), each section independently toggled.

---

## 7. Page layouts

### 7.1 Homepage

| # | Section | Desktop ≥ 1200 | Tablet 810–1199 | Mobile < 810 |
|---|---|---|---|---|
| 1 | Navbar | floating pill, full nav | pill + menu (brief) | pill + hamburger |
| 2 | Hero | video 16:9, heading overlay | video portrait-ish (810 × 1132) | video full-height, heading top |
| 3 | Best sellers | title left + carousel cards 1048 w + controls | single card + peek | vertical card + peek |
| 4 | Kitchen | heading + Card Large (horizontal) + 2 Card Medium (vertical) side by side | same, scaled | all stacked, text centred |
| 5 | Hair Care banner | full-bleed, text left | full-bleed, text left | text top centred, image below |
| 6 | Home Security | heading + Card Large **vertical** (left, tall) + 2 Card Medium **horizontal** stacked (right) | Card Large horizontal full-width + 2 Medium vertical side by side | stacked |
| 7 | Accessories | heading + 3 Card Small in a row | 3 in a row | stacked |
| 8 | Explore all categories | 4 tiles in a row | 4 in a row | 2 × 2 |
| 9 | Find-us banner | full-bleed red, text left | text top-left | text top |
| 10 | Footer | row | row | stacked |

### 7.2 Product Detail Page (Octopus Countertop Blender)

| Section | Desktop | Tablet | Mobile |
|---|---|---|---|
| Body | 2 columns (gallery 709 · info 555, gap 80), info sticky | info on top (title, desc, colour, CTA), gallery single column below | image, info, gallery stacked; sticky bottom CTA |
| Feature bento | F1 wide · F2/F3 half · F4 wide | single column | single column |
| Specs + downloads | under gallery (709) | full width | full width |
| Best sellers | product-card carousel, 5 visible | 3 visible | 2 visible |
| Footer | | | |

---

## 8. Motion (from *Motion Documentation*)

| Property | Value |
|---|---|
| Pattern | **Scroll reveal** |
| Trigger | section enters viewport (align top), **no replay** |
| Enter | `opacity 0 → 1` + `translateY(60px → 0)` ("travel/lg"); text-only blocks use 30 px ("travel/md") |
| Timing | `ease-out`, **1.2 s**, delay **0.1 s**; elements in the same section fire together (no stagger) |
| Exit | none |
| Reduced motion | opacity only, no translate |
| Applies to | Homepage H01–H16 (hero heading, best sellers title + carousel, each category heading + cards, explore title + cards); PDP P01–P09 (product info, images, bento cards, specs box, downloads box) |

Micro-interactions: button colour transitions (~150 ms), carousel smooth scroll, accordion height transition, mobile menu fade/scale.

Implementation: one tiny `<Reveal>` client component using `IntersectionObserver` + CSS classes (no animation library → zero JS cost for the rest of the page).

---

## 9. Content inventory

### 9.1 Categories
`kitchen` → Kitchen — "Powerful appliances for everyday cooking" · `home-security` → Home Security — "Home feels safer when you're always in the loop" · `hair-care` → Hair Care (banner: "Dry your hair faster and with less frizz with this powerful ionic hair dryer") · `accessories` → Accessories — "The little things that make everything work better".

### 9.2 Products (catalogue from *Products Cards*)

| Product | Category | Short description |
|---|---|---|
| Octopus Countertop Blender | kitchen | A powerful blender that crushes ice and blends smooth with seven presets |
| Octopus Blender | kitchen | A portable blender that blends straight into a cup you can take with you |
| Octopus Air Fryer 5.7 L | kitchen | A 5.7 L air fryer that cooks meals quickly and evenly, with 2200W and dual heaters |
| Octopus Kettle 1.7 L | kitchen | A 1.7 L kettle that boils fast on 1800W, with a body that stays cool to the touch |
| Octopus Indoor Camera | home-security | A 2K indoor camera that pans to cover the whole room and tracks movement as it happens |
| Octopus Outdoor Camera | home-security | An outdoor camera that runs on solar power and records in 3K |
| Octopus Video Doorbell | home-security | A 2K video doorbell that lets you answer from your phone |
| Octopus Ionic Hair Dryer | hair-care | A powerful hair dryer with a 110,000 RPM motor for fast and efficient drying |
| Octopus Power Bank 10,000 mAh | accessories | A slim power bank with the USB-C cable already built in |
| Octopus Power Bank 20,000 mAh | accessories | A 20,000 mAh power bank with the USB-C cable built in and enough charge for several days out |
| Octopus Power Board with USB Charging | accessories | A compact power board with four sockets and four USB ports |
| Octopus 3-in-1 Magnetic Charging Station | accessories | A Qi2 stand that charges your phone, watch and earbuds at the same time |
| Octopus USB-C Cable | accessories | A USB-C cable that carries up to 100W, in 1 m and 2 m lengths |
| Octopus Magnetic USB-C Cable | accessories | A 1.2 m magnetic USB-C cable that coils itself away and carries up to 100W |
| Octopus Car Charger 42 W | accessories | A 42W car charger that fast-charges two devices from one socket |
| Octopus USB-C Charger 30W | accessories | A compact 30W USB-C wall charger that fast-charges phones and small laptops |

Copy differs slightly between DS cards and Flows (e.g. hair dryer "…less frizz" vs "…efficient drying"): **Flows copy wins**.

### 9.3 Homepage placement
- **Best sellers (carousel):** Air Fryer 5.7 L (Kitchen) · Indoor Camera (Home Security) · Ionic Hair Dryer (Hair Care)
- **Kitchen:** Large = Kettle 1.7 L · Medium = Blender, Countertop Blender
- **Home Security:** Large = Indoor Camera · Medium = Outdoor Camera, Video Doorbell
- **Accessories:** Small = Power Bank 10,000 mAh, Power Board with USB Charging, 3-in-1 Magnetic Charging Station
- **PDP best sellers:** Ionic Hair Dryer, Blender, Air Fryer 5.7 L, Indoor Camera, Kettle (+ more)

### 9.4 PDP — Octopus Countertop Blender
- Description: "The Octopus Countertop Blender has the power for daily smoothies and tougher jobs alike. A 1500W motor and seven presets handle most of the work, and a one-touch clean cycle rinses the jug so you don't have to."
- Colour: Black (only one swatch in Figma)
- Features: **Powers through the tough stuff** — A 1500W motor lets you do anything from crushing ice to blending smoothies · **Skip the scrubbing** — Add water and a little detergent, press clean, and the blender cleans itself · **Control in short bursts** — The pulse function runs the blades in bursts, giving you even more control · **A preset for the everyday** — Seven intelligent presets for smoothies, soups, purées & more
- Specs: Technical specifications — Power: 1500W · Voltage: 220–240 V · Frequency: 50/60 Hz · Dimensions & weight — Dimensions: 238 × … (truncated in Figma) · Product information — Model: BL9023-CB · Downloads — User manual

---

## 10. Assets

Export is disabled, so **no original image can be downloaded**. Strategy (allowed by the brief):
- Neutral placeholders with the **exact aspect ratio** of each slot (product tile 1:1, medium image 1:1, large card 16:9, banner 2.4:1, hero video 16:9 → poster image, PDP images 709 × 900 / 709 × 945).
- One `ImagePlaceholder` / `next/image` wrapper so real assets can be dropped in `public/images` later without touching components.
- Logo & icons re-drawn as inline SVG (simple shapes) — logo approximated, flagged in README.
- Find-us banner: The Warehouse icon (SVG, decorative) + retailer name as text.

Original Figma filenames (for future replacement): `OctopusHairDryer_4K.mp4`, `Hair_Dryer Final_rev04_Resized.png`, `BANNER_003_FOTOMOD…`, `Octopus Indoor Camera.png`, `Octops Blender 灰底-02.png`, …

---

## 11. Discrepancies, gaps & decisions

| # | Topic | Figma | Brief | Decision |
|---|---|---|---|---|
| 1 | Tablet navigation | inline links + CTA in a pill | collapse into menu below 1200 px | **Follow the brief** (menu < 1200) — the inline tablet nav also overflows at ~810 px |
| 2 | Carousel dots | not drawn | arrows + dots on desktop | Add dots under the track (token-styled), keep arrows right-aligned |
| 3 | Colour selector | single "Black" swatch | selecting a colour updates state | Add 2–3 colours in data (Black, Silver, Red — assumption) |
| 4 | Radius values | "Card" / "Specifics" variables, values hidden | – | 24 px / 16 px estimated from canvas |
| 5 | Spec values | partly hidden (dimensions truncated) | – | Fill with plausible placeholder values, marked in data |
| 6 | Primary hover contrast | `#F23F45` + white = 3.8 : 1 | WCAG AA | Hover uses `#C2151B` (6.2 : 1), documented deviation |
| 7 | Line-height 100% on body | tight | readability | 1.3 for multi-line body copy |
| 8 | Images | export disabled | "export from Figma" | Placeholders with correct ratio |
| 9 | Hero | video | Lighthouse ≥ 90 mobile | Poster image as LCP, lazy video, play/pause control |

---

## 12. Proposed Tailwind v4 tokens (`app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Breakpoints (mobile-first) */
  --breakpoint-md: 810px;
  --breakpoint-lg: 1200px;

  /* Font */
  --font-sans: var(--font-satoshi), ui-sans-serif, system-ui, sans-serif;

  /* Colours */
  --color-brand: #de2027;
  --color-brand-hover: #c2151b; /* Figma #f23f45 fails AA with white text */
  --color-brand-border: #c2151b;
  --color-brand-pressed: #b1191e;
  --color-ink: #1b1b1b;
  --color-ink-muted: #575757;
  --color-ink-nav: #414141;
  --color-surface: #f9f9f9;
  --color-surface-strong: #f5f5f5;
  --color-line: #e8e8e8;
  --color-dark: #2c2c2c;
  --color-focus: rgb(32 105 232 / 0.35);

  /* Type scale (fluid) */
  --text-display: clamp(2.5rem, 1.6rem + 2.4vw, 3.75rem);   /* 40 → 60 */
  --text-h2: clamp(2rem, 1.6rem + 1.1vw, 2.75rem);          /* 32 → 44 */
  --text-h3: clamp(1.5rem, 1.2rem + 0.8vw, 2rem);           /* 24 → 32 */
  --text-subtitle: clamp(1.125rem, 1rem + 0.4vw, 1.5rem);   /* 18 → 24 */
  --text-card: clamp(1rem, 0.9rem + 0.3vw, 1.25rem);        /* 16 → 20 */

  /* Radius */
  --radius-card: 1.5rem;
  --radius-nav: 2rem;
  --radius-specifics: 1rem;

  /* Layout */
  --container-content: 84rem; /* 1344px */

  /* Effects */
  --shadow-nav: 0 0 16px 8px rgb(0 0 0 / 0.08);
}
```
