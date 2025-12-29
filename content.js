(function() {
  'use strict';

  const {
    FALLBACK_VISIBILITY_TIMEOUT,
    BUDDY_URL,
    NYT_GAME_WRAPPER_SELECTOR
  } = window.SPELLING_BEE_CONSTANTS;

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

  function createBuddyContainer(gameDate) {
    const container = document.createElement('div');
    container.id = 'spelling-bee-buddy-container';
    container.className = 'pz-section';

    const header = document.createElement('div');
    header.className = 'buddy-header';

    const link = document.createElement('a');
    link.href = BUDDY_URL + (gameDate ? `?date=${gameDate}` : '');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Spelling Bee Buddy';

    const heading = document.createElement('h3');
    heading.appendChild(link);

    header.appendChild(heading);
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


  function setupIframeContent(iframe) {
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://www.nytimes.com') return;
      if (event.data && event.data.type === 'spelling-bee-buddy-resize') {
        iframe.style.height = event.data.height + 'px';
      }
    });

    iframe.onload = () => {
      iframe.style.visibility = 'visible';
    };

    iframe.onerror = () => {
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

    setTimeout(() => {
      iframe.style.visibility = 'visible';
    }, FALLBACK_VISIBILITY_TIMEOUT);
  }

  function insertBuddyAfterGame(buddyContainer, gameContainer) {
    gameContainer.insertAdjacentElement('afterend', buddyContainer);
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

    const buddyContainer = createBuddyContainer(gameDate);
    const iframe = createBuddyIframe(gameDate);

    setupIframeContent(iframe);

    buddyContainer.appendChild(iframe);
    insertBuddyAfterGame(buddyContainer, gameContainer);

    console.log('[Spelling Bee Buddy] Successfully loaded');
  }

  embedBuddy();
})();
