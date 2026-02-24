import "./Hero.css";
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
  Check
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
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setSummary(""); 
    try {
      const transcript = await getTranscript();
      const result = await callAI(transcript);
      setSummary(result);
    } catch (err) {
      if (err.message.includes("API Key not found")) {
        if (confirm("API Key missing. Open Settings?")) {
          chrome.runtime.sendMessage({ action: "OPEN_OPTIONS_PAGE" });
        }
      } else {
        console.error("Analysis Error:", err);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
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
                Transforming YouTube into a personalized learning powerhouse with
                real-time AI processing.
              </p>
            </section>

            <div className="stats-row">
              <div className="stat-item">
                <Clock size={14} className="stat-icon" />
                <span className="stat-value">--</span>
                <span className="stat-label">Time Saved</span>
                <div className="tooltip">Coming Soon</div>
              </div>
              <div className="stat-item">
                <Target size={14} className="stat-icon" />
                <span className="stat-value">--</span>
                <span className="stat-label">Mastery</span>
                <div className="tooltip">Coming Soon</div>
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
                  <span>Analyzing...</span>
                </>
              ) : (
                "Analyze Current Video"
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
              <button className="back-link" onClick={() => setSummary("")}>
                <ChevronLeft size={14} /> Back to Dashboard
              </button>
              <button className="copy-icon-btn" onClick={handleCopy}>
                {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
              </button>
            </div>
            
            <div className="summary-wrapper">
              <div className="summary-header-small">
                <Sparkles size={12} color="#818cf8" />
                <span>AI VIDEO SUMMARY</span>
              </div>
              <div className="summary-content">
                {summary}
              </div>
            </div>
          </div>
        )}

        <footer className="future-footer">
          <p>
            <span className="footer-highlight">Next Update:</span>{" "}
            Auto-generated MCQs & Spaced Repetition
          </p>
        </footer>
      </div>
    </div>
  );
}
