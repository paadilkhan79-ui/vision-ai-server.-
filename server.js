const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/", (req, res) => {
  res.send("VISION AI Server Online");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const result = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: message }]
        })
      }
    );

    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("VISION AI ready");
});
