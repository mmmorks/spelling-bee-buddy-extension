(function() {
  'use strict';

  // Import constants
  const {
    FALLBACK_VISIBILITY_TIMEOUT,
    BUDDY_URL,
    NYT_GAME_WRAPPER_SELECTOR
  } = window.SPELLING_BEE_CONSTANTS || {};

  // Validate that constants loaded successfully
  if (!window.SPELLING_BEE_CONSTANTS) {
    console.error('[Spelling Bee Buddy] Failed to load constants - extension will not run');
    return;
  }

  function parseGameUrl(url) {
    const match = url.match(/\/spelling-bee(?:\/(\d{4}-\d{2}-\d{2})|\/?$)/);
    return {
      isValid: match !== null,
      gameDate: match?.[1] || null
    };
  }

  function waitForGameContainer() {
    return new Promise((resolve) => {
      const checkContainer = () => {
        const container = document.querySelector(NYT_GAME_WRAPPER_SELECTOR);

        if (container) {
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
    iframe.style.visibility = 'hidden';
    return iframe;
  }


  function setupIframeVisibility(iframe) {
    // Make iframe visible after fallback timeout
    setTimeout(() => {
      iframe.style.visibility = 'visible';
    }, FALLBACK_VISIBILITY_TIMEOUT);
  }

  function setupIframeContent(iframe) {
    // Listen for height messages from the iframe
    window.addEventListener('message', function(event) {
      if (event.origin !== 'https://www.nytimes.com') return;
      if (event.data && event.data.type === 'spelling-bee-buddy-resize') {
        iframe.style.height = event.data.height + 'px';
      }
    });

    iframe.onload = function() {
      // Iframe loaded successfully, styles are injected by iframe-content.js
      iframe.style.visibility = 'visible';
    };

    iframe.onerror = function() {
      console.error('[Spelling Bee Buddy] Failed to load content. Please check your internet connection and refresh the page.');
      iframe.style.display = 'none';
      const container = document.getElementById('spelling-bee-buddy-container');
      if (container) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to load Spelling Bee Buddy. Please check your connection and refresh the page.';
        errorMessage.style.color = '#d00';
        errorMessage.style.padding = '10px';
        container.appendChild(errorMessage);
      }
    };

    // Fallback in case onload doesn't fire quickly
    setupIframeVisibility(iframe);
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
      return;
    }

    const gameContainer = await waitForGameContainer();

    if (document.getElementById('spelling-bee-buddy-container')) {
      return;
    }

    const buddyContainer = createBuddyContainer();
    const iframe = createBuddyIframe(gameDate);

    setupIframeContent(iframe);

    buddyContainer.appendChild(iframe);
    insertBuddyAfterGame(buddyContainer, gameContainer);

    console.log('[Spelling Bee Buddy] Successfully loaded');
  }

  embedBuddy();
})();
