document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const extractButton = document.getElementById('extractProfile');
  const previewDiv = document.getElementById('preview');

  // Check if we're on a LinkedIn profile page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('linkedin.com/in/')) {
    statusDiv.textContent = 'Please navigate to a LinkedIn profile page';
    extractButton.disabled = true;
    return;
  }

  // Handle profile extraction
  extractButton.addEventListener('click', async () => {
    try {
      statusDiv.textContent = 'Extracting profile data...';
      extractButton.disabled = true;

      // Request profile extraction
      const response = await chrome.runtime.sendMessage({ action: 'extractProfile' });
      
      if (response?.success) {
        // Show success message
        statusDiv.innerHTML = `
          <div class="success">Profile data extracted successfully!</div>
          <div class="info">The JSON file will download automatically.</div>
        `;
        
        // Show preview of extracted data
        const previewData = {
          name: response.data.name,
          headline: response.data.headline,
          experience: `${response.data.experience?.length || 0} entries`,
          education: `${response.data.education?.length || 0} entries`,
          skills: `${response.data.skills?.length || 0} skills`
        };
        
        previewDiv.innerHTML = `
          <div class="preview-header">Data Preview:</div>
          <div class="preview-content">
            <div><strong>Name:</strong> ${previewData.name}</div>
            <div><strong>Headline:</strong> ${previewData.headline}</div>
            <div><strong>Experience:</strong> ${previewData.experience}</div>
            <div><strong>Education:</strong> ${previewData.education}</div>
            <div><strong>Skills:</strong> ${previewData.skills}</div>
          </div>
        `;
      } else {
        throw new Error(response?.error || 'Failed to extract profile data');
      }
    } catch (error) {
      statusDiv.innerHTML = `<div class="error">${error.message}</div>`;
    } finally {
      extractButton.disabled = false;
    }
  });
});
