import mongoose from "mongoose";

export const VideoSummarySchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  cards: [
    {
      front: String,
      back: String,
      timestamp: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
