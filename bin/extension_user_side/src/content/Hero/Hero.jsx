import "./Hero.css";
import FlashCard from "../FlashCard/FlashCard.jsx";
import {
  getSummaryFromGeminiAPI,
  getSummaryFromLocalLLM,
  getTranscript,
} from "../services.js";
import { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  Zap,
  ChevronLeft,
  Copy,
  Check,
  RotateCcw,
  AlertOctagon,
} from "lucide-react";
import {
  appName,
  getPromptWithTranscript,
  chromeStorageKeys,
  llmOptions,
} from "../../../constants/app.js";

export default function Hero() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Loading...");

  useEffect(() => {
    chrome.storage.local.get([chromeStorageKeys.llmOption], (result) => {
      if (result.llmOption) {
        const modelName = result.llmOption.split(':')[0].toUpperCase();
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
      ])

      setSelectedModel(settings[chromeStorageKeys.llmOption])

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

  const handleJumpToTime = async (seconds) => {
    if (chrome.scripting) {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (time) => {
          const video = document.querySelector("video");
          if (video) {
            video.currentTime = time;
            video.play();
          }
        },
        args: [seconds],
      });
    } else {
      const video = document.querySelector("video");
      if (video) {
        video.currentTime = seconds;
        video.play();
      }
    }
  };

  const handleCopy = () => {
    if (!Array.isArray(summary)) return;
    const textToCopy = summary
      .map((c) => `Q: ${c.front}\nA: ${c.back}`)
      .join("\n\n");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="dashboard-view">
            <section className="vision-statement">
              <p>
                Transforming YouTube into a personalized learning powerhouse
                with real-time AI processing.
              </p>
            </section>

            <button
              className={`hero-btn ${isAnalyzing ? "loading" : ""}`}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Zap size={16} className="spin" />
                  <span>Generating Flashcards...</span>
                </>
              ) : (
                "Analyze & Generate Cards"
              )}
            </button>

          </div>
        ) : (
          <div className="result-view">
            <div className="result-actions">
              <button className="back-link" onClick={() => setSummary(null)}>
                <ChevronLeft size={14} /> Back to Dashboard
              </button>
              {Array.isArray(summary) && (
                <button className="copy-icon-btn" onClick={handleCopy}>
                  {copied ? (
                    <Check size={14} color="#22c55e" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              )}
            </div>

            <div className="summary-wrapper">
              <div className="summary-header-small">
                <Layers size={12} color="#818cf8" />
                <span>STUDY DECK</span>
              </div>

              <div className="summary-content">
                {Array.isArray(summary) ? (
                  <div className="flashcards-list">
                    {summary.length > 0 ? (
                      summary.map((card, index) => (
                        <FlashCard
                          key={index}
                          question={card.front}
                          answer={card.back}
                          timestamp={card.timestamp}
                          onJumpToTime={handleJumpToTime}
                        />
                      ))
                    ) : (
                      <p className="empty-msg">
                        No flashcards could be generated from this video.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="error-box">
                    <div className="error-icon-wrapper">
                      <AlertOctagon size={32} />
                    </div>
                    <div className="error-text-content">
                      <h3>Analysis Interrupted</h3>
                      <p>
                        {summary.message ||
                          "The local model took too long to respond or the connection was lost."}
                      </p>
                    </div>
                    <button onClick={handleAnalyze} className="retry-btn">
                      <RotateCcw size={16} />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <footer className="future-footer">
          <p>
             Running: <span className="footer-highlight">{ selectedModel }</span></p>
        </footer>
      </div>
    </div>
  );
}
