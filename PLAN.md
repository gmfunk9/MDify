# MDify Utility Scope — Max Word Economy Checklist

## Delivered
- [x] Emdash fixer for punctuation normalization.
- [x] Trim blank lines and whitespace-only rows.
- [x] Sort lines with dedupe and asc/desc toggle.
- [x] Markdown ↔ HTML converters (MD→HTML, HTML→MD, MD→Rich, Rich→MD).
- [x] Rich→H2 outline scraper.
- [x] Comment stripper for `/* */`, `<!-- -->`, and `""" """` blocks.
- [x] Text stats (word/char counts, Flesch, read/speak time, keyword density).
- [x] Minifier to collapse whitespace.
- [x] Intro splash and global tooltips for onboarding.

## Backlog
- [x] Tighten dash fixer to guard number ranges and list markers.
- [x] Expand comment stripping to cover inline `//`, `#`, and templating tags.
- [x] Add hashtag extraction panel with dedupe and sort workflow.
- [x] Provide simple preset templates (Twitter, IG, README) via dropdown.
- [x] Persist user mode and panel preferences with `localStorage`.

## Implementation Notes
- [x] Keep utilities as pure JS functions with minimal DOM coupling.
- [x] Ensure each panel runs debounced transforms and can be undone manually.
- [x] Use Turndown and Marked via CDN; pin versions and monitor changelogs.
- [x] Favor early returns and avoid nested conditionals.

## UX
- [x] Keep grid responsive; verify focus and tooltip behavior on keyboard.
- [x] Maintain single-input panels to avoid multi-output complexity.
- [x] Document tooltip copy alongside panel markup in `index.html`.

## SEO
- [x] Add `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` to `index.html`.
- [ ] Provide fallback `favicon.ico` for legacy browsers.
- [x] Confirm canonical URL, meta description, and Open Graph tags match deployment target.
- [x] Produce 1200×630 social preview image under 200 KB.
- [x] Add JSON-LD `WebSite` schema with `potentialAction` for site search.

**Goal:** One-grid, context-shifting toolkit for writers and devs — instant, safe, zero bloat.
