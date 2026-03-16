import { fetchTranscript } from "youtube-transcript-plus";
import { formatVideoDetails } from "../schemas.js";

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

export async function getVideoDetails(youtube, videoId, apiKey) {
  try {
    const response = await youtube.videos.list({
      key: apiKey,
      part: 'snippet,statistics',
      id: videoId
    });

    const video = response.data.items[0];
    if (!video) throw new Error("Video not found");

    return formatVideoDetails(video);
  } catch (error) {
    console.error("API Error:", error);
  }
}
