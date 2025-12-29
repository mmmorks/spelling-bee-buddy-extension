(function() {
  'use strict';

  // This script runs inside the Buddy iframe to style it
  const NYT_BUDDY_CONTAINER_SELECTOR = '.sb-buddy-container';
  const NYT_GRID_SECTION_SELECTOR = '.the-square';
  const NYT_TWO_LETTER_LIST_SELECTOR = '.the-square-part-two';
  const MIN_SECTION_WIDTH = 300;
  const SECTION_GAP = 10;
  const IFRAME_HEIGHT_PADDING = 40;

  // Hide everything except Grid and Two-Letter List
  const style = document.createElement('style');
  style.textContent = `
    /* Hide everything except Grid and Two-Letter List */
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

    /* Make sections responsive and flexible */
    ${NYT_GRID_SECTION_SELECTOR},
    ${NYT_TWO_LETTER_LIST_SELECTOR} {
      flex: 1 1 ${MIN_SECTION_WIDTH}px !important;
      min-width: ${MIN_SECTION_WIDTH}px !important;
    }

    /* Hide headers and footers */
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

  // Send height updates to parent window
  function sendHeight() {
    const container = document.querySelector(NYT_BUDDY_CONTAINER_SELECTOR);
    if (container && window.parent) {
      const height = container.scrollHeight + IFRAME_HEIGHT_PADDING;
      window.parent.postMessage({
        type: 'spelling-bee-buddy-resize',
        height: height
      }, 'https://www.nytimes.com');
    }
  }

  // Wait for content to load, then send height
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

      // Observe for any size changes
      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(container);
    } else {
      requestAnimationFrame(waitForContent);
    }
  }

  waitForContent();
})();
