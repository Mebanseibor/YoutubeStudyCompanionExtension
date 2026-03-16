import { Clock } from "lucide-react";
import React, { useState } from "react";

export default function FlashCard({
  question,
  answer,
  timestamp,
  onJumpToTime,
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleReveal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRevealed(!isRevealed);
  };

  const handleTimestampClick = (e) => {
    e.stopPropagation();
    if (onJumpToTime) onJumpToTime(timestamp);
  };

  return (
    <>
      <style>{`
        .fc-container {
          background: #ffffff !important;
          border: 2px solid #4f46e5 !important;
          border-radius: 12px !important;
          padding: 16px !important;
          margin-bottom: 15px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          cursor: pointer !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          display: block !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }

        .fc-header-row {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important; 
          margin-bottom: 14px !important;
          padding-bottom: 2px !important;
        }

        .fc-timestamp {
          display: inline-flex !important;
          align-items: center !important;
          background: #eef2ff !important;
          color: #4f46e5 !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          padding: 4px 10px !important;
          border-radius: 6px !important;
          border: 1px solid #c7d2fe !important;
          transition: all 0.2s ease !important;
          cursor: pointer !important;
        }

        .fc-timestamp {
          display: inline-flex !important;
          align-items: center !important;
          background: #f5f3ff !important; 
          color: #4f46e5 !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          padding: 4px 10px !important;
          border-radius: 20px !important; 
          border: 1px solid #ddd6fe !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
        }

        .fc-timestamp:hover {
          background: #4f46e5 !important;
          color: #ffffff !important;
          transform: translateY(-1px) !important; 
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2) !important;
        }

        .fc-timestamp:active {
          transform: translateY(0px) !important;
        }

        .fc-section {
          display: block !important;
          width: 100% !important;
        }

        .fc-label {
          display: block !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #6366f1 !important; 
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important; 
        }

        .fc-text {
          display: block !important;
          font-size: 16px !important;
          color: #1f2937 !important;
          margin: 0 0 10px 0 !important;
          line-height: 1.5 !important;
          white-space: pre-wrap !important;
        }

        .fc-answer-box {
          margin-top: 12px !important;
          padding-top: 12px !important;
          border-top: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
          border-radius: 0 0 8px 8px !important;
        }

        .fc-hint {
          font-size: 11px !important;
          color: #9ca3af !important;
          text-align: right !important;
          margin-top: 5px !important;
        }
      `}</style>

      <div className="fc-container" onClick={toggleReveal}>
        <div className="fc-header-row">
          <span className="fc-label">Question</span>
          {timestamp && (
            <div className="fc-timestamp" onClick={handleTimestampClick}>
              <Clock
                size={12}
                strokeWidth={2.5}
                style={{ marginRight: "6px" }}
              />
              <span>{formatTime(timestamp)}</span>
            </div>
          )}
        </div>

        <div className="fc-section">
          <p className="fc-text" style={{ fontWeight: "600" }}>
            {question}
          </p>
        </div>

        {isRevealed ? (
          <div className="fc-section fc-answer-box">
            <span className="fc-label" style={{ color: "#059669" }}>
              Answer
            </span>
            <p className="fc-text">{answer}</p>
          </div>
        ) : (
          <div className="fc-hint">Click to reveal answer</div>
        )}
      </div>
    </>
  );
}
