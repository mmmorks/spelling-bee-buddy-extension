# Icons

This directory contains icon files for the extension in multiple sizes.

## Icon Files

- `icon.svg` - Source SVG file (vector format)
- `icon-16.png` - 16x16 pixels (browser toolbar, small displays)
- `icon-32.png` - 32x32 pixels (browser toolbar, retina displays)
- `icon-48.png` - 48x48 pixels (add-ons manager, permissions dialog)
- `icon-96.png` - 96x96 pixels (high-DPI displays, add-ons manager)
- `icon-128.png` - 128x128 pixels (Chrome Web Store, large displays)

## Generating Icons

To regenerate all PNG icons from the source SVG:

```bash
cd icons
./generate_icons.sh
```

**Requirements:**
- ImageMagick must be installed
- On macOS: `brew install imagemagick`
- On Linux: `sudo apt-get install imagemagick` or equivalent

## Icon Design

The current icon features:
- Yellow/gold color scheme (representing a bee and honeycomb)
- Hexagonal honeycomb pattern
- Simple and recognizable at all sizes
- Transparent background for flexibility

## Creating Custom Icons

If you want to create your own icon design:

1. Edit `icon.svg` with your favorite vector editor (Inkscape, Illustrator, etc.)
2. Run `./generate_icons.sh` to generate all PNG sizes
3. The build script automatically includes all icon files in the extension packages
