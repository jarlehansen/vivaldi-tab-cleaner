# Vivaldi Tab Cleaner

A Vivaldi browser extension that automatically closes tabs that were opened yesterday, while preserving pinned and stacked tabs.

## Features

- One-click cleanup of tabs from the previous day
- Preserves pinned tabs
- Preserves stacked tabs (Vivaldi specific feature)
- Option to automatically clean tabs daily
- Statistics tracking of closed tabs

## Installation

Since this is a development version, you'll need to load it as an unpacked extension:

1. Download or clone this repository
2. Open Vivaldi and go to `vivaldi://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the directory containing this extension

## Usage

- Click the extension icon to open the popup
- Toggle "Extension Enabled" to turn the extension on/off
- Toggle "Auto-clean Daily" to automatically clean tabs each day
- Click "Clean Yesterday's Tabs Now" to manually trigger cleaning

## Notes

- This extension uses the Chrome extension API since Vivaldi is based on Chromium
- The extension identifies stacked tabs by checking for a groupId

## Privacy

This extension does not collect or transmit any data. All information is stored locally in your browser.