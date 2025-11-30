const WIDTH_KEY = 'vwfitWidth';
const INCLUDE_SCROLL_KEY = 'vwfitIncludeScrollbar';
const DEFAULT_WIDTH = 1440;
const DEFAULT_INCLUDE_SCROLL = true;

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('vwfit-width') as HTMLInputElement | null;
  const checkbox = document.getElementById('vwfit-include-scrollbar') as HTMLInputElement | null;
  const btn = document.getElementById('vwfit-resize-btn') as HTMLButtonElement | null;

  chrome.storage.sync.get([WIDTH_KEY, INCLUDE_SCROLL_KEY], (items) => {
    const storedWidth =
      typeof (items as Record<string, unknown>)[WIDTH_KEY] === 'number'
        ? ((items as Record<string, unknown>)[WIDTH_KEY] as number)
        : DEFAULT_WIDTH;
    const storedInclude =
      typeof (items as Record<string, unknown>)[INCLUDE_SCROLL_KEY] === 'boolean'
        ? ((items as Record<string, unknown>)[INCLUDE_SCROLL_KEY] as boolean)
        : DEFAULT_INCLUDE_SCROLL;
    if (input) input.value = String(storedWidth);
    if (checkbox) checkbox.checked = storedInclude;
  });

  btn?.addEventListener('click', async () => {
    const width = input ? Number.parseInt(input.value, 10) : Number.NaN;
    if (Number.isNaN(width) || width < 200) {
      alert('Please enter a valid width (>=200).');
      return;
    }
    const includeScrollbar = checkbox ? checkbox.checked : DEFAULT_INCLUDE_SCROLL;
    chrome.storage.sync.set({
      [WIDTH_KEY]: width,
      [INCLUDE_SCROLL_KEY]: includeScrollbar,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || !tabs[0] || typeof tabs[0].id !== 'number') return;
      const tab = tabs[0];
      const tabId = tab.id as number;
      const windowId = tab.windowId as number;

      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId },
          func: () => ({
            currentInnerWidth: window.innerWidth,
            clientWidth: document.documentElement.clientWidth,
          }),
        });
        const r = (results?.[0] as chrome.scripting.InjectionResult | undefined)?.result || {};
        const currentInnerWidth = Number((r as Record<string, unknown>).currentInnerWidth) || 0;
        const scrollbarWidth =
          currentInnerWidth - (Number((r as Record<string, unknown>).clientWidth) || 0);
        chrome.runtime.sendMessage(
          {
            type: 'fitViewport',
            windowId,
            viewportWidth: width,
            includeScrollbar,
            currentInnerWidth,
            scrollbarWidth,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('VWFit sendMessage error:', chrome.runtime.lastError.message);
              alert('VWFit: failed to contact background script.');
              return;
            }

            console.log('VWFit: background ack:', response);
            window.close();
          },
        );
      } catch (e) {
        console.error('executeScript failed:', e);
        alert('VWFit: executeScript failed.\nCheck the console for details.');
      }
    });
  });
});
