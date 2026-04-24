const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

router.use(cors({ origin: '*' }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/skinbot_query', async (req, res) => {
  const userMessage = req.body.message?.trim();
  if (!userMessage) return res.json({ reply: "Please type a message to continue 🌸" });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are SkinBot, a skincare assistant. 
- Keep answers **short, precise, and structured**.
- Use numbered lists for steps.
- No Markdown symbols like ** or _.
- Replace sub-bullets with simple dashes (-) and emojis where useful.
- Focus only on skincare, acne, products, and ingredients.
- Make it friendly and readable.`
        },
        { role: "user", content: userMessage }
      ],
      temperature: 0.5,
      max_tokens: 250,
    });

    let botReply = response.choices[0].message.content.trim();

    // Clean extra Markdown if any
    botReply = botReply.replace(/\*\*/g, '');  // remove **
    botReply = botReply.replace(/_/g, '');     // remove _
    botReply = botReply.replace(/\n/g, '<br>'); // preserve line breaks for HTML

    res.json({ reply: botReply });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ reply: "⚠️ Sorry, I'm having trouble responding right now." });
  }
});

module.exports = router;
