import { useState } from "react";
import {
  Layers,
  ChevronLeft,
  Copy,
  Check,
  RotateCcw,
  AlertOctagon,
} from "lucide-react";

import FlashCard from "../../FlashCard/FlashCard.jsx";

export default function SummaryResult({ summary, onRetry, setSummary }) {
  const [copied, setCopied] = useState(false);

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
    <div className="result-view">
      <div className="result-actions">
        <button className="back-link" onClick={() => setSummary(null)}>
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
        {Array.isArray(summary) && (
          <button className="copy-icon-btn" onClick={handleCopy}>
            {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
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
              <button onClick={onRetry} className="retry-btn">
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
