import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callAI(geminiKey, transcript) {
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    const prompt = `
      Extract the most important educational concepts from this transcript.
      For each concept, identify the correct timestamp from the [000.00s] markers.
      Ignore message from a sponsor

      Return ONLY a valid JSON array. No prose.

      SCHEMA:
        [
          { 
            "front": "Term", 
            "back": "Definition", 
            "timestamp": 123.45 
          }
        ]
        NOTE: The timestamp must be a NUMBER representing seconds. Do not include 's' or brackets.

      TRANSCRIPT:
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
