import { Zap } from "lucide-react";

export default function CallToAction({ isActive, onClickAction }) {
  return (
    <div className="dashboard-view">
      <section className="vision-statement">
        <p>
          Transforming YouTube into a personalized learning powerhouse with
          real-time AI processing.
        </p>
      </section>

      <button
        className={`hero-btn ${isActive ? "loading" : ""}`}
        onClick={onClickAction}
        disabled={isActive}
      >
        {isActive ? (
          <>
            <Zap size={16} className="spin" />
            <span>Generating Flashcards...</span>
          </>
        ) : (
          "Analyze & Generate Cards"
        )}
      </button>
    </div>
  );
}
