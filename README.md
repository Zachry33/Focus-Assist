# Focus Assist

A Chrome extension that reduces short form content consumption by removing, blocking, and limiting it on sites like YouTube and Twitter/X.

## Features

### YouTube

Strips Shorts from the interface so they never show up as a distraction:

- Removes the **Shorts** entry from the navigation sidebar
- Removes Shorts shelves/carousels on the home page, search results, channel pages, and the related videos panel
- Removes regular looking video results that are actually Shorts (with or without the Shorts badge on the thumbnail)
- Removes the **Shorts** filter chip in search results
- Hides the **Shorts** tab on channel pages and adjusts the tab underline
- Redirects any `youtube.com/shorts/...` URL to the YouTube home page

### Twitter/X

Puts a cap on how much of the feed you can scroll through:

- Counts the tweets that load into your timeline
- Ignores promoted tweets (ads) so they don't count toward your limit
- Doesn't count or restrict anything when you open a specific tweet thread (`/status/...`)
- Once the limit (default: **15**) is exceeded, a blocker message is shown and page scrolling is disabled

## Installation

The extension isn't packaged for the Chrome Web Store as of this moment, so load it as an unpacked extension:

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome (or any Chromium based browser).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder (the one containing `manifest.json`).
5. Visit YouTube or Twitter/X. The extension runs automatically, with no configuration needed.

## Configuration

There's no settings UI by design as being able to change the limit provides an easy way to circumvent the limits set.