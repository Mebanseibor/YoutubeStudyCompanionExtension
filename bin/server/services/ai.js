import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callAI(geminiKey, transcript) {
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    const prompt = `
### Task:
Generate high-quality educational flashcards (Question/Answer pairs) based ONLY on the provided transcript. 

### Rules:
1. OUTPUT ONLY A VALID JSON ARRAY. NO PREAMBLE. NO PROSE.
2. 'front': A clear, concise question about a concept or fact from the transcript.
3. 'back': A direct, accurate answer based strictly on the transcript context.
4. 'timestamp': The exact NUMBER (seconds only) from the [brackets] where the answer starts.
5. If a section is a sponsor or rambling (e.g., "uh", "hello"), SKIP IT.
6. If no educational content is found, return an empty array [].

### Example:
Transcript: [45.20s] Photosynthesis is how plants turn sunlight into energy.
Response: [{"front": "How do plants convert sunlight into energy?", "back": "Through a process called photosynthesis.", "timestamp": 45.20}]

### Transcript:
${transcript}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    const cleanedJson = text.replace(/```json|```/gi, "").trim();

    const flashcards = JSON.parse(cleanedJson);

    return flashcards;
  } catch (error) {
    console.error("Flashcard Deserialization Error:", error);

    throw new Error(`AI_PROCESSING_FAILED: ${error.message}`);
  }
}
