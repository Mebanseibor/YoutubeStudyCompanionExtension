import "./Hero.css";
import FlashCard from "../FlashCard/FlashCard.jsx";
import { getTranscript, callAI } from "../services.js";
import { useState } from "react";
import {
  FileText,
  MapPin,
  Layers,
  BarChart3,
  Sparkles,
  Zap,
  Clock,
  Target,
  ChevronLeft,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";

const FEATURES = [
  {
    icon: <FileText size={18} color="#818cf8" />,
    label: "AI Summary",
    desc: "Concise video overviews",
  },
  {
    icon: <MapPin size={18} color="#f472b6" />,
    label: "Timestamps",
    desc: "Auto-topic segmentation",
  },
  {
    icon: <Layers size={18} color="#fbbf24" />,
    label: "Flashcards",
    desc: "Spaced repetition ready",
  },
  {
    icon: <BarChart3 size={18} color="#22c55e" />,
    label: "Insights",
    desc: "Productivity tracking",
  },
];

export default function Hero() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setSummary(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get("v");

      if (!videoId) {
        alert("Please open a YouTube video first.");
        setIsAnalyzing(false);
        return;
      }

      // 1. Fetch transcript string
      const transcript = await getTranscript(videoId);

      // 2. Fetch and deserialize JSON flashcards
      const result = await callAI(transcript);
      setSummary(result);
    } catch (err) {
      console.error("Analysis Error:", err);
      if (err.message && err.message.includes("API Key not found")) {
        if (confirm("API Key missing. Open Settings?")) {
          chrome.runtime.sendMessage({ action: "OPEN_OPTIONS_PAGE" });
        }
      } else {
        setSummary({ error: true, message: err.message });
      }
    } finally {
      setIsAnalyzing(false);
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
            <h2 className="hero-title">YouTube Study Companion</h2>
            <span className="hero-badge">Pro</span>
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

            <div className="stats-row">
              <div className="stat-item">
                <Clock size={14} className="stat-icon" />
                <span className="stat-value">--</span>
                <span className="stat-label">Time Saved</span>
              </div>
              <div className="stat-item">
                <Target size={14} className="stat-icon" />
                <span className="stat-value">--</span>
                <span className="stat-label">Mastery</span>
              </div>
            </div>

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

            <div className="feature-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-item">
                  <div className="icon-container">{f.icon}</div>
                  <div>
                    <p className="feature-label">{f.label}</p>
                    <p className="feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
                    <p>{summary.message || "Something went wrong."}</p>
                    <button onClick={handleAnalyze} className="retry-btn">
                      <RotateCcw size={14} /> Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <footer className="future-footer">
          <p>
            <span className="footer-highlight">2026 Edition:</span> Running on
            Gemini 2.5 Flash
          </p>
        </footer>
      </div>
    </div>
  );
}
