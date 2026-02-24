chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPEN_OPTIONS_PAGE") {
    chrome.runtime.openOptionsPage();
  }
});
