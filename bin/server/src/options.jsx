import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

export default function Options() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");

  // Load existing key on mount
  useEffect(() => {
    chrome.storage.local.get(["gemini_api_key"], (result) => {
      if (result.gemini_api_key) setApiKey(result.gemini_api_key);
    });
  }, []);

  const saveKey = () => {
    chrome.storage.local.set({ gemini_api_key: apiKey }, () => {
      setStatus("Key saved successfully!");
      setTimeout(() => setStatus(""), 2000);
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Vision AI Settings</h1>
      <label>Gemini API Key:</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "100%", margin: "10px 0", padding: "8px" }}
      />
      <button
        onClick={saveKey}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        Save Settings
      </button>
      {status && <p style={{ color: "green" }}>{status}</p>}
    </div>
  );
}

const rootElement = document.getElementById("options-root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>,
  );
}
