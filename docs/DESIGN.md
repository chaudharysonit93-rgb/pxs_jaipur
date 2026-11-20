# PXS Design System & Brand Token Guide

> **Core Philosophy:** High-fashion dark luxury streetwear for Gen-Z in Jaipur, India.
> **Tagline:** *"NOT MADE TO BLEND IN."*

---

## 1. Color Palette & The 5% Electric Lime Rule

| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| `--color-bg-base` | `#111111` | Primary background canvas. Deep matte charcoal. |
| `--color-bg-surface` | `#181818` | Elevated container surface (product cards, drawers, forms). |
| `--color-bg-elevated` | `#222222` | Modal dialogs, dropdowns, sticky action bars. |
| `--color-text-primary` | `#F3F0E9` | Cream primary typography (16.5:1 contrast against `#111111`). |
| `--color-text-secondary` | `#858585` | Muted grey for specs, SKU codes, breadcrumbs, and inactive borders. |
| `--color-accent` | `#C7F36B` | **Electric Lime.** Primary CTAs, active pills, scarcity alerts. |

### The 5% Electric Lime Rule:
Electric Lime is an editorial exclamation mark, **not** a base color.
* **Allowed:** "Shop the Drop" CTA button, active navigation indicator dot, "Only 2 left" low-stock indicator, checkout place order button.
* **Forbidden:** Large background sections, large blocks of text, or card wrappers. Using neon excessively cheapens luxury streetwear.

---

## 2. Typography Strategy & Hierarchy

* **Headlines & Editorial Titles:** **`Syne`** (Weights: 700 Bold, 800 Extra Bold)
  * Geometric, brutalist, and avant-garde. Used for hero titles, section headings, and category titles.
* **Body Copy & Technical Specs:** **`Inter`** (Weights: 400 Regular, 500 Medium, 600 Semi-Bold)
  * Designed specifically for clarity on high-DPI smartphone screens. Used for prices, descriptions, sizing tables, and form inputs.

### Fluid Typography Scale:
* `--text-hero`: `clamp(2.5rem, 6.5vw, 5.25rem)`
* `--text-h1`: `clamp(2rem, 4.5vw, 3.5rem)`
* `--text-h2`: `clamp(1.4rem, 3vw, 2.25rem)`
* `--text-body`: `clamp(0.9rem, 1vw, 1rem)`

---

## 3. Spacing Discipline (8pt Grid)

All margins and paddings adhere strictly to the 8pt scale:
* `4px` (`--space-2xs`): Micro badge padding
* `8px` (`--space-xs`): Icon gap, size pill gap
* `16px` (`--space-md`): Standard card padding, input padding
* `24px` (`--space-lg`): Grid gap on mobile
* `32px` (`--space-xl`): Section padding on mobile
* `64px` (`--space-3xl`): Desktop section spacing
* `96px` (`--space-4xl`): Major hero separation
