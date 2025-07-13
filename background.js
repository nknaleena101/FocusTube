// background.js
// Manages the persistent toggle state and communicates with content scripts

// Stores the current FocusTube state in Chrome storage
function setFocusTubeState(enabled) {
  chrome.storage.sync.set({ focusTubeEnabled: enabled });
}

// Listens for messages from popup.js to update the state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FOCUSTUBE_TOGGLE') {
    setFocusTubeState(message.enabled);
    // Notify all tabs with content scripts to update their behavior
    chrome.tabs.query({ url: "https://www.youtube.com/*" }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'FOCUSTUBE_STATE_UPDATE',
          enabled: message.enabled
        });
      }
    });
  }
});