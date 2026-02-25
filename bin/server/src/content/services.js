import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchTranscript } from 'youtube-transcript-plus';

export async function getTranscript(videoId) {
  try {
    // 1. Await the response
    const response = await fetchTranscript(videoId, { lang: 'en' });
    
    // 2. Force it into a standard array format
    // This solves the "(intermediate value).map is not a function" error
    const data = Array.isArray(response) ? response : (response.transcript || []);

    if (data.length === 0) {
      throw new Error("No transcript data found for this video.");
    }

    // 3. Process the array
    const cleanText = data
      .map(entry => {
        // Double check entry exists and has text property
        const text = entry && entry.text ? entry.text : "";
        return text
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/^>>\s*/, '');
      })
      .filter(text => text.length > 0) // Remove empty strings
      .join(' ');

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

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash" 
  });

  try {
    const prompt = `Summarize this YouTube transcript into clean, direct text. 
    Do not use any markdown formatting like asterisks (**), bolding, or headers. 
    Use simple line breaks and dashes for bullet points.
    
    Transcript: ${transcript.substring(0, 25000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up any accidental markdown the AI might still include
    return text.replace(/[*#_]/g, '').trim();
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("AI Processing failed. Check console for details.");
  }
}

export async function listAvailableModels() {
  const { gemini_api_key } = await chrome.storage.local.get("gemini_api_key");
  if (!gemini_api_key) return console.error("No API Key found to list models.");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${gemini_api_key}`
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
