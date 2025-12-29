// Timing Constants (milliseconds)
const INITIAL_RESIZE_DELAY = 100;
const FALLBACK_VISIBILITY_TIMEOUT = 2000;
const LOG_CHECK_INTERVAL = 100;

// NYT Spelling Bee Buddy URL
const BUDDY_URL = 'https://www.nytimes.com/interactive/2023/upshot/spelling-bee-buddy.html';

// NYT page selectors (external to our extension - these matter for maintainability)
const NYT_GAME_WRAPPER_SELECTOR = '#js-hook-game-wrapper';
const NYT_BUDDY_CONTAINER_SELECTOR = '.sb-buddy-container';
const NYT_GRID_SECTION_SELECTOR = '.the-square';
const NYT_TWO_LETTER_LIST_SELECTOR = '.the-square-part-two';

// Layout constants
const MIN_SECTION_WIDTH = 300;
const SECTION_GAP = 10;
const IFRAME_HEIGHT_PADDING = 40;

// Export all constants for browser extension context
if (typeof window !== 'undefined') {
  window.SPELLING_BEE_CONSTANTS = {
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
  };
}

// Also support module exports for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
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
  };
}
