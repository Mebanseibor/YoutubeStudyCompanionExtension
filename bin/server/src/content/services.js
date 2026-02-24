import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getTranscript() {
  const scripts = Array.from(document.getElementsByTagName("script"));
  const playerScript = scripts.find((s) =>
    s.textContent.includes("ytInitialPlayerResponse"),
  );

  if (!playerScript) throw new Error("YouTube player data not found.");

  // Regex looks for the object starting with { and ending with } before the next variable or script end
  const regex = /var ytInitialPlayerResponse\s*=\s*({.+?});/s;
  const match = playerScript.textContent.match(regex);

  if (!match) {
    // Fallback: YouTube sometimes defines it without the 'var' or in a slightly different format
    const fallbackRegex = /ytInitialPlayerResponse\s*=\s*({.+?});/s;
    const fallbackMatch = playerScript.textContent.match(fallbackRegex);
    if (!fallbackMatch) throw new Error("Could not parse YouTube player data.");
    var data = JSON.parse(fallbackMatch[1]);
  } else {
    var data = JSON.parse(match[1]);
  }

  const track =
    data.captions?.playerCaptionsTracklistRenderer?.captionTracks?.[0];
  if (!track) throw new Error("No transcript available for this video.");

  const resp = await fetch(track.baseUrl);
  const xml = await resp.text();

  return xml
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function callAI(transcript) {
  const { gemini_api_key } = await chrome.storage.local.get("gemini_api_key");
  if (!gemini_api_key) throw new Error("API Key not found.");

  const genAI = new GoogleGenerativeAI(gemini_api_key);

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    const prompt = `Summarize this: ${transcript.substring(0, 20000)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error(error.message || "AI failed");
  }
}
