import mongoose from "mongoose";

export const VideoSummarySchema = new mongoose.Schema({
  videoDetails: {
    title: String,
    creator: String,
    publishedAt: Date,
    thumbnail: String,
    videoId: String,
  },

  cards: [
    {
      front: String,
      back: String,
      timestamp: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const formatVideoDetails = (video) => ({
  title: video.snippet.title,
  creator: video.snippet.channelTitle,
  publishedAt: video.snippet.publishedAt,
  thumbnail:
    video.snippet.thumbnails.maxres?.url ||
    video.snippet.thumbnails.high?.url ||
    video.snippet.thumbnails.default?.url,
  videoId: video.id,
});
