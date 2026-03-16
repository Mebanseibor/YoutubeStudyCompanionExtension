import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callAI(geminiKey, transcript) {
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const trimmedTranscipt = transcript.substring(0, 25000);
  console.log(trimmedTranscipt);

  try {
    const prompt = `
      Extract the most important educational concepts from this transcript.
      For each concept, identify the correct timestamp from the [000.00s] markers.

      Return ONLY a valid JSON array. No prose.

      SCHEMA:
      [
        { 
          "front": "The concept name", 
          "back": "The explanation", 
          "timestamp": "The [00.00s] value where this is first mentioned" 
        }
      ]

      TRANSCRIPT:
      ${trimmedTranscipt}`;

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
