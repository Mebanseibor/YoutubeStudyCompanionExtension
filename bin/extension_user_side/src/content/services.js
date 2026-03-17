import { serverCardsEndpoint } from "../../constants/server.js";
import { fetchTranscript } from "youtube-transcript-plus";

export async function getSummaryFromGeminiAPI(videoId, geminiKey) {
  try {
    const response = await fetch(serverCardsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId: videoId,
        geminiKey: geminiKey,
      }),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: true, message: error.message };
  }
}

export async function getSummaryFromLocalLLM(prompt) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "OLLAMA_REQUEST",
        model: "phi3.5:3.8b-mini-instruct-q4_K_M",
        prompt: prompt,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          resolve({ error: true, message: chrome.runtime.lastError.message });
        } else {
          resolve(response);
        }
      },
    );
  });
}

export async function getTranscript(videoId) {
  try {
    const response = await fetchTranscript(videoId, { lang: "en" });
    const data = Array.isArray(response) ? response : response.transcript || [];

    if (data.length === 0) throw new Error("No transcript data found.");

    const transcriptWithTimestamps = data
      .map((entry) => {
        const text = (entry.text || "")
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .replace(/^>>\s*/, "");

        return `[${entry.offset}s] ${text}`;
      })
      .filter((line) => line.length > 5)
      .join("\n");

    return transcriptWithTimestamps;
  } catch (err) {
    console.error("Transcript Service Error:", err);
    throw err;
  }
}
