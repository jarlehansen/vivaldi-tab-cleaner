document.addEventListener('DOMContentLoaded', function() {
  // Get references to UI elements
  const enabledToggle = document.getElementById('enabledToggle');
  const autoCleanToggle = document.getElementById('autoCleanToggle');
  const cleanNowBtn = document.getElementById('cleanNowBtn');
  const totalClosedEl = document.getElementById('totalClosed');
  const lastCleanedEl = document.getElementById('lastCleaned');
  const lastCleanedCountEl = document.getElementById('lastCleanedCount');
  
  // Load current settings and stats
  chrome.runtime.sendMessage({action: "getStats"}, function(response) {
    if (response) {
      totalClosedEl.textContent = response.totalClosed || 0;
      
      if (response.lastCleaned) {
        const lastCleanedDate = new Date(response.lastCleaned);
        lastCleanedEl.textContent = lastCleanedDate.toLocaleString();
      } else {
        lastCleanedEl.textContent = "Never";
      }
      
      lastCleanedCountEl.textContent = response.lastCleanedCount || 0;
      
      enabledToggle.checked = response.enabled !== false;
      autoCleanToggle.checked = response.autoClean === true;
    }
  });
  
  // Set up event listeners
  enabledToggle.addEventListener('change', function() {
    chrome.runtime.sendMessage({
      action: "toggleEnabled", 
      enabled: enabledToggle.checked
    });
  });
  
  autoCleanToggle.addEventListener('change', function() {
    chrome.runtime.sendMessage({
      action: "toggleAutoClean", 
      autoClean: autoCleanToggle.checked
    });
  });
  
  cleanNowBtn.addEventListener('click', function() {
    cleanNowBtn.disabled = true;
    cleanNowBtn.textContent = "Cleaning...";
    
    chrome.runtime.sendMessage({action: "cleanNow"}, function(response) {
      setTimeout(function() {
        // Refresh stats
        chrome.runtime.sendMessage({action: "getStats"}, function(response) {
          if (response) {
            totalClosedEl.textContent = response.totalClosed || 0;
            
            if (response.lastCleaned) {
              const lastCleanedDate = new Date(response.lastCleaned);
              lastCleanedEl.textContent = lastCleanedDate.toLocaleString();
            }
            
            lastCleanedCountEl.textContent = response.lastCleanedCount || 0;
          }
          
          cleanNowBtn.disabled = false;
          cleanNowBtn.textContent = "Clean Yesterday's Tabs Now";
        });
      }, 500);
    });
  });
});