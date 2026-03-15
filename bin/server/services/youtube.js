import { fetchTranscript } from "youtube-transcript-plus";

export async function getTranscript(videoId) {
  try {
    const response = await fetchTranscript(videoId, { lang: "en" });

    // This solves the "(intermediate value).map is not a function" error
    const data = Array.isArray(response) ? response : response.transcript || [];

    if (data.length === 0) {
      throw new Error("No transcript data found for this video.");
    }

    const cleanText = data
      .map((entry) => {
        const text = entry && entry.text ? entry.text : "";
        return text
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/^>>\s*/, "");
      })
      .filter((text) => text.length > 0)
      .join(" ");

    return cleanText;
  } catch (err) {
    console.error("Transcript Service Error:", err);
    throw err;
  }
}
