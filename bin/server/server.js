import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { VideoSummarySchema } from "./schemas.js";
import { videoSummaryCollection } from "./collections.js";
import { getTranscript, getVideoDetails } from "./services/youtube.js";
import { callAI } from "./services/ai.js";
import { google } from "googleapis";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection Error:", err));

const VideoSummary = mongoose.model(videoSummaryCollection, VideoSummarySchema);

const youtube = google.youtube("v3");
const googleCloudAPIKey = process.env.GOOGLE_CLOUD_API_KEY;

app.post("/api/cards", async (req, res) => {
  try {
    const { videoId, geminiKey } = req.body;

    const existing = await VideoSummary.findOne({
      "videoDetails.videoId": videoId,
    });
    if (existing) {
      return res.json(existing.cards);
    }

    const transcript = await getTranscript(videoId);
    const aiResult = await callAI(geminiKey, transcript);

    const newEntry = new VideoSummary({
      cards: aiResult,
      videoDetails: await getVideoDetails(youtube, videoId, googleCloudAPIKey),
    });

    await newEntry.save();

    console.log(
      `Processed ${newEntry.videoDetails.videoId}: ${newEntry.videoDetails.title}`,
    );
    res.status(201).json(aiResult);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
