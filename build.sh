#!/bin/bash

# Build script for NYT Spelling Bee Buddy Extension
# Creates a .xpi package for distribution

set -e

EXTENSION_NAME="spelling-bee-buddy-extension"
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')

echo "Building ${EXTENSION_NAME} v${VERSION}..."

# Clean up any existing builds
rm -f "${EXTENSION_NAME}.xpi"
rm -f "${EXTENSION_NAME}.zip"

# Create the XPI file (which is just a zip file with .xpi extension)
# Include only necessary files
zip -r "${EXTENSION_NAME}.xpi" \
  manifest.json \
  content.js \
  content.css \
  icons/ \
  LICENSE \
  README.md \
  -x "*.DS_Store" \
  -x "icons/.DS_Store" \
  -x "icons/README.md" \
  -x "icons/icon.svg" \
  -x "icons/generate_icons.sh" \
  -x "__MACOSX/*" \
  2>/dev/null || true

echo "✓ Created ${EXTENSION_NAME}.xpi"
echo ""
echo "Installation:"
echo "1. Open Firefox"
echo "2. Navigate to about:addons"
echo "3. Click the gear icon → Install Add-on From File"
echo "4. Select ${EXTENSION_NAME}.xpi"
echo ""
echo "OR for temporary installation:"
echo "1. Navigate to about:debugging#/runtime/this-firefox"
echo "2. Click 'Load Temporary Add-on'"
echo "3. Select manifest.json from this directory"
echo ""
echo "For Mozilla Add-ons submission:"
echo "1. Go to https://addons.mozilla.org/developers/"
echo "2. Submit ${EXTENSION_NAME}.xpi for review"
