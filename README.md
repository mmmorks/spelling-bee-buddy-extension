# NYT Spelling Bee Buddy Embedder

A browser extension for Firefox and Chrome that embeds the Grid and Two-Letter List from the NYT Spelling Bee Buddy directly into the Spelling Bee game page for easy reference while playing.

## Features

- **Inline Integration**: Grid and Two-Letter List appear directly on the game page
- **No Scrolling**: Content flows naturally with the page, no iframe scrolling needed
- **Clean Display**: Hides all unnecessary sections, showing only the helpful grids
- **Dynamic Sizing**: Automatically adjusts height based on content
- **Responsive Design**: Works on desktop and mobile devices
- **Zero Configuration**: Works out of the box with no setup required

## Installation

### Firefox

#### Quick Start (Temporary - Recommended for Testing)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/mmmorks/spelling-bee-buddy-extension.git
   cd spelling-bee-buddy-extension
   ```
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on..."**
4. Select the `manifest.json` file from the extension directory
5. Visit [NYT Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee)
6. The Grid and Two-Letter List will appear below the game!

> **Note**: Temporary installations are removed when Firefox restarts. This is perfect for testing and personal use.

#### Build and Install XPI Package
```bash
# From the extension directory
./build.sh
```
This creates `spelling-bee-buddy-extension-firefox.xpi` which you can:
- Install in Firefox (requires signing or Developer Edition)
- Submit to Mozilla Add-ons for distribution

See [INSTALLATION.md](INSTALLATION.md) for detailed Firefox installation options.

### Chrome

1. Clone or download this repository (same as Firefox steps above)
2. Run the build script:
   ```bash
   ./build.sh
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **"Developer mode"** (toggle in top-right)
5. Click **"Load unpacked"**
6. Select the extension directory
7. Visit [NYT Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee)

For Chrome Web Store distribution, use the generated `spelling-bee-buddy-extension-chrome.zip` file.

## Usage

1. Install the extension using one of the methods above
2. Navigate to https://www.nytimes.com/puzzles/spelling-bee
3. The Spelling Bee Buddy will automatically appear below the game controls
4. Start playing and use the buddy tool to help with your game!

## Customization

If the buddy doesn't appear in the right location, you may need to adjust the selectors in `content.js`:

1. Open the Spelling Bee page
2. Right-click on the main game controls and select "Inspect Element"
3. Note the class names or IDs of the container
4. Edit `content.js` and update the `possibleSelectors` array with the correct selectors

## Troubleshooting

**The buddy doesn't appear:**
- Check the browser console (F12) for error messages with the prefix `[Spelling Bee Buddy]`
- Verify you're on the correct URL: `https://www.nytimes.com/puzzles/spelling-bee`
- Try refreshing the page
- Check that the extension is enabled in `about:addons`

**The buddy appears but shows too much content:**
- The extension should only show Grid and Two-Letter List sections
- Check the console for CSS application errors
- Try reloading the extension in `about:debugging`

**Layout or sizing issues:**
- The iframe height adjusts automatically based on content
- Check console logs showing resize events
- Verify your browser zoom is set to 100%

## Project Structure

```
spelling-bee-buddy-extension/
├── manifest.json          # Extension configuration and metadata
├── constants.js          # Shared constants used across scripts
├── content.js            # Main script for the Spelling Bee page
├── iframe-content.js     # Script for the embedded Buddy iframe
├── content.css           # Styling for the embedded container
├── icons/                # Extension icons (16, 32, 48, 96, 128px)
│   ├── icon.svg         # Source SVG file
│   ├── generate_icons.sh # Script to generate PNG icons from SVG
│   └── README.md        # Icon documentation
├── build.sh             # Build script to create .xpi and .zip packages
├── INSTALLATION.md      # Detailed installation guide
├── .gitignore           # Git ignore file
├── LICENSE              # MIT License
└── README.md            # This file
```

## Development

### Making Changes
1. Edit the files in the extension directory
2. Reload the extension in `about:debugging` → **Reload** button
3. Refresh the Spelling Bee page to see changes

### Console Logging
The extension logs helpful debug information:
- `[Spelling Bee Buddy] Found game container...` - Successfully located insertion point
- `[Spelling Bee Buddy] Embedded successfully` - Extension loaded
- `[Spelling Bee Buddy] Resized iframe to Xpx` - Height adjustment occurred
- `[Spelling Bee Buddy] Applied CSS...` - Styles injected into iframe

## Privacy & Security

This extension:
- ✅ Only runs on NYT Spelling Bee pages (`https://www.nytimes.com/puzzles/spelling-bee*`)
- ✅ Does not collect, store, or transmit any user data
- ✅ Does not make external network requests
- ✅ Only embeds content from the official NYT Spelling Bee Buddy page
- ✅ Uses sandboxed iframe for security
- ✅ Open source - all code is visible and auditable

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Credits

- Built for NYT Spelling Bee enthusiasts
- Uses the official [NYT Spelling Bee Buddy](https://www.nytimes.com/interactive/2023/upshot/spelling-bee-buddy.html)
- Not affiliated with The New York Times

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review console logs (F12 → Console)
3. Open an issue on GitHub with:
   - Firefox version
   - Extension version
   - Console error messages
   - Steps to reproduce
