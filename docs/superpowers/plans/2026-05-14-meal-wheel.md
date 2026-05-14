# Meal Wheel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static daily meal wheel web app with a warm diner style and editable menu options.

**Architecture:** The app is a no-build static site with separate HTML, CSS, and JavaScript files. `script.js` owns menu state, local storage, wheel rendering, and spin selection; `styles.css` owns the responsive diner-style layout.

**Tech Stack:** Plain HTML, CSS, and JavaScript using the Canvas 2D API and browser `localStorage`.

---

## File Structure

- `index.html`: App shell, wheel canvas, result area, add-option form, and menu pool.
- `styles.css`: Responsive layout, warm diner visual system, buttons, menu tags, and mobile behavior.
- `script.js`: Default menu, user-added items, persistence, canvas drawing, random spin animation, add/delete interactions.

## Tasks

### Task 1: Create App Shell

**Files:**
- Create: `index.html`

- [ ] Add a static HTML page that links `styles.css` and `script.js`, contains the wheel canvas, spin button, result area, option form, and menu list.
- [ ] Include accessible labels for the canvas, add-option input, and dynamic result.
- [ ] Open the file directly in a browser and confirm the app shell appears.

### Task 2: Style the Diner Interface

**Files:**
- Create: `styles.css`

- [ ] Add warm small-diner styling with a two-column desktop layout.
- [ ] Style the wheel panel, result panel, add form, menu tags, and icon-like delete buttons.
- [ ] Add responsive styles so the layout stacks cleanly on small screens.
- [ ] Confirm no text overflows controls at desktop or mobile widths.

### Task 3: Implement Wheel and Menu Logic

**Files:**
- Create: `script.js`

- [ ] Define the default menu from the approved spec, including the user's original options and added light choices.
- [ ] Render the wheel using Canvas 2D with one segment per option.
- [ ] Implement spin selection so the final selected segment aligns with the fixed pointer.
- [ ] Disable the spin button while spinning and re-enable it afterward as "再转一次".
- [ ] Render the menu pool and result text from JavaScript state.

### Task 4: Add Editable Options

**Files:**
- Modify: `script.js`
- Modify: `styles.css`

- [ ] Add form handling for typing an option and clicking add or pressing Enter.
- [ ] Ignore empty input and prevent duplicate menu items.
- [ ] Save user-added options to `localStorage`, falling back to in-memory state if storage is unavailable.
- [ ] Add delete controls to menu tags and allow removing any option from the current pool.
- [ ] Redraw the wheel after adding or deleting an option.

### Task 5: Verify Manually

**Files:**
- No code changes expected.

- [ ] Open `index.html` directly in a browser.
- [ ] Confirm all initial menu items are visible.
- [ ] Spin several times and confirm the result area updates.
- [ ] Add a new option, refresh, and confirm it remains.
- [ ] Delete the added option and confirm it leaves the wheel.
- [ ] Check desktop and mobile widths.

