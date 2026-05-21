# Design System Documentation: High-End Editorial for CATTLEYA

## 1. Overview & Creative North Star

### The Creative North Star: "The Ethereal Editorial"
This design system is not a utility; it is an invitation to the "Immense Beauty of Heaven." We are moving away from the rigid, boxed-in layouts of standard e-commerce and toward a high-end editorial experience that mirrors the intricate, flowing artistry of Batik. 

The system utilizes **Intentional Asymmetry** and **Tonal Layering** to create a sense of weightlessness. By leveraging high-contrast shifts between a dark, "infinite void" (Navigation/Footer) and "heavenly" luminous surfaces (Content), we create a dramatic rhythm that guides the user through a curated gallery rather than a simple storefront.

---

## 2. Colors & Surface Logic

Our palette is anchored by the tension between the aggressive energy of **Plasma Red** and the cooling serenity of **Mercury** and **Rich White**.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. We define boundaries through background color shifts.
*   To separate content, transition from `surface` (#fcf9f8) to `surface_container_low` (#f6f3f2).
*   Structure is defined by the proximity of elements and the change in tonal value, never by a stroke.

### Surface Hierarchy & Nesting
Treat the interface as a series of physical layers—stacked sheets of fine paper.
*   **Base Layer:** `surface` (#fcf9f8).
*   **Secondary Layer (Mercury):** Use `surface_container` (#f0edec) or `surface_container_high` (#ebe7e7) for cards and modular sections.
*   **The Dark Void:** The `inverse_surface` (#313030) and `on_background` (#1c1b1b) are reserved for the Navbar and Footer to "bookend" the experience in luxury.

### Signature Gradients & Textures
*   **Plasma Gradient:** Transition from `primary` (#a30012) to `primary_container` (#d0021b). Use this for high-impact CTAs to provide "soul" and depth.
*   **Mercury Gradient:** Transition from `secondary_fixed` (#e2e2e2) to `secondary_fixed_dim` (#c6c6c6). Use this for subtle backgrounds in hover states or secondary modules.

---

## 3. Typography: The Editorial Voice

The typography scale is designed to feel like a high-fashion masthead.

*   **Display & Headlines (Cinzel):** Used for "The Immense Beauty." These should be set in all-caps with generous letter-spacing to evoke timeless elegance. 
    *   *Token usage:* `display-lg` to `headline-sm`.
*   **Editorial Subheadings (Cormorant Garamond):** Always set in **Italic**. This is our "human" element—sophisticated, flowing, and artisanal. Use this for product descriptions or brand storytelling.
    *   *Token usage:* `headline-sm` or `title-lg`.
*   **Functional Body (Inter):** Clean, modern, and invisible. Used for price points, specifications, and UI labels.
    *   *Token usage:* `body-lg` to `label-sm`.

---

## 4. Elevation & Depth

We achieve hierarchy through **Tonal Layering** rather than traditional structural lines or heavy drop shadows.

*   **The Layering Principle:** To lift a card, place a `surface_container_lowest` (#ffffff) card on a `surface_container` (#f0edec) background. The contrast creates a soft, natural lift.
*   **Ambient Shadows:** If a floating element (like a Quick-Buy modal) is required, use an extra-diffused shadow.
    *   *Spec:* Blur 32px, Spread 0, Color: `on_surface` (#1c1b1b) at 4% opacity. It should look like a soft glow, not a shadow.
*   **Glassmorphism:** For the navigation bar when scrolling or for filter overlays, use `surface` (#fcf9f8) at 80% opacity with a `backdrop-filter: blur(12px)`. This allows the vibrant Batik patterns to bleed through, maintaining the "Ethereal" feel.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` (#e7bdb8) at 20% opacity.

---

## 5. Components

### Buttons
*   **Primary:** `primary_container` (#d0021b) background with `on_primary` (#ffffff) text. Apply the **Plasma Gradient**. Shape: `DEFAULT` (0.25rem) for a sharp, tailored look.
*   **Secondary (Mercury):** `secondary_container` (#dddddd) with `on_secondary_container` (#606161). 

### Mercury Cards
*   **Base state:** `surface_container_high` (#ebe7e7) background, no border.
*   **Hover state:** Shift background to `surface_container_highest` (#e5e2e1) and apply a 4px **Plasma Red** (`primary`) left-border accent. This mimics a "selection" in a high-end catalog.

### Input Fields
*   **Surface:** `surface_container_low` (#f6f3f2).
*   **Focus State:** No border change. Instead, apply a 2px outer ring of `primary` (#a30012) and shift the background to `surface_container_lowest` (#ffffff).

### Lists & Navigation
*   **Forbid Dividers:** Do not use horizontal rules. Use `40px` or `48px` of vertical white space from the spacing scale to separate list items.
*   **The "Divine Spark":** Use the Rainbow-gradient logo silhouette as a watermark in large empty states or as a subtle loading micro-animation.

---

## 6. Do's and Don'ts

### Do
*   **DO** use extreme scale. A very large `display-lg` headline next to a small `body-md` paragraph creates the "Editorial" tension we seek.
*   **DO** use high-quality imagery of Batik with "Heavenly" lighting—overexposed whites and deep shadows.
*   **DO** allow elements to overlap. A product image can slightly break the container of a Mercury card to create depth.

### Don't
*   **DON'T** use 100% black. Use `Deep Black` (#0D0D0D) to keep the shadows "expensive" and soft.
*   **DON'T** use standard rounded corners (like 1rem or 2rem). Stick to `DEFAULT` (0.25rem) or `none` (0px) to maintain a sophisticated, architectural edge.
*   **DON'T** crowd the interface. If the page feels "full," add 24px of white space.