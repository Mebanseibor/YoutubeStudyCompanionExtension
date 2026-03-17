import React, { useState, useEffect } from "react";
import { Cpu, Cloud, Settings } from "lucide-react";
import { llmOptions, chromeStorageKeys } from "../../../constants/app";

export default function ShortMenu() {
  const [modelType, setModelType] = useState(llmOptions.gemini);

  useEffect(() => {
    chrome.storage.local.get([chromeStorageKeys.llmOption], (result) => {
      if (result[chromeStorageKeys.llmOption]) {
        setModelType(result[chromeStorageKeys.llmOption]);
      }
    });

    const handleStorageChange = (changes) => {
      if (changes[chromeStorageKeys.llmOption]) {
        setModelType(changes[chromeStorageKeys.llmOption].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const updateModel = (type) => {
    setModelType(type);

    chrome.storage.local.set({ [chromeStorageKeys.llmOption]: type });
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="p-4 bg-white font-sans text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Model Selection
        </h2>
        <button
          onClick={openOptions}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 border-none bg-transparent"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => updateModel(llmOptions.gemini)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all bg-transparent ${
            modelType === llmOptions.gemini
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-slate-200 hover:border-slate-300 text-slate-600"
          }`}
        >
          <Cloud size={18} />
          <span className="text-sm font-semibold">Gemini API</span>
          {modelType === llmOptions.gemini && (
            <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => updateModel(llmOptions.local)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all bg-transparent ${
            modelType === llmOptions.local
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-slate-200 hover:border-slate-300 text-slate-600"
          }`}
        >
          <Cpu size={18} />
          <span className="text-sm font-semibold">Local (Ollama)</span>
          {modelType === llmOptions.local && (
            <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      <footer className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[10px] text-center text-slate-400">
          Changes sync automatically
        </p>
      </footer>
    </div>
  );
}
