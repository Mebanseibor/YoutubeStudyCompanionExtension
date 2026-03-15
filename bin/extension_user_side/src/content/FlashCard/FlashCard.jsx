import React, { useState } from "react";

export default function FlashCard({ question, answer }) {
  const [isRevealed, setIsRevealed] = useState(false);

  // We use a simple toggle function
  const toggleReveal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRevealed(!isRevealed);
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

        .fc-section {
          display: block !important;
          width: 100% !important;
        }

        .fc-label {
          display: block !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          color: #4f46e5 !important;
          margin-bottom: 4px !important;
          text-transform: uppercase !important;
        }

        .fc-text {
          display: block !important;
          font-size: 16px !important;
          color: #1f2937 !important;
          margin: 0 0 10px 0 !important;
          line-height: 1.5 !important;
          white-space: pre-wrap !important; /* Preserves line breaks */
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
        {/* QUESTION ALWAYS VISIBLE */}
        <div className="fc-section">
          <span className="fc-label">Question</span>
          <p className="fc-text" style={{ fontWeight: "600" }}>
            {question}
          </p>
        </div>

        {/* ANSWER - Conditionallly Rendered */}
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
