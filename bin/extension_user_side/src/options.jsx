import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  Save,
  Eye,
  EyeOff,
  Key,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import "./index.css";
import { appName } from "../constants/app.js";

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
      }, 500);
    });
  };

  return (
    <div className="min-h-full w-full bg-slate-50 flex flex-col items-center justify-center p-0 md:p-12 font-sans">
      <div className="w-full h-full md:h-auto md:max-w-4xl bg-white md:rounded-2xl shadow-xl border-slate-200 overflow-hidden flex flex-col">
        <header className="bg-slate-900 p-8 flex items-center gap-4 shrink-0">
          <div className="bg-blue-600 p-3 rounded-lg shadow-inner">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {appName}
            </h1>
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">
              API Configuration
            </p>
          </div>
        </header>

        <main className="p-10 space-y-8 flex-grow flex flex-col justify-center">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-base font-medium text-slate-700">
              <Key size={16} className="text-slate-400" />
              Gemini API Key
            </label>

            <div className="relative group">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-lg text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md transition-colors"
              >
                {showKey ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              Find your key in the{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                className="text-blue-600 hover:underline font-medium"
              >
                Google AI Studio
              </a>
              .
            </p>
          </div>

          <button
            onClick={saveKey}
            disabled={isSaving}
            className={`w-fit self-center flex items-center justify-center gap-3 py-4 px-10 rounded-xl font-bold text-lg text-white transition-all shadow-lg active:scale-[0.99] ${
              isSaving
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {isSaving ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Save size={22} />
            )}
            {isSaving ? "Saving..." : "Save Settings"}
          </button>

          <div className="h-8">
            {status && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 size={20} /> {status}
              </div>
            )}
          </div>
        </main>

        <footer className="px-10 py-6 bg-slate-50 border-t border-slate-100 shrink-0">
          <p className="text-xs text-center text-slate-400 leading-tight">
            Local storage encryption active.
          </p>
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
    </React.StrictMode>,
  );
}
