# Healthcare Landing Page Structure (Premium, Minimal)

## 1) Value Proposition Heading (3 versions)
1. **"Fewer no-shows. Less admin. Better continuity of care."**
2. **"Built for Serbian private clinics: tighter operations, clearer patient follow-through."**
3. **"Appointments, records, and follow-up—controlled in one workflow."**

## 2) Hero Tagline (3 versions)
1. **"Your team works from one source of truth. Patients always know the next step."**
2. **"Cut manual work. Reduce missed visits. Keep care plans on track."**
3. **"Private-clinic workflows in Serbia, made precise and predictable."**

Optional support line:
"From booking to follow-up, each step is visible, documented, and actionable."

## 3) Five Landing Page Sections (purpose)

### Section 1 — Trust
**Purpose:** Establish confidence immediately.
- Security and data-protection standards
- Hosting and access-control details
- Local clinic logos and one operator quote

### Section 2 — Value by Audience
**Purpose:** State practical value fast.
- **Clinic owners/doctors:** fewer missed visits, lower admin load, fuller schedules
- **Patients:** faster booking, clear reminders, clear post-visit steps

### Section 3 — Daily Workflow
**Purpose:** Show operational fit.
- **Book → Confirm → Record visit → Send follow-up**
- Short labels, no product jargon

### Section 4 — Results
**Purpose:** Prove outcomes.
- No-show reduction
- Intake speed
- Response time
- Patient return rate
- One short before/after case

### Section 5 — Demo Conversion
**Purpose:** Convert qualified demand.
- One-line value restatement
- Short form: name, clinic, role, contact
- Reassurance: "20-minute walkthrough. No obligation."

## 4) Primary CTA
**Primary CTA:** **"Schedule a 20-Minute Demo"**

Optional secondary CTA: **"View Clinic Results"**

## 5) Color Palette & Typography

### Color Palette
- Primary: `#1E3A8A`
- Secondary: `#0D9488`
- Accent: `#38BDF8`
- Neutral Dark: `#0F172A`
- Neutral Light: `#F8FAFC`
- Success: `#16A34A`

Use:
- Keep AA contrast across all text.
- Use accent only for actions and key numbers.

### Typography
- Headings: `Inter` (or `Manrope`)
- Body: `Inter` (or `Source Sans 3`)
- Scale:
  - H1: 48–56px
  - H2: 32–40px
  - Body: 18–20px
  - Minimum small text: 16px

## 6) HERO Visual Hierarchy Spec (Layout + Spacing)

### Canvas and content width
- **Hero content max width:** `1120px`
- **Text column max width:** `640px`
- **Container side padding:**
  - Desktop: `40px`
  - Tablet: `32px`
  - Mobile: `20px`

Why: 1120px gives premium breathing room. 640px keeps headline readable and controlled.

### Spacing system
- Use an **8px spacing system**.
- Core steps: `8, 16, 24, 32, 48, 64, 80, 96, 120`.

### Vertical rhythm (hero only)
- Top nav to hero content start: `64px`
- Hero top padding: `96px`
- Heading to subtext: `24px`
- Subtext to CTA row: `32px`
- CTA row to trust micro-line/logos: `32px`
- Hero bottom padding: `96px`
- **Hero to next section spacing:** `120px`

Why: large outer spacing + tighter inner spacing creates a high-end rhythm.

### Typography hierarchy (hero)
- **H1:** `56px`, `700`, line-height `1.08`, letter-spacing `-0.02em`
- H1 max width: `14–16 words`, visually capped by `640px`
- **Subtext:** `20px`, `400`, line-height `1.5`, max width `560px`

Why: strong H1 contrast, restrained line length, and calm subtext improve authority.

### CTA sizing and treatment
- **Primary CTA height:** `52px`
- **Primary CTA padding:** `0 24px`
- **Primary CTA radius:** `12px`
- **Primary CTA weight:** `600`, text size `16px`

- **Secondary CTA height:** `52px`
- **Secondary CTA padding:** `0 20px`
- **Secondary CTA radius:** `12px`
- **Secondary CTA style:** ghost/outline

### Primary vs secondary visual difference
- **Primary:** solid Deep Blue (`#1E3A8A`) with white text, subtle hover darken.
- **Secondary:** transparent/very light fill, 1px border in neutral tone, dark text.
- Keep equal height; differentiate by fill emphasis, not size.

Why: premium interfaces prioritize one clear action without visual noise.

### Background treatment
- Use a **subtle tint**, not flat white and not heavy gradients.
- Recommended: base `#F8FAFC` with a very soft top-to-bottom tint shift (2–3%).
- Optional right-side abstract shape at 5–8% opacity for depth.
- Avoid split-layout blocks in hero unless there is strong product imagery.

Why: minimal depth feels premium; hard splits often feel template-like.

## 7) Strict Visual Constraints (non-negotiable)

### Max number of colors
- **Max 6 brand/UI colors total** (from the approved palette only).
- **Max 3 colors visible in any single section** (excluding images/logos).
- No new hex values without design-system update.

### Max number of font weights
- **Max 3 weights across the full page:** `400`, `600`, `700`.
- Do not use `500`, `800`, or mixed custom weights.

### Border radius rule
- **Single radius system:**
  - Buttons/inputs: `12px`
  - Cards/containers: `16px`
  - Tiny pills/badges only: `9999px`
- No other radius values.

### Shadow rule
- **Default:** no shadow.
- **Cards only (optional):** one subtle shadow `0 1px 2px rgba(15,23,42,0.06)`.
- **No layered shadows**, no colored shadows, no blur-heavy elevation.

### Section padding rule
- Desktop section vertical padding: **`96px` top and `96px` bottom**.
- Tablet: **`80px` / `80px`**.
- Mobile: **`64px` / `64px`**.
- Inner content spacing must follow the 8px scale only.

### Card style rule
- Background: white or neutral-light only.
- Border: `1px solid rgba(15,23,42,0.08)`.
- Radius: `16px`.
- Internal padding: `24px` (mobile `20px`).
- Max one emphasis style per section (e.g., tinted card), not multiple variants.

### Icon usage rule
- Use **one icon style only** (outline *or* filled, not both).
- Size set: `20px` inline, `24px` in feature rows.
- Stroke width consistent (e.g., `1.75` or `2`), never mixed.
- Max **1 icon per card row**.
- Decorative icons are banned; icons must add meaning.

## 8) Why this hierarchy feels premium
- It uses deliberate whitespace, not crowded density.
- It creates one focal path: H1 → subtext → primary CTA.
- It limits content width for control and readability.
- It uses restrained contrast and consistent geometry (52px controls, 12px radius).
- It avoids decorative noise and keeps alignment strict.

## 9) What would make it look cheap
- Too many font sizes or inconsistent line-heights.
- Long headline lines spanning the full container.
- Small buttons (<44px high) or random radii.
- Weak CTA contrast or equal emphasis on all buttons.
- Harsh gradients, loud shadows, or overused icons.
- Tight vertical spacing that makes the hero feel cramped.
