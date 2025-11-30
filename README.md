![VWFit browser extension logo](./logo.png)

# VWFit

VWFit is a Chrome extension for web developers. With a single click, it resizes the browser so that the viewport matches a preset width.

## Features

- Even when Chrome DevTools is open, the viewport area is adjusted to the specified width
  - In other words, the window’s outer width is resized to: **target viewport width + DevTools pane width**
- Option to include or exclude the scrollbar width from the target width
- Settings are saved automatically
- Minimal UI with no extra presets – just the essentials

## How to use

1. Install VWFit as a Chrome extension
2. Click the extension icon to open the popup
3. Enter your desired width in **“Viewport width (px)”**
4. Toggle **“Include scrollbar in target width”** on or off as needed
5. Click the `Resize!` button
6. The viewport of the current window will be resized to the specified width

## Develop

```bash
npm install
npm run build:watch
npm run build
npm run zip
```

## License

MIT License ([LICENSE.txt](./LICENSE.txt))
