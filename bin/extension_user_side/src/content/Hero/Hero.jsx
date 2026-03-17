import "./Hero.css";
import {
  getSummaryFromGeminiAPI,
  getSummaryFromLocalLLM,
  getTranscript,
} from "../services.js";
import { useState, useEffect } from "react";
import { Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import {
  appName,
  getPromptWithTranscript,
  chromeStorageKeys,
  llmOptions,
} from "../../../constants/app.js";
import CallToAction from "./CallToAction/CallToAction.jsx";
import SummaryResult from "./SummaryResult/SummaryResult.jsx";
import ModelList from "../ModelList/ModelList.jsx";

export default function Hero() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [selectedModel, setSelectedModel] = useState("Loading...");
  const [isModelListOpen, setIsModelListOpen] = useState(false);

  useEffect(() => {
    chrome.storage.local.get([chromeStorageKeys.llmOption], (result) => {
      if (result[chromeStorageKeys.llmOption]) {
        setSelectedModel(result[chromeStorageKeys.llmOption]);
      } else {
        setSelectedModel(llmOptions.gemini);
      }
    });
  }, []);

  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    chrome.storage.local.set({ [chromeStorageKeys.llmOption]: newModel });
  };

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

      const currentModel =
        settings[chromeStorageKeys.llmOption] || llmOptions.gemini;
      setSelectedModel(currentModel);

      if (currentModel === llmOptions.local) {
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
        const geminiKey = settings[chromeStorageKeys.geminiAPIKey];
        if (!geminiKey) {
          throw new Error("API Key not found");
        }

        result = await getSummaryFromGeminiAPI(videoId, geminiKey);
      }

      setSummary(result);
    } catch (err) {
      console.error("Analysis Error:", err);
      if (err.message && err.message.includes("API Key not found")) {
        if (confirm("API Key missing. Open Settings?")) {
          chrome.runtime.openOptionsPage();
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

        {!summary && (
          <footer className="future-footer">
            <div
              className="model-selector-trigger"
              onClick={() => setIsModelListOpen(!isModelListOpen)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "24px 0px",
              }}
            >
              <p style={{ margin: 0 }}>
                Using model:{" "}
                <span className="footer-highlight">
                  {(selectedModel || "gemini").toUpperCase()}
                </span>
              </p>

              {isModelListOpen ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </div>

            {isModelListOpen && (
              <ModelList
                selectedModel={selectedModel}
                handleModelChange={handleModelChange}
              />
            )}
          </footer>
        )}
        {!summary ? (
          <CallToAction isActive={isAnalyzing} onClickAction={handleAnalyze} />
        ) : (
          <SummaryResult
            summary={summary}
            onRetry={handleAnalyze}
            setSummary={setSummary}
          />
        )}
      </div>
    </div>
  );
}
