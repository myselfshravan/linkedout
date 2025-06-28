// Initialize extension
self.addEventListener('install', () => {
  console.log('Extension installed');
});

self.addEventListener('activate', () => {
  console.log('Extension activated');
});

// Handle content script injection
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('linkedin.com/in/')) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    })
    .catch(err => console.error('Failed to inject content script:', err));
  }
});
