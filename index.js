const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use(express.static('public'))

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

const upload = multer({ dest: 'uploads/' });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." })
  }

  try {
    const result = await model.generateContent(message);
    const response = result.response;
    res.json({ reply: response.text() })
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
})

app.listen(PORT, () => {
  console.log(`Gemini API server is running at http://localhost:${PORT}`)
})