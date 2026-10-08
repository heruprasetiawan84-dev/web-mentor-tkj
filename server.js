require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Mengarahkan server untuk membaca file HTML di folder 'public'
app.use(express.static('public')); 

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Kamu adalah 'Mentor MikroTik', senior lulusan SMK jurusan TKJ. Jawablah setiap pertanyaan seputar jaringan dan MikroTik secara santai, berikan panduan Winbox dan CLI, dan jangan berikan jawaban instan, melainkan pandu siswa untuk berpikir. Gunakan analogi yang mudah dipahami.", 
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const result = await model.generateContent(userMessage);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Waduh, servernya lagi gangguan nih bang. Coba lagi nanti ya!" });
  }
});

// Render akan otomatis memberikan PORT, jika tidak ada pakai 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Mentor MikroTik berjalan di port ${PORT}`);
});