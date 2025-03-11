// Constants
const MILLISECONDS_PER_DAY = 86400000; // 24 hours in milliseconds

// Function to close tabs from yesterday
function closeYesterdayTabs() {
  // Get current date and set to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate yesterday's timestamp (midnight to midnight)
  const yesterdayStart = new Date(today.getTime() - MILLISECONDS_PER_DAY);
  
  chrome.tabs.query({}, (tabs) => {
    const tabsToClose = [];
    
    for (const tab of tabs) {
      // Skip if tab doesn't have lastAccessed info
      if (!tab.lastAccessed) continue;
      
      // Skip pinned tabs
      if (tab.pinned) continue;
      
      // Skip stacked tabs (Vivaldi specific)
      if (tab.groupId !== undefined && tab.groupId !== -1) continue;

      // Check if tab was last accessed yesterday
      const lastAccessed = new Date(tab.lastAccessed);
      if (lastAccessed < today) {
        tabsToClose.push(tab.id);
      }
    }
    
    // Close the tabs
    if (tabsToClose.length > 0) {
      chrome.tabs.remove(tabsToClose);
      
      // Update the count of closed tabs
      chrome.storage.local.get(['totalClosed'], (result) => {
        const currentTotal = result.totalClosed || 0;
        chrome.storage.local.set({ 
          'totalClosed': currentTotal + tabsToClose.length,
          'lastCleaned': new Date().toISOString(),
          'lastCleanedCount': tabsToClose.length
        });
      });
    }
  });
}

// Listen for install or update
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage
  chrome.storage.local.set({
    'enabled': true,
    'totalClosed': 0,
    'lastCleaned': null,
    'lastCleanedCount': 0,
    'autoClean': false
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cleanNow") {
    closeYesterdayTabs();
    sendResponse({success: true});
  } else if (request.action === "getStats") {
    chrome.storage.local.get(['totalClosed', 'lastCleaned', 'lastCleanedCount', 'enabled', 'autoClean'], (data) => {
      sendResponse(data);
    });
    return true; // Required for async sendResponse
  } else if (request.action === "toggleEnabled") {
    chrome.storage.local.set({'enabled': request.enabled});
    sendResponse({success: true});
  } else if (request.action === "toggleAutoClean") {
    chrome.storage.local.set({'autoClean': request.autoClean});
    sendResponse({success: true});
  }
});

// Set up auto-cleaning if enabled
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    // Browser window is focused, run the cleanup check
    chrome.storage.local.get(['enabled', 'autoClean'], (data) => {
      if (data.enabled && data.autoClean) {
        closeYesterdayTabs();
      }
    });
  }
});
