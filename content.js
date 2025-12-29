(function() {
  'use strict';

  // Import constants
  const {
    INITIAL_RESIZE_DELAY,
    FALLBACK_VISIBILITY_TIMEOUT,
    LOG_CHECK_INTERVAL,
    BUDDY_URL,
    NYT_GAME_WRAPPER_SELECTOR,
    NYT_BUDDY_CONTAINER_SELECTOR,
    NYT_GRID_SECTION_SELECTOR,
    NYT_TWO_LETTER_LIST_SELECTOR,
    MIN_SECTION_WIDTH,
    SECTION_GAP,
    IFRAME_HEIGHT_PADDING
  } = window.SPELLING_BEE_CONSTANTS || {};

  function parseGameUrl(url) {
    const match = url.match(/\/spelling-bee(?:\/(\d{4}-\d{2}-\d{2})|\/?$)/);
    return {
      isValid: match !== null,
      gameDate: match?.[1] || null
    };
  }

  function waitForGameContainer() {
    let checkCount = 0;
    return new Promise((resolve) => {
      const checkContainer = () => {
        checkCount++;
        const container = document.querySelector(NYT_GAME_WRAPPER_SELECTOR);

        if (checkCount === 1 || checkCount % LOG_CHECK_INTERVAL === 0) {
          console.log(`[Spelling Bee Buddy] Waiting for container... (attempt ${checkCount})`);
        }

        if (container) {
          console.log('[Spelling Bee Buddy] Game container ready');
          resolve(container);
        } else {
          requestAnimationFrame(checkContainer);
        }
      };
      checkContainer();
    });
  }

  function createBuddyContainer() {
    const container = document.createElement('div');
    container.id = 'spelling-bee-buddy-container';
    container.className = 'pz-section';

    const header = document.createElement('div');
    header.className = 'buddy-header';
    header.innerHTML = '<h3>Spelling Bee Buddy</h3>';
    container.appendChild(header);

    return container;
  }

  function createBuddyIframe(gameDate) {
    const iframe = document.createElement('iframe');
    iframe.id = 'spelling-bee-buddy-iframe';
    iframe.src = BUDDY_URL + (gameDate ? `?date=${gameDate}` : '');
    iframe.title = 'Spelling Bee Buddy - Grid & Two-Letter List';
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    iframe.style.visibility = 'hidden';
    return iframe;
  }

  function injectIframeStyles(iframeDoc) {
    const style = iframeDoc.createElement('style');
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
    iframeDoc.head.appendChild(style);
  }

  function setupIframeResize(iframe, iframeDoc) {
    function resizeIframe() {
      requestAnimationFrame(() => {
        const container = iframeDoc.querySelector(NYT_BUDDY_CONTAINER_SELECTOR);
        if (container) {
          const height = container.scrollHeight + IFRAME_HEIGHT_PADDING;
          iframe.style.height = height + 'px';
          console.log('[Spelling Bee Buddy] Resized iframe to', height + 'px');
        }
      });
    }

    const container = iframeDoc.querySelector(NYT_BUDDY_CONTAINER_SELECTOR);
    if (!container) return;

    let initialLoadComplete = false;

    const observer = new MutationObserver(() => {
      if (initialLoadComplete) return;

      const gridSection = iframeDoc.querySelector(NYT_GRID_SECTION_SELECTOR);
      const twoLetterSection = iframeDoc.querySelector(NYT_TWO_LETTER_LIST_SELECTOR);

      if (gridSection && twoLetterSection &&
          gridSection.offsetHeight > 0 && twoLetterSection.offsetHeight > 0) {
        initialLoadComplete = true;
        observer.disconnect();
        resizeIframe();
        iframe.style.visibility = 'visible';
        console.log('[Spelling Bee Buddy] Initial content loaded, MutationObserver disconnected');
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });

    setTimeout(resizeIframe, INITIAL_RESIZE_DELAY);

    setTimeout(() => {
      if (!initialLoadComplete) {
        iframe.style.visibility = 'visible';
        console.log('[Spelling Bee Buddy] Made iframe visible via fallback timeout');
      }
    }, FALLBACK_VISIBILITY_TIMEOUT);

    const resizeObserver = new ResizeObserver(resizeIframe);
    resizeObserver.observe(container);
  }

  function setupIframeContent(iframe, gameDate) {
    iframe.onload = function() {
      try {
        const iframeDoc = iframe.contentDocument;
        console.log('[Spelling Bee Buddy] Iframe loaded with date:', gameDate);

        injectIframeStyles(iframeDoc);
        setupIframeResize(iframe, iframeDoc);

        console.log('[Spelling Bee Buddy] Applied CSS to hide unwanted sections');
      } catch (e) {
        console.error('[Spelling Bee Buddy] Could not access iframe content:', e);
      }
    };
  }

  function insertBuddyAfterGame(buddyContainer, gameContainer) {
    if (gameContainer.nextSibling) {
      gameContainer.parentNode.insertBefore(buddyContainer, gameContainer.nextSibling);
    } else {
      gameContainer.parentNode.appendChild(buddyContainer);
    }
  }

  async function embedBuddy() {
    const url = window.location.href;
    const { isValid, gameDate } = parseGameUrl(url);

    if (!isValid) {
      console.log('[Spelling Bee Buddy] Not a game page, skipping');
      return;
    }

    if (gameDate) {
      console.log('[Spelling Bee Buddy] Detected game page with date:', gameDate);
    } else {
      console.log('[Spelling Bee Buddy] Detected today\'s game page');
    }

    const gameContainer = await waitForGameContainer();

    if (document.getElementById('spelling-bee-buddy-container')) {
      console.log('[Spelling Bee Buddy] Already embedded');
      return;
    }

    const buddyContainer = createBuddyContainer();
    const iframe = createBuddyIframe(gameDate);

    setupIframeContent(iframe, gameDate);

    buddyContainer.appendChild(iframe);
    insertBuddyAfterGame(buddyContainer, gameContainer);

    console.log('[Spelling Bee Buddy] Embedded successfully');
  }

  embedBuddy();
})();
