import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callAI(geminiKey, transcript) {
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const prompt = `
    Extract the most important educational concepts from this transcript and format them as flashcards.
    Return ONLY a valid JSON array of objects. No prose, no markdown, no backticks.

    SCHEMA:
    [
      { "front": "A clear, concise question or term", "back": "A brief, factual answer" }
    ]

    EXAMPLE:
    [
      { "front": "Photosynthesis", "back": "The process by which plants use sunlight to synthesize foods from carbon dioxide and water." }
    ]

    TRANSCRIPT:
    ${transcript.substring(0, 25000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // CLEANING THE STRING
    // 1. Remove Markdown code blocks if present (```json ... ```)
    const cleanedJson = text.replace(/```json|```/gi, "").trim();

    // 2. Parse the JSON
    const flashcards = JSON.parse(cleanedJson);

    return flashcards; // This is now an Array of objects
  } catch (error) {
    console.error("Flashcard Deserialization Error:", error);
    // Fallback: If JSON parsing fails, return a friendly error in card format
    throw new Error(`AI_PROCESSING_FAILED: ${error.message}`);
  }
}
