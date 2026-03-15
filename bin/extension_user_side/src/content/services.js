import { serverCardsEndpoint } from "../../constants/server.js";

export async function getSummary(videoId, geminiKey) {
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
