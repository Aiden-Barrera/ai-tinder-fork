# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python3 -m http.server
# then visit http://localhost:8000
```

## Architecture

This is a pure vanilla HTML/CSS/JS frontend — no framework, no bundler, no npm.

- **`index.html`**: App shell. Loads `app.js` as a plain (non-module) `<script>`. The card deck (`#deck`) and control buttons (`#likeBtn`, `#nopeBtn`, `#superLikeBtn`, `#shuffleBtn`) are the main DOM targets.
- **`app.js`**: The single entry point. Runs as a global script (no `import`/`export`). Contains its own copy of all data arrays, `generateProfiles`, and the full card-interaction system: pointer-drag swipe gestures (left/right/up), directional stamp reveals, button handlers (like/nope/super-like/shuffle), and a double-tap bio overlay.
- **`data.js`**: An ES module version of the data layer (`export function generateProfiles`, `export const TAGS`). Currently not imported by `index.html` — it exists as a cleaner module-based alternative for students to wire up.
- **`styles.css`**: All styles. Uses CSS custom properties defined in `:root` (`--accent`, `--like`, `--nope`, `--super`, etc.). Cards use `position: absolute` stacking with nth-child transforms to create a deck effect.

## Key Implementation Notes

- `app.js` and `data.js` duplicate the same data (TAGS, names, cities, etc.). This is intentional scaffolding — `data.js` is the cleaner module intended for student use.
- The swipe gesture logic and button actions are **fully implemented** in `app.js` — see `dismissCard`, `finishDrag`, and `toggleBioOverlay`.
- Profile images use Unsplash public URLs with hardcoded seeds; swap `UNSPLASH_SEEDS` or the `imgFor` function to change images.
- The deck renders all 12 cards stacked via absolute positioning; only the first 3 get distinct transforms (nth-child 1–3). The first child is the top card (`getTopCard()` uses `firstElementChild`); dismissal removes it from the DOM so the next card advances.

## Task to Implement

your task is to modify an AI-generated Tinder frontend so that its user interface behaves like we’d expect. In particular, you should add logic for these behaviors:
- Swipe left - Reject
- Swipe right - Like
- Swipe up – Super like
- Double-tap – Look at the other photos in the profile
- Also, power the action buttons at the bottom.

## Template 

You are a frontend developer.
Your goal is to add event handlers for common user interface tasks in this frontend code.
Instructions:
- Analyze the existing frontend code for UI elements that should respond to user input but have no event handlers.
- Identify specific issues and explain each.
- Suggest concrete changes or alternate approaches to address the issues.
- The response should be formatted as a list of findings.
Analysis Focus: Find UI elements that lack sufficient UI event handlers.
Code: The frontend code in the project directory.

