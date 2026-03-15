import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchTranscript } from "youtube-transcript-plus";

export async function getTranscript(videoId) {
  try {
    // 1. Await the response
    const response = await fetchTranscript(videoId, { lang: "en" });

    // 2. Force it into a standard array format
    // This solves the "(intermediate value).map is not a function" error
    const data = Array.isArray(response) ? response : response.transcript || [];

    if (data.length === 0) {
      throw new Error("No transcript data found for this video.");
    }

    // 3. Process the array
    const cleanText = data
      .map((entry) => {
        // Double check entry exists and has text property
        const text = entry && entry.text ? entry.text : "";
        return text
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/^>>\s*/, "");
      })
      .filter((text) => text.length > 0) // Remove empty strings
      .join(" ");

    return cleanText;
  } catch (err) {
    console.error("Transcript Service Error:", err);
    throw err; // Throw the actual error so Hero.jsx can catch it
  }
}

export async function callAI(transcript) {
  const { gemini_api_key } = await chrome.storage.local.get("gemini_api_key");
  if (!gemini_api_key) throw new Error("API Key not found.");

  const genAI = new GoogleGenerativeAI(gemini_api_key);
  // Using the 2.5-flash model we confirmed earlier
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
    return [
      {
        front: "Error",
        back: "The AI output was not in a valid JSON format. Try again.",
      },
    ];
  }
}

export async function listAvailableModels() {
  const { gemini_api_key } = await chrome.storage.local.get("gemini_api_key");
  if (!gemini_api_key) return console.error("No API Key found to list models.");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${gemini_api_key}`,
    );
    const data = await response.json();

    console.log("--- AVAILABLE MODELS ---");
    data.models.forEach((m) => {
      console.log(`Name: ${m.name} | Methods: ${m.supportedGenerationMethods}`);
    });
    console.log("------------------------");

    return data.models;
  } catch (error) {
    console.error("Error listing models:", error);
  }
}
