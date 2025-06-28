// Content script for LinkedIn Profile Extractor
(() => {
  // Function to safely extract text content
  function extractText(element) {
    return element ? element.textContent.trim() : '';
  }

  // Function to extract profile data
  async function extractProfileData() {
    try {
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Extract name
      const nameElement = document.querySelector('.text-heading-xlarge');
      const name = extractText(nameElement);

      // Extract about section
      const aboutSection = document.getElementById('about');
      let about = '';
      if (aboutSection) {
        // Look for the text content within the about section
        const aboutText = aboutSection.querySelector('.display-flex.ph5.pv3 .inline-show-more-text');
        about = extractText(aboutText);
      }

      // Extract featured posts
      const featuredSection = document.getElementById('featured');
      let featured = [];
      if (featuredSection) {
        const featuredList = featuredSection.querySelector('.pvs-list__outer-container');
        if (featuredList) {
          const items = featuredList.querySelectorAll('.artdeco-list__item');
          items.forEach(item => {
            const title = extractText(item.querySelector('.optional-action-target-wrapper'));
            const description = extractText(item.querySelector('.pvs-list__subtitle-item'));
            if (title) {
              featured.push({
                title,
                description: description || ''
              });
            }
          });
        }
      }

      // Additional profile info
      const headline = extractText(document.querySelector('.text-body-medium'));
      const location = extractText(document.querySelector('.text-body-small.inline'));

      // Compile the data
      const profileData = {
        name,
        headline,
        location,
        about,
        featured
      };

      return {
        success: true,
        data: profileData
      };

    } catch (error) {
      console.error('Extraction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listen for extraction request
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractProfile') {
      extractProfileData().then(sendResponse);
      return true;
    }
  });
})();
