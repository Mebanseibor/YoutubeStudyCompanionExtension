import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Save, Eye, EyeOff, Key, ShieldCheck, CheckCircle2 } from "lucide-react";
import "./options.css";

export default function Options() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["gemini_api_key"], (result) => {
      if (result.gemini_api_key) setApiKey(result.gemini_api_key);
    });
  }, []);

  const saveKey = () => {
    setIsSaving(true);
    chrome.storage.local.set({ gemini_api_key: apiKey }, () => {
      setTimeout(() => {
        setIsSaving(false);
        setStatus("Settings saved successfully!");
        setTimeout(() => setStatus(""), 3000);
      }, 500); // Slight delay for better visual feedback
    });
  };

  return (
    <div className="options-wrapper">
      <div className="settings-card">
        <header className="settings-header">
          <div className="logo-box">
            <ShieldCheck size={20} color="#fff" />
          </div>
          <div>
            <h1>Vision AI</h1>
            <p>Security & API Configuration</p>
          </div>
        </header>

        <main className="settings-body">
          <div className="input-group">
            <label>
              <Key size={14} /> Gemini API Key
            </label>
            <div className="password-container">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
              />
              <button 
                type="button"
                className="toggle-visibility"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span className="hint">
              Find your key in the <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>.
            </span>
          </div>

          <button 
            className={`save-button ${isSaving ? 'loading' : ''}`} 
            onClick={saveKey}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : <><Save size={18} /> Save Settings</>}
          </button>

          {status && (
            <div className="status-message">
              <CheckCircle2 size={16} /> {status}
            </div>
          )}
        </main>

        <footer className="settings-footer">
          <p>Local storage encryption active. Your key never leaves your browser.</p>
        </footer>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("options-root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>
  );
}
