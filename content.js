(() => {
  async function extractProfileData() {
    try {
      console.log("Starting profile data extraction...");

      // Wait for dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get all visually-hidden spans not inside aside elements
      const textBlocks = Array.from(
        document.querySelectorAll("span.visually-hidden")
      )
        .filter((span) => !span.closest("aside"))
        .map((span) => span.textContent.trim())
        .filter((text) => text.length > 0);

      console.log("Found text blocks:", textBlocks);

      const profile = {
        name: textBlocks
          .find((text) => text.includes(" has a "))
          ?.split(" has a ")[0],
        headline: textBlocks.find((text) =>
          text.includes("Sales Development Manager")
        ),
        about: textBlocks.find((text) => text.includes("Over the years")),
        skills:
          textBlocks
            .find((text) => text.includes("Sales Development •"))
            ?.split(" • ") || [],
        services:
          textBlocks
            .find((text) => text.includes("Lead Generation •"))
            ?.split(" • ") || [],
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };

      console.log("Extracted profile:", profile);
      return profile;
    } catch (error) {
      console.error("Error extracting profile data:", error);
      throw new Error("Failed to extract profile data");
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractProfile") {
      (async () => {
        try {
          const profileData = await extractProfileData();
          sendResponse({ success: true, data: profileData });
        } catch (error) {
          console.error("Error in profile extraction:", error);
          sendResponse({ success: false, error: error.message });
        }
      })();
      return true;
    }
  });
})();
