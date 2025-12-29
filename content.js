(function() {
  'use strict';

  // Wait for the page to be fully loaded
  async function embedBuddy() {
    // Wait for container
    let checkCount = 0;
    await new Promise((resolve) => {
      const checkContainer = () => {
        checkCount++;
        const hasContainer = document.querySelector('#js-hook-game-wrapper');

        if (checkCount === 1 || checkCount % 100 === 0) {
          console.log(`[Spelling Bee Buddy] Waiting for container... (attempt ${checkCount})`);
        }

        if (hasContainer) {
          console.log('[Spelling Bee Buddy] Game container ready');
          resolve();
        } else {
          requestAnimationFrame(checkContainer);
        }
      };
      checkContainer();
    });

    const gameContainer = document.querySelector('#js-hook-game-wrapper');

    // Check if buddy is already embedded
    if (document.getElementById('spelling-bee-buddy-container')) {
      console.log('[Spelling Bee Buddy] Already embedded');
      return;
    }

    // Extract the game date from the page context by injecting a script
    console.log('[Spelling Bee Buddy] Waiting for gameData...');
    const gameDate = await new Promise((resolve) => {
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          const checkInterval = setInterval(() => {
            if (window.gameData?.today?.printDate) {
              clearInterval(checkInterval);
              document.dispatchEvent(new CustomEvent('gameDateExtracted', {
                detail: { date: window.gameData.today.printDate }
              }));
            }
          }, 50);
        })();
      `;

      document.addEventListener('gameDateExtracted', (e) => {
        const date = e.detail.date;
        if (date) {
          console.log('[Spelling Bee Buddy] Found date from window.gameData:', date);
          resolve(date);
        } else {
          // Fallback to URL
          const urlMatch = window.location.href.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
          if (urlMatch) {
            const urlDate = `${urlMatch[1]}-${urlMatch[2]}-${urlMatch[3]}`;
            console.log('[Spelling Bee Buddy] Found date from URL:', urlDate);
            resolve(urlDate);
          } else {
            console.log('[Spelling Bee Buddy] Could not find game date, omitting date parameter');
            resolve(null);
          }
        }
      }, { once: true });

      document.documentElement.appendChild(script);
      script.remove();
    });

    // Create container for the buddy
    const buddyContainer = document.createElement('div');
    buddyContainer.id = 'spelling-bee-buddy-container';
    buddyContainer.className = 'pz-section';

    // Create a header for the buddy section
    const header = document.createElement('div');
    header.className = 'buddy-header';
    header.innerHTML = '<h3>Spelling Bee Buddy</h3>';
    buddyContainer.appendChild(header);

    // Create iframe pointing to the full Buddy page with the game date
    const iframe = document.createElement('iframe');
    iframe.id = 'spelling-bee-buddy-iframe';
    iframe.src = 'https://www.nytimes.com/interactive/2023/upshot/spelling-bee-buddy.html' + (gameDate ? `?date=${gameDate}` : '');
    iframe.title = 'Spelling Bee Buddy - Grid & Two-Letter List';
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    // Hide iframe until manipulation is complete
    iframe.style.visibility = 'hidden';

    // Add onload handler to hide unwanted sections and resize iframe
    iframe.onload = function() {
      try {
        const iframeDoc = iframe.contentDocument;

        console.log('[Spelling Bee Buddy] Iframe loaded with date:', gameDate);

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
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
          }

          /* Make sections flexible and responsive */
          .the-square,
          .the-square-part-two {
            flex: 1 1 300px !important;
            min-width: 300px !important;
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
          requestAnimationFrame(() => {
            const container = iframeDoc.querySelector('.sb-buddy-container');
            if (container) {
              const height = container.scrollHeight + 40; // Add some padding
              iframe.style.height = height + 'px';
              console.log('[Spelling Bee Buddy] Resized iframe to', height + 'px');
            }
          });
        }

        // Watch for when the visible sections are actually rendered
        const targetSections = iframeDoc.querySelectorAll('.the-square, .the-square-part-two');
        if (targetSections.length > 0) {
          const container = iframeDoc.querySelector('.sb-buddy-container');
          if (container) {
            // Use MutationObserver only to detect initial content load
            let initialLoadComplete = false;
            const observer = new MutationObserver(() => {
              if (initialLoadComplete) return;

              const gridSection = iframeDoc.querySelector('.the-square');
              const twoLetterSection = iframeDoc.querySelector('.the-square-part-two');

              if (gridSection && twoLetterSection &&
                  gridSection.offsetHeight > 0 && twoLetterSection.offsetHeight > 0) {
                initialLoadComplete = true;
                observer.disconnect();
                resizeIframe();
                // Make iframe visible now that manipulation is complete
                iframe.style.visibility = 'visible';
                console.log('[Spelling Bee Buddy] Initial content loaded, MutationObserver disconnected');
              }
            });

            observer.observe(container, {
              childList: true,
              subtree: true
            });

            // Initial resize attempt
            setTimeout(resizeIframe, 100);

            // Fallback: make iframe visible after a timeout if content hasn't loaded yet
            setTimeout(() => {
              if (!initialLoadComplete) {
                iframe.style.visibility = 'visible';
                console.log('[Spelling Bee Buddy] Made iframe visible via fallback timeout');
              }
            }, 2000);

            // Use ResizeObserver for ongoing size changes
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

  // Start the embedding process
  embedBuddy();
})();
