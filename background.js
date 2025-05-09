// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable(); // Disable by default
});

// Handle active tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  updateExtensionState(tab);
});

// Handle tab URL updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    updateExtensionState(tab);
  }
});

// Function to update extension state based on current tab
async function updateExtensionState(tab) {
  if (tab.url?.includes('linkedin.com/in/')) {
    chrome.action.enable(tab.id);
  } else {
    chrome.action.disable(tab.id);
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "getCurrentTab":
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab) {
          sendResponse({ tab });
        }
      });
      return true;

    case "extractProfile":
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, { action: "extractProfile" }, (response) => {
            if (response?.success) {
              const profileData = response.data;
              
              // Create blob and trigger download
              const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const filename = `${profileData.name.replace(/\s+/g, '_').toLowerCase()}_linkedin_profile.json`;
              
              chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
              });
            }
            sendResponse(response);
          });
        }
      });
      return true;
  }
});
