#!/bin/bash

# Generate PNG icons from SVG source
# Requires ImageMagick (magick command)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Generating PNG icons from icon.svg..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "Error: ImageMagick is not installed."
    echo "Install it with: brew install imagemagick"
    exit 1
fi

# Check if source SVG exists
if [ ! -f "icon.svg" ]; then
    echo "Error: icon.svg not found in current directory"
    exit 1
fi

# Generate icons with transparent backgrounds
# Note: -background must come BEFORE reading the SVG file
echo "  Generating icon-48.png..."
magick -background none icon.svg -resize 48x48 icon-48.png

echo "  Generating icon-96.png..."
magick -background none icon.svg -resize 96x96 icon-96.png

echo "  Generating icon-128.png..."
magick -background none icon.svg -resize 128x128 icon-128.png

echo "✓ All icons generated successfully!"
ls -lh icon-*.png
