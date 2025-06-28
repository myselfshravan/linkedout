document.addEventListener("DOMContentLoaded", async () => {
  const statusDiv = document.getElementById("status");
  const extractButton = document.getElementById("extractProfile");
  const previewDiv = document.getElementById("preview");
  const nameDiv = document.getElementById("profileName");
  const aboutDiv = document.getElementById("profileAbout");
  const featuredDiv = document.getElementById("profileFeatured");

  // Check if we're on a LinkedIn profile page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes("linkedin.com/in/")) {
    statusDiv.innerHTML = '<div class="error">Please navigate to a LinkedIn profile page</div>';
    extractButton.disabled = true;
    return;
  }

  // Handle profile extraction
  extractButton.addEventListener("click", async () => {
    try {
      statusDiv.innerHTML = '<div class="info">Extracting profile data...</div>';
      extractButton.disabled = true;

      // Request profile extraction
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "extractProfile",
      });

      if (response?.success) {
        const { data } = response;
        
        // Display name and headline
        nameDiv.innerHTML = `
          <h3>Profile Info</h3>
          <div class="content">
            <div class="item"><strong>${data.name}</strong></div>
            ${data.headline ? `<div class="item">${data.headline}</div>` : ''}
            ${data.location ? `<div class="item">${data.location}</div>` : ''}
          </div>
        `;

        // Display about section
        if (data.about) {
          aboutDiv.innerHTML = `
            <h3>About</h3>
            <div class="content">${data.about}</div>
          `;
        }

        // Display featured posts
        if (data.featured && data.featured.length > 0) {
          const featuredContent = data.featured
            .map(post => `
              <div class="featured-item">
                <div class="title">${post.title}</div>
                ${post.description ? `<div class="description">${post.description}</div>` : ''}
              </div>
            `)
            .join('');

          featuredDiv.innerHTML = `
            <h3>Featured</h3>
            <div class="content">
              ${featuredContent}
            </div>
          `;
        }

        // Add download button
        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-btn';
        downloadButton.textContent = 'Download Profile Data';
        downloadButton.onclick = () => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${data.name.replace(/\s+/g, '_')}_profile.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };
        
        statusDiv.innerHTML = '<div class="success">Profile data extracted successfully!</div>';
        extractButton.parentNode.appendChild(downloadButton);

      } else {
        throw new Error(response?.error || "Failed to extract profile data");
      }
    } catch (error) {
      console.error("Error:", error);
      statusDiv.innerHTML = `<div class="error">${error.message}</div>`;
    } finally {
      extractButton.disabled = false;
    }
  });
});
