# LinkedIn Profile Downloader (LinkedOut)

A Chrome extension that allows you to download LinkedIn profiles as JSON format for easy data portability and analysis.

## Features

- � Download LinkedIn profile data as JSON files
- 🎯 Simple one-click download from LinkedIn profile pages
- � Extracts comprehensive profile information
- 🔄 Real-time data capture from active tabs
- 🎨 Clean and intuitive user interface
- 💾 Saves data using Chrome Downloads API for easy access

## How It Works

The extension adds a convenient download option on LinkedIn profile pages. When activated, it:

1. Captures profile data from the current LinkedIn page
2. Formats the data into a structured JSON file
3. Initiates a download of the JSON file to your device
4. Provides feedback on the download status

## Technical Implementation

- Uses Manifest V3 for modern Chrome extension architecture
- Content script injects UI elements and extracts profile data
- Background service worker handles permissions and tab management
- Utilizes Chrome Storage API for settings or temporary data
- Implements downloads API for saving JSON files

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to a LinkedIn profile page
2. Click the LinkedIn Profile Downloader icon in the Chrome toolbar
3. Click the download button in the popup to capture and save the profile data
4. Check your downloads folder for the JSON file containing the profile information

The extension works automatically on LinkedIn pages and provides instant feedback through the popup interface.

## Permissions

- `activeTab`: For accessing the current LinkedIn page content
- `storage`: For saving settings or temporary data
- `downloads`: For saving profile data as JSON files
- `tabs`: For managing tab interactions
- `scripting`: For dynamic script injection
- Host permissions for `*://*.linkedin.com/*`: To operate on LinkedIn domains

## Author

Created by Shravan MR
