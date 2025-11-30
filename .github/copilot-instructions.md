# VWFit – Copilot Guidelines (English)

This repository manages the source code for the Chrome extension **VWFit**.

VWFit is a window resizing tool for **frontend/web developers**. Even when DevTools is open, only the viewport area is resized to the specified size.

## 1. Tech Stack

### 1.1 Language

- **TypeScript**
  - All extension logic is written in TypeScript (.ts).
  - Targets:
    - Background Service Worker
    - Popup script
    - (In the future) Content scripts and options page
  - Explicit type annotations for function arguments and return values are recommended. Avoid using `any` as much as possible.

- **HTML / CSS**
  - The popup UI is implemented with plain HTML+CSS.
  - Do not use component frameworks (React, Vue, etc.) or CSS frameworks (Tailwind, Bootstrap, etc.).
  - Modern CSS (flexbox, CSS variables, etc.) is allowed, but keep styles minimal and clear.

### 1.2 Chrome Extension Platform

- **Manifest V3**
  - Use **Manifest V3** as the extension format.
  - Use `background.service_worker` as the main logic entry point (do not use persistent background pages).
  - Specify the main popup UI with `action.default_popup`.

- **Permissions**
  - Request only the minimum necessary permissions.
  - Main core permissions (subject to change):
    - `"tabs"`
    - `"windows"`
    - `"scripting"`
  - Limit `host_permissions` as much as possible to the range where script injection/execution is needed.

### 1.3 Build / Bundle

- **Build Tool**
  - Use **`tsc` (TypeScript compiler)** as the main build tool.
  - By default, do not use bundlers (webpack, Vite, esbuild, Rollup, etc.).
  - TypeScript sources in `src/` are built as JavaScript into `dist/`.

- **Expected Structure (Example)**
  - `src/background.ts` → `extension/dist/background.js`
  - `src/popup.ts` → `extension/dist/popup.js`
  - Static assets in `public/`:
    - `popup.html`
    - `popup.css`

- If you introduce a bundler or a more complex build pipeline, document the reason clearly. By default, keep the toolchain minimal.

### 1.4 Lint / Formatter

- Linter and formatter are **required** for this project.
- Acceptable configurations:
  - **Option A: Biome**
    - Use Biome as an all-in-one tool for linting, formatting, and TypeScript checks
  - **Option B: ESLint + Prettier**
    - The standard combination for TypeScript projects
- Configuration guidelines:
  - Keep rules **simple and practical**
  - Priorities:
    - Readability
    - Type safety
    - Consistent code style
  - Avoid overly strict rules that slow down development

### 1.5 Dependency Policy

- **No runtime dependencies in principle**
  - Do not use UI frameworks like React or Vue
  - Do not use CSS frameworks
  - Avoid heavy utility libraries like Lodash unless there is a special reason
- Development dependencies (TypeScript, lint/format tools, etc.) are allowed and recommended
- When adding a new dependency, do so as a deliberate design decision

## 2. Specification

### 2.1 Popup UI

VWFit has only a **popup panel** as its UI, displayed when the browser extension icon is clicked.
The popup displays only the following 3 elements:

1. **Viewport width input**
   - Use `input[type="number"]`.
   - Unit: **px** (number only).
   - Label example: `Viewport width (px)`
   - Initial value:
     - If a saved value exists, display it.
     - If not, display **`1440`** by default.

2. **Scrollbar inclusion option**
   - Implemented as a checkbox.
   - Example label:
     - Label: `Include scrollbar in target width`
   - Initial state:
     - If a saved setting exists, reflect it.
     - If not, default to **checked (true)**.

3. **Resize button**
   - Button example: `Resize!`
   - Clicking triggers the resize process based on the current input and checkbox state.
   - Do not display extra UI elements (history, preset list, settings link, etc.).

### 2.2 Saving Settings (Persistence)

User changes in the popup should be saved using the **browser extension storage API** for reuse next time.

- Storage API to use:
  - **`chrome.storage.sync`**
    - Recommended for extensions, easier to use than `localStorage`.
    - Allows for future multi-environment sync (not required now).

- Values to save:
  1. **Viewport width**
     - Type: `number`
     - Example key: `"vwfitWidth"`
     - Save when the input value changes or when Resize is executed.
  2. **Scrollbar inclusion flag**
     - Type: `boolean`
     - Example key: `"vwfitIncludeScrollbar"`
     - Save when the checkbox state changes or when Resize is executed.

- Load timing:
  - When the popup opens, load values from `chrome.storage.sync`:
    - If values exist, reflect them in the UI.
    - If not, apply these defaults:
      - `vwfitWidth`: `1440`
      - `vwfitIncludeScrollbar`: `true`

### 2.3 User Flow

1. User clicks the browser extension icon.
2. VWFit popup appears.
   - The "Viewport width (px)" input shows a value (default or previous).
   - The "Include scrollbar in target width" checkbox reflects the current setting.
3. User may:
   - Change the number.
   - Change the checkbox state.
4. User clicks the **`Resize!` button**.
   - The current input and checkbox state are saved.
   - The background (service worker) triggers the resize process based on these values.

## 3. Core Logic

VWFit's internal operation is defined in three layers:

- Popup (UI & user input)
- Storage (settings persistence)
- Background Service Worker (actual resize logic)

### 3.1 Popup Initialization Flow

When the popup opens, process in this order:

1. **Get settings from storage**
   - Use `chrome.storage.sync.get()` to load:
     - `vwfitWidth: number | undefined`
     - `vwfitIncludeScrollbar: boolean | undefined`
2. **Apply default values**
   - If undefined, apply these defaults:
     - `viewportWidth` = `1440`
     - `includeScrollbar` = `true`
   - Reflect the loaded (or default) values in the popup UI:
     - Set `input[type="number"]` to `viewportWidth`
     - Set the checkbox to `includeScrollbar`
3. **Set event listeners**
   - Listen to `change`/`input` events on the number input and update local variables.
   - Listen to `change` on the checkbox and update local variables.
   - Listen to `click` on the `Resize!` button and trigger the resize process with current UI values.

### 3.2 Saving Settings Logic

User changes should be saved for reuse next time.

1. **When to save**
   - At minimum, save when the `Resize!` button is pressed.
   - Optionally, also save on value changes (number input or checkbox).
2. **What to save**
   - `viewportWidth: number` (from the number input; ignore if NaN or reset to default)
   - `includeScrollbar: boolean` (from the checkbox)
3. **Storage API**
   - Use `chrome.storage.sync.set({ vwfitWidth, vwfitIncludeScrollbar })`

### 3.3 Triggering Resize (Popup → Background)

When the `Resize!` button is clicked, process as follows:

1. **Validate input**
   - Get `viewportWidth` as a number and validate:
     - Not NaN
     - Meets a minimum value (e.g., `>= 200`)
   - If invalid, abort (optionally show a message).
2. **Get active tab & window info**
   - Use `chrome.tabs.query({ active: true, currentWindow: true })` to get the active tab.
   - Get:
     - `tab.id` (tab ID)
     - `tab.windowId` (window ID)
3. **Get viewport info in tab**
   - Use `chrome.scripting.executeScript` to run a small function in the active tab.
   - In that function, get:
     - `currentInnerWidth = window.innerWidth`
     - `clientWidth = document.documentElement.clientWidth`
     - `scrollbarWidth = currentInnerWidth - clientWidth`
   - Return `{ currentInnerWidth, scrollbarWidth }` to the background.
4. **Send message to background**
   - Use `chrome.runtime.sendMessage()` to send:
     - `windowId`
     - `viewportWidth` (user input)
     - `includeScrollbar` (checkbox state)
     - `currentInnerWidth`, `scrollbarWidth` (from the tab)

### 3.4 Resize Calculation Logic (Background)

The background service worker receives the message and resizes the window.

1. **Receive message**
   - Use `chrome.runtime.onMessage.addListener()` to receive:
     - `type` (e.g., `"fitViewport"`)
     - `windowId`, `viewportWidth`, `includeScrollbar`, `currentInnerWidth`, `scrollbarWidth`
2. **Get current window info**
   - Use `chrome.windows.get(windowId)` to get the window's current size.
   - `currentOuterWidth = win.width`
   - Calculate `marginWidth = currentOuterWidth - currentInnerWidth`
     - This includes browser frame, tab bar, docked DevTools, etc.
3. **Determine target viewport width**
   - Based on `viewportWidth` and `includeScrollbar`:
     - If `includeScrollbar === true`:
       - `targetInnerWidth = viewportWidth`
     - If `includeScrollbar === false`:
       - `targetInnerWidth = viewportWidth + scrollbarWidth`
4. **Calculate new window width**
   - `newOuterWidth = targetInnerWidth + marginWidth`
   - Clamp as needed:
     - Set a minimum (e.g., 200px)
     - Optionally, use `chrome.system.display.getInfo()` to get the screen's `workArea` width as a maximum
5. **Update window size**
   - Call `chrome.windows.update(windowId, { width: newOuterWidth })`
   - For v0, keep height and position (`top`/`left`) unchanged

### 3.5 Error Handling & Safety

- Abort if the active tab cannot be obtained
- If `chrome.scripting.executeScript` fails (permissions, URL restrictions), show a simple message or silently ignore
- Do not resize if `viewportWidth` is invalid (NaN or negative)
- On the background side, check for value existence and type before calculation to avoid exceptions

## 4. Development

### 4.1 Directory Structure

VWFit assumes a simple structure like this:

```text
vwfit/
├─ .github/
│   └─ copilot-instructions.md
├─ extension/
│   ├─ dist/
│   │   ├─ background.js
│   │   └─ popup.js
│   ├─ icons/
│   │   ├─ icon-16.png
│   │   ├─ icon-48.png
│   │   └─ icon-128.png
│   ├─ manifest.json
│   ├─ popup.css
│   └─ popup.html
├─ src/
│   ├─ background.ts
│   └─ popup.ts
├─ .gitignore
├─ .node-version
├─ biome.json
├─ package.json
├─ tsconfig.json
└─ package-lock.json
```

- Place TypeScript source code under `src/`
- Build outputs, static files, and manifest.json are collected in `extension/`
- Load the `extension/` directory as an "unpacked extension" in Chrome

### 4.2 File Roles

- `extension/manifest.json` … Chrome extension manifest
- `extension/dist/background.js` … Background Service Worker (build output)
- `extension/dist/popup.js` … Popup script (build output)
- `extension/popup.html` … Popup UI HTML
- `extension/popup.css` … Popup UI CSS
- `extension/icons/` … Extension icon images
- `src/background.ts` … Background logic (TypeScript source)
- `src/popup.ts` … Popup UI logic (TypeScript source)

### 4.3 Development Commands

Main commands in `package.json`:

```jsonc
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "build:watch": "tsc -p tsconfig.json --watch",
    "lint": "biome lint .",
    "format": "biome format .",
    "check": "biome check .",
  },
}
```

- Install dependencies:
  ```bash
  npm install
  ```
- Build (one-shot):
  ```bash
  npm run build
  ```
- Build (watch):
  ```bash
  npm run build:watch
  ```
- Lint:
  ```bash
  npm run lint
  ```
- Format:
  ```bash
  npm run format
  ```
- All checks (Lint + Format check):
  ```bash
  npm run check
  ```

### 4.4 Loading into Chrome

Basic flow for testing the extension during development:

1. Install dependencies
   ```bash
   npm install
   ```
2. Build TypeScript
   ```bash
   npm run build
   ```
   Or during development:
   ```bash
   npm run build:watch
   ```
3. Go to chrome://extensions/ in Chrome
4. Turn on "Developer mode" in the top right
5. Click "Load unpacked" and select the `extension/` directory
6. When you change code:
   - Update `extension/*.js` with npm run build or build:watch
   - Click "Reload" on VWFit in chrome://extensions/
   - Click the browser extension icon to open the popup and check behavior
