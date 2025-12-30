# Installation Guide

This guide covers installation for both Firefox and Chrome browsers.

## Chrome Installation

Chrome makes it easy to install unsigned extensions in developer mode:

1. Clone or download this repository
2. Run the build script (optional, for packaged version):
   ```bash
   ./build.sh
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **"Developer mode"** (toggle in top-right corner)
5. Click **"Load unpacked"**
6. Select the extension directory (the folder containing `manifest.json`)
7. The extension is now installed!

### Chrome Web Store Distribution

To publish on the Chrome Web Store:
1. Run `./build.sh` to create `spelling-bee-buddy-extension-chrome.zip`
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload the `.zip` file
4. Complete the store listing and submit for review

---

## Firefox Installation

Firefox requires extensions to be signed by Mozilla for security. Since this is an unsigned extension, you have a few options:

## ✅ Recommended: Temporary Installation (Regular Firefox)

**Best for personal use - No security compromises**

1. Open Firefox
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on..."**
4. Navigate to the extension folder and select `manifest.json`
5. Extension is loaded until Firefox restarts

**Pros:**
- ✅ Works in regular Firefox
- ✅ No security settings changes needed
- ✅ Simple and safe

**Cons:**
- ❌ Removed when Firefox restarts
- ❌ Need to reload after each restart

---

## ✅ Recommended: Firefox Developer Edition

**Best for permanent installation without security compromises**

1. Download [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) (it's free!)
2. Install it (can run alongside regular Firefox)
3. In Developer Edition:
   - Go to `about:config`
   - Search for `xpinstall.signatures.required`
   - Set to `false`
4. Drag and drop the `.xpi` file into Developer Edition
5. Extension stays installed permanently!

**Pros:**
- ✅ Permanent installation
- ✅ Designed for extension development
- ✅ Doesn't affect your regular Firefox
- ✅ Can use both browsers side-by-side

**Cons:**
- ❌ Need to install separate browser

---

## ⚠️ Not Recommended: Disable Signature Verification (Regular Firefox)

**Only if you really need permanent installation in regular Firefox**

1. Type `about:config` in Firefox address bar
2. Accept the warning
3. Search for `xpinstall.signatures.required`
4. Double-click to set it to `false`
5. Now you can install the `.xpi` file

**Warning:** This reduces your browser's security by allowing ANY unsigned extension to run. Only do this if you understand the risks.

---

## 🚀 Best Solution: Get it Signed by Mozilla

To make this available to everyone without installation hassles:

### Submit to Mozilla Add-ons (AMO)

1. Run `./build.sh` to create `spelling-bee-buddy-extension-firefox.xpi`
2. Create account at https://addons.mozilla.org/developers/
3. Submit the `.xpi` file
4. Mozilla reviews it (usually 1-2 weeks for first submission)
5. Once approved:
   - Users can install with one click
   - Automatic updates
   - Listed in Firefox Add-ons store

### Self-Distribution with Signing (Advanced)

If you don't want to publish publicly but want signing:

1. Run `./build.sh` to create the `.xpi` file
2. Go to https://addons.mozilla.org/developers/
3. Upload your `.xpi` under "Submit a New Add-on"
4. Choose "On your own" (not listed on AMO)
5. Mozilla signs it and returns a signed `.xpi`
6. Distribute the signed version to users

---

## Quick Comparison

| Method | Permanent? | Security | Effort | Best For |
|--------|-----------|----------|--------|----------|
| Temporary Load | ❌ | ✅ High | Low | Testing |
| Developer Edition | ✅ | ✅ High | Medium | Personal Use |
| Disable Verification | ✅ | ❌ Low | Low | Last Resort |
| Mozilla Signing | ✅ | ✅ High | High | Distribution |

---

## Current Recommendation

**For You (Personal Use):**
- Use **Firefox Developer Edition** with signature verification disabled
- This gives permanent installation without compromising your main browser

**For Sharing with Others:**
- Instruct them to use **Temporary Installation** (safest and easiest)
- Or get it **signed by Mozilla** for one-click installation

---

## Need Help?

- Firefox Developer Edition: https://www.mozilla.org/firefox/developer/
- Mozilla Add-ons Documentation: https://extensionworkshop.com/
- Extension Signing Info: https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/
