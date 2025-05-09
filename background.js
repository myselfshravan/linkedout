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
  if (tab.url?.includes("linkedin.com/in/")) {
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
      console.log("Received extractProfile message in background");
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        console.log("Current tab:", tab);
        if (tab?.id) {
          console.log("Sending extractProfile message to content script");
          chrome.tabs.sendMessage(
            tab.id,
            { action: "extractProfile" },
            (response) => {
              console.log("Received response from content script:", response);
              if (response?.success) {
                const profileData = response.data;
                console.log(
                  "Processing profile data for download:",
                  profileData
                );

                // Convert data to base64 and trigger download
                const jsonString = JSON.stringify(profileData, null, 2);
                const base64Data = btoa(
                  unescape(encodeURIComponent(jsonString))
                );
                const dataUrl = `data:application/json;base64,${base64Data}`;
                // Create filename with fallback if name is not available
                const filename = profileData.name
                  ? `${profileData.name
                      .replace(/\s+/g, "_")
                      .toLowerCase()}_linkedin_profile.json`
                  : `linkedin_profile_${
                      new Date().toISOString().split("T")[0]
                    }.json`;

                chrome.downloads.download(
                  {
                    url: dataUrl,
                    filename: filename,
                    saveAs: true,
                  },
                  (downloadId) => {
                    if (chrome.runtime.lastError) {
                      console.error(
                        "Download error:",
                        chrome.runtime.lastError
                      );
                    } else {
                      console.log("Download started with ID:", downloadId);
                    }
                  }
                );
              }
              sendResponse(response);
            }
          );
        }
      });
      return true;
  }
});
