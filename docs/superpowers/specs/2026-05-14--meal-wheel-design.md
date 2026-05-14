# Meal Wheel Web App Design

## Goal

Build a single-page web tool that helps the user decide what to eat each day by spinning a wheel. The page opens directly to the usable wheel experience.

## Menu Items

All items are mixed in one pool:

- 沙县小吃
- 面线糊
- 沙拉拉轻食
- 沙茶面
- 木桶饭
- 塔斯丁
- 麦当劳
- 食堂
- 水煮牛肉
- 水饺
- 馄饨
- 卤肉饭
- 牛肉羹
- 粥
- 鱼片粥
- 沙拉
- 番茄鸡蛋面
- 清汤面
- 鸡汤米线
- 越南粉
- 关东煮
- 蒸蛋套餐
- 清蒸鱼饭
- 轻食三明治
- 荞麦面
- 蔬菜汤

## Experience

The visual direction is a warm "small diner" style. It should feel like a daily meal recommendation board: friendly, appetizing, and simple enough to use every day.

The first screen contains:

- A large colorful wheel.
- A fixed pointer above the wheel.
- A primary spin button.
- A "今日推荐" result area.
- A visible menu pool showing all options.
- A compact input for adding new menu options.

There is no landing page, onboarding, category selector, or "light food only" mode.

## Interaction

Clicking the spin button:

- Disables the button while spinning.
- Randomly selects one menu item from the full pool.
- Spins the wheel for a satisfying duration.
- Stops with the selected item aligned to the pointer.
- Shows the selected item in the result area.
- Re-enables the button as "再转一次".

The result may repeat across separate spins because each spin is independent.

Adding a menu option:

- The user types a new food option into the input and clicks add or presses Enter.
- Empty values are ignored.
- Existing values are not duplicated.
- Newly added values immediately appear in the menu pool and wheel.
- User-added values are saved in the browser so they remain after refreshing.
- Each menu tag has a small delete control so accidental entries can be removed.

## Implementation Shape

Use a static HTML app with local CSS and JavaScript. It should work by opening the HTML file directly in a browser, with no build step and no server requirement.

Suggested files:

- `index.html`
- `styles.css`
- `script.js`

## Visual Details

Use a warm but balanced palette:

- Off-white and pale warm backgrounds.
- Red or brick as the main action color.
- Multiple wheel segment colors so the wheel is easy to read.
- Compact rounded controls, no oversized marketing hero.

The app must be responsive. On desktop, use a two-column layout with the wheel on the left and result/menu on the right. On mobile, stack the wheel, result, and menu vertically.

## Error Handling

The menu list is fixed in JavaScript. If the list is empty due to accidental editing, the spin button should stay disabled and the result area should show a short unavailable message.

User-added items are stored in local browser storage. If storage is unavailable, the app still allows adding items for the current page session.

## Testing

Manual checks:

- Open `index.html` directly in a browser.
- Confirm all menu items are visible in the menu pool.
- Spin several times and confirm the result changes and the button re-enables.
- Add a new option and confirm it appears in the menu pool and can be selected by the wheel.
- Refresh and confirm the added option remains.
- Delete a user-added option and confirm it is removed from the pool and wheel.
- Confirm the layout is usable at desktop and mobile widths.
