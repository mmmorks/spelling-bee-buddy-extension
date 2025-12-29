(function() {
  'use strict';

  // Wait for the page to be fully loaded
  function embedBuddy() {
    // Try to find the main game container
    // Based on the actual NYT Spelling Bee page structure
    const possibleSelectors = [
      '#js-hook-game-wrapper',      // Main game wrapper
      '.pz-game-wrapper',            // Alternative game wrapper class
      '.pz-game-screen',             // Game screen when loaded
      '#spelling-bee-container',     // Outer container
      '.pz-section'                  // Section container
    ];

    let gameContainer = null;
    for (const selector of possibleSelectors) {
      gameContainer = document.querySelector(selector);
      if (gameContainer) {
        console.log('[Spelling Bee Buddy] Found game container with selector:', selector);
        break;
      }
    }

    // If we can't find a specific container, try to find the main content area
    if (!gameContainer) {
      gameContainer = document.querySelector('.pz-content') || document.querySelector('main');
      console.log('[Spelling Bee Buddy] Using fallback container');
    }

    if (!gameContainer) {
      console.error('[Spelling Bee Buddy] Could not find a suitable container');
      return;
    }

    // Check if buddy is already embedded
    if (document.getElementById('spelling-bee-buddy-container')) {
      console.log('[Spelling Bee Buddy] Already embedded');
      return;
    }

    // Create container for the buddy
    const buddyContainer = document.createElement('div');
    buddyContainer.id = 'spelling-bee-buddy-container';
    buddyContainer.className = 'pz-section';

    // Create a header for the buddy section
    const header = document.createElement('div');
    header.className = 'buddy-header';
    header.innerHTML = '<h3>Spelling Bee Buddy</h3>';
    buddyContainer.appendChild(header);

    // Create iframe pointing to the full Buddy page
    const iframe = document.createElement('iframe');
    iframe.id = 'spelling-bee-buddy-iframe';
    iframe.src = 'https://www.nytimes.com/interactive/2023/upshot/spelling-bee-buddy.html';
    iframe.title = 'Spelling Bee Buddy - Grid & Two-Letter List';
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');

    // Add onload handler to hide unwanted sections and resize iframe
    iframe.onload = function() {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Create style element to hide unwanted sections
        const style = iframeDoc.createElement('style');
        style.textContent = `
          /* Hide everything in the container by default */
          .sb-buddy-container > * {
            display: none !important;
          }

          /* Only show the Grid and Two-Letter List sections */
          .the-square,
          .the-square-part-two {
            display: block !important;
          }

          /* Clean up spacing */
          body {
            margin: 0 !important;
            padding: 10px 20px !important;
            background: white !important;
            overflow: hidden !important;
          }

          .sb-buddy-container {
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Hide header and footer elements */
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

        // Function to resize iframe to fit content
        function resizeIframe() {
          try {
            requestAnimationFrame(() => {
              const container = iframeDoc.querySelector('.sb-buddy-container');
              if (container) {
                const height = container.scrollHeight + 40; // Add some padding
                iframe.style.height = height + 'px';
                console.log('[Spelling Bee Buddy] Resized iframe to', height + 'px');
              }
            });
          } catch (e) {
            console.error('[Spelling Bee Buddy] Could not resize iframe:', e);
          }
        }

        // Watch for when the visible sections are actually rendered
        const targetSections = iframeDoc.querySelectorAll('.the-square, .the-square-part-two');
        if (targetSections.length > 0) {
          // Use MutationObserver to detect when content is fully loaded
          const observer = new MutationObserver((mutations, obs) => {
            // Check if both sections have content
            const gridSection = iframeDoc.querySelector('.the-square');
            const twoLetterSection = iframeDoc.querySelector('.the-square-part-two');

            if (gridSection && twoLetterSection &&
                gridSection.offsetHeight > 0 && twoLetterSection.offsetHeight > 0) {
              resizeIframe();
              // Resize again after a brief delay to catch any late-loading content
              setTimeout(resizeIframe, 100);
            }
          });

          // Observe the container for any changes
          const container = iframeDoc.querySelector('.sb-buddy-container');
          if (container) {
            observer.observe(container, {
              childList: true,
              subtree: true,
              attributes: true,
              characterData: true
            });

            // Initial resize
            setTimeout(resizeIframe, 100);

            // Stop observing after content is stable
            setTimeout(() => observer.disconnect(), 3000);

            // Also use ResizeObserver for ongoing changes
            const resizeObserver = new ResizeObserver(resizeIframe);
            resizeObserver.observe(container);
          }
        }

        console.log('[Spelling Bee Buddy] Applied CSS to hide unwanted sections');
      } catch (e) {
        console.error('[Spelling Bee Buddy] Could not access iframe content:', e);
      }
    };

    buddyContainer.appendChild(iframe);

    // Insert after the game container
    if (gameContainer.nextSibling) {
      gameContainer.parentNode.insertBefore(buddyContainer, gameContainer.nextSibling);
    } else {
      gameContainer.parentNode.appendChild(buddyContainer);
    }

    console.log('[Spelling Bee Buddy] Embedded successfully');
  }

  // Try to embed immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', embedBuddy);
  } else {
    embedBuddy();
  }

  // Also observe for dynamic content loading (NYT uses React)
  const observer = new MutationObserver((mutations) => {
    // Only try once every few seconds to avoid performance issues
    if (!window.buddyEmbedAttempted) {
      window.buddyEmbedAttempted = true;
      setTimeout(() => {
        embedBuddy();
        window.buddyEmbedAttempted = false;
      }, 2000);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Stop observing after 30 seconds to avoid unnecessary processing
  setTimeout(() => observer.disconnect(), 30000);
})();
