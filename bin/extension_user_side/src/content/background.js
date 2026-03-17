chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPEN_OPTIONS_PAGE") {
    chrome.runtime.openOptionsPage();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "OLLAMA_REQUEST") {
    (async () => {
      try {
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: request.model || "qwen2.5:1.5b",
            prompt: request.prompt,
            stream: false,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          sendResponse({ error: true, message: `Ollama error: ${text}` });
        } else {
          const data = await response.json();
          sendResponse({ error: false, summary: data.response });
        }
      } catch (err) {
        sendResponse({ error: true, message: "Ollama connection failed." });
      }
    })();
    return true;
  }
});
