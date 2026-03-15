import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { VideoSummarySchema } from "./schemas.js";
import { videoSummaryCollection } from "./collections.js";
import { getTranscript } from "./services/youtube.js"
import { callAI } from "./services/ai.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection Error:", err));

const VideoSummary = mongoose.model(videoSummaryCollection, VideoSummarySchema);

app.post("/api/cards", async (req, res) => {
  try {
    const { videoId, geminiKey } = req.body;

    const existing = await VideoSummary.findOne({ videoId });
    if (existing) {
      return res.json(existing.cards);
    }

    const transcript = await getTranscript(videoId);
    const aiResult = await callAI(geminiKey, transcript);

    const newEntry = new VideoSummary({
      videoId: videoId,
      cards: aiResult,
    });

    await newEntry.save();

    res.status(201).json(aiResult);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
