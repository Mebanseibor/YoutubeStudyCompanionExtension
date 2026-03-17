export const appName = "YouTube Study Companion";
export const ollamaEndpoint = "http://localhost:11434/api/generate";

const prompt = `
### Task:
Generate educational Flashcards (Question/Answer pairs) from the provided transcript.
Use ONLY the context provided. Do not use outside knowledge.

### Rules:
1. OUTPUT ONLY A VALID JSON ARRAY. NO PROSE.
2. 'front': A concise question about a concept mentioned in the transcript.
3. 'back': A direct, single-sentence answer found in the transcript.
4. 'timestamp': The exact number from the [brackets] where the answer is discussed.
5. If the transcript is just small talk or rambling, RETURN AN EMPTY ARRAY [].

### Example:
Transcript: [12.5s] We use a process called Osmosis to filter the water.
Response: [{"front": "What process is used to filter the water?", "back": "The process used is called Osmosis.", "timestamp": 12.5}]

### Transcript:
`;

export function getPromptWithTranscript(transcript) {
  return `${prompt} ${transcript}`;
}

export const llmOptions = {
  local: "local",
  gemini: "gemini",
};

export const chromeStorageKeys = {
  llmOption: "model_type",
  geminiAPIKey: "gemini_api_key",
};
