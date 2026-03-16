import { fetchTranscript } from "youtube-transcript-plus";

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
