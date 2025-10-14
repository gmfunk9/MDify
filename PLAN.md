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
- [ ] Tighten dash fixer to guard number ranges and list markers.
- [ ] Expand comment stripping to cover inline `//`, `#`, and templating tags.
- [ ] Add hashtag extraction panel with dedupe and sort workflow.
- [ ] Provide simple preset templates (Twitter, IG, README) via dropdown.
- [ ] Persist user mode and panel preferences with `localStorage`.

## Implementation Notes
- [ ] Keep utilities as pure JS functions with minimal DOM coupling.
- [ ] Ensure each panel runs debounced transforms and can be undone manually.
- [ ] Use Turndown and Marked via CDN; pin versions and monitor changelogs.
- [ ] Favor early returns and avoid nested conditionals.

## UX
- [ ] Keep grid responsive; verify focus and tooltip behavior on keyboard.
- [ ] Maintain single-input panels to avoid multi-output complexity.
- [ ] Document tooltip copy alongside panel markup in `index.html`.

## SEO
- [ ] Add `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` to `index.html`.
- [ ] Provide fallback `favicon.ico` for legacy browsers.
- [ ] Confirm canonical URL, meta description, and Open Graph tags match deployment target.
- [ ] Produce 1200×630 social preview image under 200 KB.
- [ ] Add JSON-LD `WebSite` schema with `potentialAction` for site search.

**Goal:** One-grid, context-shifting toolkit for writers and devs — instant, safe, zero bloat.
