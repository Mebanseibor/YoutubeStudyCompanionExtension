import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

// Simple Schema for Flashcards
const CardSchema = new mongoose.Schema({
  front: String,
  back: String,
  createdAt: { type: Date, default: Date.now }
});
const Card = mongoose.model('Card', CardSchema);

// Route to save cards
app.post('/api/cards', async (req, res) => {
  try {
    const savedCard = await Card.insertMany(req.body); // req.body would be your cards array
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
