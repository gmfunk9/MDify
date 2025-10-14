# MDify Utility Scope — Max Word Economy Checklist

## Writer Mode (keep visible)
- [] **Tone Fixer** → normalize emdash, quotes, ellipses, emoji spacing  
- [] **Trim Lines** → remove blank/whitespace lines  
- [] **Stats+Rhythm** → word/char/tweet counts, Flesch, emoji density  
- [] **Hashtag Extractor** → pull, dedupe, sort, export  
- [] **Hook Splitter** → chunk by tweet/caption length  
- [] **Sort+Dedup** → clean hashtag/prompt lists  
- [] **Convert Format** → auto-detect MD↔HTML↔Rich  

## Dev Mode (Advanced)
- [] **Remove Comments** → multi-syntax (`/* */`, `<!-- -->`, `""" """`, `#`)  
- [] **Minify** → collapse whitespace/code  
- [] **Indent / Quote Normalizer / Slugify** → optional utilities  

## Drop / Merge
- [] Merge `MD→HTML`, `HTML→MD`, `Rich→MD` into **Convert Format**  
- [] Remove **Rich→H2** (fold into Outline Extractor)  
- [] Hide niche/low-use tiles under Advanced  

## UX Rules
- [] **Mode toggle:** Writer | Dev (persist via localStorage)  
- [] **Single input / multi-output** + small undo stack  
- [] **Presets:** Twitter, IG, Readme, Commit  
- [] **Preview:** diff (Tone Fixer), live Stats  
- [] **Shortcuts:** top 5 writer tools  
- [] **Local metrics:** track use frequency  

## Build Order
1. Convert Format / Trim / Tone Fixer / Stats / Hashtag Extractor  
2. Hook Splitter / Sort / Presets  
3. Dev tools (Comments, Minify, Indent)  
4. Advanced (Outline, density, sentiment)  

## Implementation
- [] Pure JS, regex + turndown + marked  
- [] Safe reversible ops, diff + undo  
- [] Minimal UI — instant feedback, no modals  
- [] LocalStorage: mode + presets only  

**Goal:** one-grid, context-shifting toolkit for writers + devs — instant, safe, zero bloat.

