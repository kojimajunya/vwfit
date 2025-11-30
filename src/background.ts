type FitViewportMessage = {
  type?: string;
  windowId?: number | string;
  viewportWidth?: number | string;
  includeScrollbar?: boolean | string;
  currentInnerWidth?: number | string;
  scrollbarWidth?: number | string;
};

type DisplayInfo = {
  isPrimary?: boolean;
  workArea?: { left: number; top: number; width: number; height: number };
  bounds?: { left: number; top: number; width: number; height: number };
};

console.log('[VWFit/bg] service worker started');

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  console.log('[VWFit/bg] onMessage raw:', message);

  const msg = message as FitViewportMessage;
  if (!msg || msg.type !== 'fitViewport') {
    console.log('[VWFit/bg] ignore message, type=', msg?.type);
    return;
  }

  sendResponse({ ok: true });

  try {
    const windowId = Number(msg.windowId);
    const viewportWidth = Number(msg.viewportWidth);
    const includeScrollbar = Boolean(msg.includeScrollbar);
    const currentInnerWidth = Number(msg.currentInnerWidth) || 0;
    const scrollbarWidth = Number(msg.scrollbarWidth) || 0;

    console.log('[VWFit/bg] parsed message:', {
      windowId,
      viewportWidth,
      includeScrollbar,
      currentInnerWidth,
      scrollbarWidth,
    });

    if (Number.isNaN(windowId) || Number.isNaN(viewportWidth)) {
      console.warn('[VWFit/bg] NaN windowId/viewportWidth, abort');
      return;
    }

    chrome.windows.get(windowId, (win) => {
      if (chrome.runtime.lastError) {
        console.error('[VWFit/bg] windows.get error:', chrome.runtime.lastError.message);
      }

      if (!win || typeof win.width !== 'number') {
        console.warn('[VWFit/bg] no window or width is not number, abort');
        return;
      }

      const currentOuterWidth = win.width as number;
      const marginWidth = currentOuterWidth - currentInnerWidth;

      const targetInnerWidth = includeScrollbar ? viewportWidth : viewportWidth + scrollbarWidth;
      const newOuterWidth = Math.max(200, Math.round(targetInnerWidth + marginWidth));

      console.log('[VWFit/bg] computed widths:', {
        currentOuterWidth,
        marginWidth,
        targetInnerWidth,
        newOuterWidth,
      });

      if (chrome.system?.display && typeof chrome.system.display.getInfo === 'function') {
        chrome.system.display.getInfo((displays: DisplayInfo[] | undefined) => {
          if (chrome.runtime.lastError) {
            console.error('[VWFit/bg] display.getInfo error:', chrome.runtime.lastError.message);
          }

          const main = displays?.find((d: DisplayInfo) => d.isPrimary) || displays?.[0];
          const area = main ? main.workArea || main.bounds : null;

          console.log('[VWFit/bg] chosen area:', area);

          if (!area) {
            chrome.windows.update(windowId, { width: newOuterWidth }, () => {
              if (chrome.runtime.lastError) {
                console.error(
                  '[VWFit/bg] windows.update error (fallback):',
                  chrome.runtime.lastError.message,
                );
              } else {
                console.log('[VWFit/bg] windows.update success (fallback width only)');
              }
            });
            return;
          }

          const winHeight = typeof win.height === 'number' ? (win.height as number) : area.height;
          const left = Math.round(area.left + (area.width - newOuterWidth) / 2);
          const top = Math.round(area.top + (area.height - winHeight) / 2);

          chrome.windows.update(windowId, { width: newOuterWidth, left, top }, () => {
            if (chrome.runtime.lastError) {
              console.error('[VWFit/bg] windows.update error:', chrome.runtime.lastError.message);
            } else {
              console.log('[VWFit/bg] windows.update success');
            }
          });
        });
      } else {
        console.warn('[VWFit/bg] chrome.system.display not available, width-only update');
        chrome.windows.update(windowId, { width: newOuterWidth }, () => {
          if (chrome.runtime.lastError) {
            console.error(
              '[VWFit/bg] windows.update error (no display):',
              chrome.runtime.lastError.message,
            );
          } else {
            console.log('[VWFit/bg] windows.update success (no display, width only)');
          }
        });
      }
    });
  } catch (err) {
    console.error('[VWFit/bg] Error handling fitViewport message', err);
  }
});
