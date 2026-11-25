require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "Vision AI Server is live 🚀",
    endpoints: {
      chat: "POST /v1/chat/completions"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return res.status(500).json({
        error: {
          message: "OPENROUTER_API_KEY is not set on the server",
          type: "server_error"
        }
      });
    }

    const model = req.body.model || "google/gemini-2.0-flash-001";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "https://vision-ai-server.onrender.com",
        "X-Title": "Vision AI Server"
      },
      body: JSON.stringify({
        ...req.body,
        model: model
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        type: "server_error"
      }
    });
  }
});

app.get("/v1/models", (req, res) => {
  res.json({
    object: "list",
    data: [
      {
        id: "google/gemini-2.0-flash-001",
        object: "model",
        owned_by: "google"
      },
      {
        id: "google/gemini-flash-1.5",
        object: "model",
        owned_by: "google"
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Vision AI Server running on port ${PORT}`);
});
