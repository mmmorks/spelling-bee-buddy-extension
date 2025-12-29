#!/bin/bash

# Build script for NYT Spelling Bee Buddy Extension
# Creates packages for both Firefox (.xpi) and Chrome (.zip)

set -e

EXTENSION_NAME="spelling-bee-buddy-extension"
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')

echo "Building ${EXTENSION_NAME} v${VERSION}..."

# Clean up any existing builds
rm -f "${EXTENSION_NAME}-firefox.xpi"
rm -f "${EXTENSION_NAME}-chrome.zip"
rm -f "${EXTENSION_NAME}.xpi"
rm -f "${EXTENSION_NAME}.zip"

# Create the Firefox XPI file
echo "Creating Firefox package..."
zip -r "${EXTENSION_NAME}-firefox.xpi" \
  manifest.json \
  constants.js \
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

echo "✓ Created ${EXTENSION_NAME}-firefox.xpi"

# Create the Chrome ZIP file (identical contents, just different extension)
echo "Creating Chrome package..."
zip -r "${EXTENSION_NAME}-chrome.zip" \
  manifest.json \
  constants.js \
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

echo "✓ Created ${EXTENSION_NAME}-chrome.zip"
echo ""
echo "========================================="
echo "Firefox Installation:"
echo "========================================="
echo "Temporary (for testing):"
echo "1. Navigate to about:debugging#/runtime/this-firefox"
echo "2. Click 'Load Temporary Add-on'"
echo "3. Select manifest.json from this directory"
echo ""
echo "Permanent (local install):"
echo "1. Open Firefox"
echo "2. Navigate to about:addons"
echo "3. Click the gear icon → Install Add-on From File"
echo "4. Select ${EXTENSION_NAME}-firefox.xpi"
echo ""
echo "Mozilla Add-ons submission:"
echo "1. Go to https://addons.mozilla.org/developers/"
echo "2. Submit ${EXTENSION_NAME}-firefox.xpi for review"
echo ""
echo "========================================="
echo "Chrome Installation:"
echo "========================================="
echo "Developer mode (for testing):"
echo "1. Navigate to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top-right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this directory"
echo ""
echo "Chrome Web Store submission:"
echo "1. Go to https://chrome.google.com/webstore/devconsole"
echo "2. Upload ${EXTENSION_NAME}-chrome.zip"
echo "3. Complete store listing and submit for review"
