import "./Hero.css";
import {
  getSummaryFromGeminiAPI,
  getSummaryFromLocalLLM,
  getTranscript,
} from "../services.js";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import {
  appName,
  getPromptWithTranscript,
  chromeStorageKeys,
  llmOptions,
} from "../../../constants/app.js";
import CallToAction from "./CallToAction/CallToAction.jsx";
import SummaryResult from "./SummaryResult/SummaryResult.jsx";

export default function Hero() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [selectedModel, setSelectedModel] = useState("Loading...");

  useEffect(() => {
    chrome.storage.local.get([chromeStorageKeys.llmOption], (result) => {
      if (result.llmOption) {
        const modelName = result.llmOption.split(":")[0].toUpperCase();
        setSelectedModel(modelName);
      } else {
        setSelectedModel("Not chosen yet");
      }
    });
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setSummary(null);

    try {
      let videoId = null;

      if (chrome.tabs && chrome.tabs.query) {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const url = new URL(tab.url);
        videoId = url.searchParams.get("v");
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        videoId = urlParams.get("v");
      }

      if (!videoId) {
        alert("Please open a YouTube video first.");
        setIsAnalyzing(false);
        return;
      }

      let result;
      const settings = await chrome.storage.local.get([
        chromeStorageKeys.llmOption,
        chromeStorageKeys.geminiAPIKey,
      ]);

      setSelectedModel(settings[chromeStorageKeys.llmOption]);

      if (settings[chromeStorageKeys.llmOption] === llmOptions.local) {
        const transcript = await getTranscript(videoId);

        const resultLLM = await getSummaryFromLocalLLM(
          getPromptWithTranscript(transcript),
        );

        if (resultLLM.error) {
          throw new Error(resultLLM.message);
        }

        let rawText = resultLLM.summary || "";
        const cleanedJson = rawText.replace(/```json|```/gi, "").trim();

        result = JSON.parse(cleanedJson);
        console.log("Success:", result);
      } else {
        const { gemini_api_key } = await chrome.storage.local.get(
          chromeStorageKeys.llmOptionGeminiAPI,
        );
        if (!gemini_api_key) {
          throw new Error("API Key not found");
        }

        result = await getSummaryFromGeminiAPI(videoId, gemini_api_key);
      }

      setSummary(result);
    } catch (err) {
      console.error("Analysis Error:", err);
      if (err.message && err.message.includes("API Key not found")) {
        if (confirm("API Key missing. Open Settings?")) {
          chrome.runtime.sendMessage({ action: "OPEN_OPTIONS_PAGE" });
        }
      } else if (
        err.message.includes("This model is currently experiencing high demand")
      ) {
        setSummary({
          error: true,
          message: "This model is currently experiencing high demand",
        });
      } else {
        setSummary({ error: true, message: err.message });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="extension-container">
      <div className="hero-card">
        <header className="hero-header">
          <div className="brand">
            <div className="logo-wrapper">
              <Sparkles size={16} className="logo-icon" />
            </div>
            <h2 className="hero-title">{appName}</h2>
          </div>
          <div className="status-indicator">
            <span className={`status-text ${isAnalyzing ? "analyzing" : ""}`}>
              {isAnalyzing ? "Processing" : "Ready"}
            </span>
            <div className={`status-dot ${isAnalyzing ? "pulse" : ""}`}></div>
          </div>
        </header>

        {!summary ? (
          <CallToAction isActive={isAnalyzing} onClickAction={handleAnalyze} />
        ) : (
          <SummaryResult
            summary={summary}
            onRetry={handleAnalyze}
            setSummary={setSummary}
          />
        )}

        <footer className="future-footer">
          <p>
            Running: <span className="footer-highlight">{selectedModel}</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
