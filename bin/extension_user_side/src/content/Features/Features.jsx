import "./Features.css";

import {
  BrainCircuit,
  Database,
  FileText,
} from "lucide-react";

const FEATURES = [
  {
    icon: <FileText size={18} color="#818cf8" />,
    label: "AI Summary",
    desc: "Concise video overviews",
  },
  {
    icon: <BrainCircuit size={18} color="#f472b6" />,
    label: "Quiz Mode",
    desc: "Auto-generated MCQs",
  },
  {
    icon: <Layers size={18} color="#fbbf24" />,
    label: "Flashcards",
    desc: "Active recall & SR",
  },
  {
    icon: <Database size={18} color="#22c55e" />,
    label: "Local First",
    desc: "Private offline storage",
  },
];

export default function Features() {
  return (
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
  );
}
