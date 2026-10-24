# FULLSIZE — Design System / MASTER

> Design system for the website, informed by [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) guidelines in SKILL.md and references/quick-reference.md. The search utility itself was not run.

## Product
- Type: gaming community / recruitment page for FULLSIZE on Arizona RP.
- Primary goal: generate an application that a prospective member can copy.
- Russian-first, punchy and friendly copy.
- No invented roster, stats, awards, bonuses, Discord links or recruitment claims.
- Explicit unofficial fan-site disclosure.

## Art direction
- Dark motorsport editorial / urban culture, high-impact red accents.
- Real thematic photography, not emoji or CSS-drawn characters.
- No generic SaaS gradients and fake achievement counters.
- Sharp corners with 3px radius, typography-driven graphic design.
- Manrope for body text and Unbounded for display text.

## Design tokens
- Base background: #0b0c10
- Secondary background: #111217
- Surface: #18191e
- Raised surface: #202128
- Text: #f7f5f0
- Muted: #b0afb5
- Accent: #ff5337
- Accent highlight: #ff8067
- Border: rgba(255,255,255,.14)
- Layout width: max 1320px with responsive gutters
- Typography: body 16px / line-height 1.6; display responsive
- Motion: 230ms hover; 750ms reveal; reduced-motion overrides all decorative motion

## Section hierarchy
1. Hero — positioning and CTA
2. About — family identity
3. Principles — three values
4. Statement — emotional brand story
5. Life — what to do together
6. Steps — joining guide
7. Application — local-only form + copy
8. FAQ — accessible native details controls
9. Closing CTA and footer

## Accessibility and performance
- Native HTML landmarks, h1/h2/h3 hierarchy, skip link, visible focus.
- At least 44px interactive targets; responsive phone-first layout.
- Labelled form controls, error feedback near form, focus invalid input.
- Mobile menu closes on Escape, on navigation and on outside click.
- Form never sends or stores data; output uses textContent to prevent injection.
- IntersectionObserver animation that respects prefers-reduced-motion.
- Image width/height declared; lazy images below fold and priority hero image.
- One visual language for SVG icons.

## Maintenance
- Do not pretend the copy-only form sends applications.
- Do not add fictional members, server labels, achievements or contact information.
- Real server name / member screenshots / Discord or Telegram invitation can be added after owner supplies the details.
- Site is static HTML/CSS/JS and works without package installation.
- Automatic publication requires a one-time GitHub Pages setting: Source = GitHub Actions.
