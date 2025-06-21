function renderEntries() {
  const entryContainer = document.getElementById("entryContainer");
  entryContainer.innerHTML = "";

  const storedMap = JSON.parse(localStorage.getItem("amicaCareFormMap")) || {};
  const entries = Object.entries(storedMap);

  if (entries.length === 0) {
    entryContainer.innerHTML = "<p>No submissions found.</p>";
    return;
  }

  entries.forEach(([id, data]) => {
    const entryDiv = document.createElement("div");
    entryDiv.className = "entry";

    entryDiv.innerHTML = `
      <div class="entry-id"><strong>ID:</strong> ${id}</div>
      <div><strong>Name:</strong> ${data.fullName || "N/A"}</div>
      <div><strong>Date:</strong> ${data.evaluationDate || "N/A"}</div>
      <div><strong>Status:</strong> ${data.status || "N/A"}</div>
      <div class="entry-actions"></div>
    `;

    const actionsDiv = entryDiv.querySelector('.entry-actions');
    
    // View Details Button
    const viewDetailsBtn = document.createElement("button");
    viewDetailsBtn.textContent = "View Details";
    viewDetailsBtn.className = "btn-view";
    viewDetailsBtn.onclick = () => showDetailsPopup(id, data);
    
    // Full View & Edit Button
    const fullViewBtn = document.createElement("button");
    fullViewBtn.textContent = "Full View & Edit";
    fullViewBtn.className = "btn-edit";
    fullViewBtn.onclick = () => {
      const editArea = document.createElement("textarea");
      editArea.value = JSON.stringify(data, null, 2);

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save Changes";
      saveBtn.className = "btn-save";
      saveBtn.onclick = () => {
        try {
          const updated = JSON.parse(editArea.value);
          storedMap[id] = updated;
          localStorage.setItem("amicaCareFormMap", JSON.stringify(storedMap));
          alert("Entry updated successfully!");
          renderEntries();
        } catch (e) {
          alert("Invalid JSON. Please fix the format.");
        }
      };

      entryDiv.appendChild(editArea);
      entryDiv.appendChild(saveBtn);
      fullViewBtn.disabled = true;
    };

    actionsDiv.appendChild(viewDetailsBtn);
    actionsDiv.appendChild(fullViewBtn);
    entryContainer.appendChild(entryDiv);
  });
}

function showDetailsPopup(id, data) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // Create modal header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <h3>Submission Details - ID: ${id}</h3>
    <span class="close-btn">&times;</span>
  `;
  
  // Create modal body with formatted data
  const body = document.createElement('div');
  body.className = 'modal-body';
  
  // Format the data for display
  let htmlContent = '<div class="details-grid">';
  for (const [key, value] of Object.entries(data)) {
    htmlContent += `
      <div class="detail-row">
        <div class="detail-key">${formatKey(key)}:</div>
        <div class="detail-value">${formatValue(value)}</div>
      </div>
    `;
  }
  htmlContent += '</div>';
  body.innerHTML = htmlContent;
  
  // Create modal footer
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  footer.innerHTML = '<button class="btn-close">Close</button>';
  
  // Assemble modal
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  
  // Add to document
  document.body.appendChild(overlay);
  
  // Close handlers
  const closeBtn = header.querySelector('.close-btn');
  const closeFooterBtn = footer.querySelector('.btn-close');
  
  const closeModal = () => document.body.removeChild(overlay);
  
  closeBtn.onclick = closeModal;
  closeFooterBtn.onclick = closeModal;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };
}

// Helper function to format keys for display
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

// Helper function to format values for display
function formatValue(value) {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return value;
}

// Add some basic CSS for the modal
const style = document.createElement('style');
style.textContent = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    margin: 0;
  }
  
  .close-btn {
    font-size: 24px;
    cursor: pointer;
    color: #777;
  }
  
  .modal-body {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
  }
  
  .modal-footer {
    padding: 12px 20px;
    border-top: 1px solid #eee;
    text-align: right;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 12px;
  }
  
  .detail-row {
    display: contents;
  }
  
  .detail-key {
    font-weight: bold;
    color: #555;
  }
  
  .detail-value {
    word-break: break-word;
  }
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
  }
  
  .btn-close, .btn-view, .btn-edit, .btn-save {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .btn-close {
    background: #f0f0f0;
  }
  
  .btn-close:hover {
    background: #e0e0e0;
  }
  
  .btn-view {
    background: #4CAF50;
    color: white;
    margin-right: 8px;
  }
  
  .btn-view:hover {
    background: #45a049;
  }
  
  .btn-edit {
    background: #2196F3;
    color: white;
  }
  
  .btn-edit:hover {
    background: #0b7dda;
  }
  
  .btn-save {
    background: #ff9800;
    color: white;
  }
  
  .btn-save:hover {
    background: #e68a00;
  }
  
  .entry {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 5px;
  }
  
  .entry-actions {
    margin-top: 10px;
  }
  
  textarea {
    width: 100%;
    min-height: 200px;
    margin-top: 10px;
    font-family: monospace;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);

renderEntries();