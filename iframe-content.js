(function() {
  'use strict';

  const {
    NYT_BUDDY_CONTAINER_SELECTOR,
    NYT_GRID_SECTION_SELECTOR,
    NYT_TWO_LETTER_LIST_SELECTOR,
    MIN_SECTION_WIDTH,
    SECTION_GAP,
    IFRAME_HEIGHT_PADDING
  } = window.SPELLING_BEE_CONSTANTS;
  const style = document.createElement('style');
  style.textContent = `
    ${NYT_BUDDY_CONTAINER_SELECTOR} > * {
      display: none !important;
    }

    ${NYT_GRID_SECTION_SELECTOR},
    ${NYT_TWO_LETTER_LIST_SELECTOR} {
      display: block !important;
    }

    body {
      margin: 0 !important;
      padding: 10px 20px !important;
      background: white !important;
      overflow: hidden !important;
    }

    ${NYT_BUDDY_CONTAINER_SELECTOR} {
      padding: 0 !important;
      margin: 0 !important;
      display: flex !important;
      flex-wrap: wrap !important;
      gap: ${SECTION_GAP}px !important;
    }

    ${NYT_GRID_SECTION_SELECTOR},
    ${NYT_TWO_LETTER_LIST_SELECTOR} {
      flex: 1 1 ${MIN_SECTION_WIDTH}px !important;
      min-width: ${MIN_SECTION_WIDTH}px !important;
    }

    header,
    footer,
    .g-header,
    .g-footer,
    #standalone-footer,
    #interactive-footer-container,
    [role="banner"],
    [role="contentinfo"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  function sendHeight() {
    const container = document.querySelector(NYT_BUDDY_CONTAINER_SELECTOR);
    if (container) {
      const height = container.scrollHeight + IFRAME_HEIGHT_PADDING;
      window.parent.postMessage({
        type: 'spelling-bee-buddy-resize',
        height
      }, 'https://www.nytimes.com');
    }
  }

  function waitForContent() {
    const container = document.querySelector(NYT_BUDDY_CONTAINER_SELECTOR);
    if (!container) {
      requestAnimationFrame(waitForContent);
      return;
    }

    const gridSection = document.querySelector(NYT_GRID_SECTION_SELECTOR);
    const twoLetterSection = document.querySelector(NYT_TWO_LETTER_LIST_SELECTOR);

    if (gridSection && twoLetterSection &&
        gridSection.offsetHeight > 0 && twoLetterSection.offsetHeight > 0) {
      sendHeight();

      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(container);
    } else {
      requestAnimationFrame(waitForContent);
    }
  }

  waitForContent();
})();
