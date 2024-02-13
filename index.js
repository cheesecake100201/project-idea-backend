const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const openai = require("openai");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const openAI = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(bodyParser.json());

app.post("/categoryImage", async (req, res) => {
  try {
    const { idea } = req.body;
    const response = await openAI.images.generate({
      model: "dall-e-2",
      prompt: idea,
    });
    console.log(response.data);
    res.status(200).json({ success: true, image: response["data"][0]["url"] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
});

app.post("/productList", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Generate a product list along with very short 2 or 3 points about the product.",
        },
        { role: "user", content: prompt },
      ],
    });
    console.log(response["choices"][0]["message"]["content"]);
    res.status(200).json({ success: true, response: response["choices"][0]["message"]["content"] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
