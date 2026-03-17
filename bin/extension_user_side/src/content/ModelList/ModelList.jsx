import { llmOptions } from "../../../constants/app.js";

export default function ModelList({ selectedModel, handleModelChange }) {
  return (
    <div
      className="model-radio-group"
      style={{
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: "8px",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        <input
          type="radio"
          name="model"
          checked={selectedModel === llmOptions.gemini}
          onChange={() => handleModelChange(llmOptions.gemini)}
        />
        Gemini API (Cloud)
      </label>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        <input
          type="radio"
          name="model"
          checked={selectedModel === llmOptions.local}
          onChange={() => handleModelChange(llmOptions.local)}
        />
        Local LLM (Ollama)
      </label>
    </div>
  );
}
