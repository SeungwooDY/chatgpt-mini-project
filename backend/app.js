import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";

// load .env variables
dotenv.config();

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get("/hello-world", (req, res) => {
    res.json({ message: "Server is working" });
});

app.post("/chat", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
            error: "Messages must be an array",
        });
    }

    try {
        console.log("Incoming messages:", messages);

        const messagesWithSystem = [
            {
                role: "system",
                content: "You are a helpful assistant.",
            },
            ...messages,
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messagesWithSystem,
        });

        const aiMessage = response.choices[0].message;

        console.log("AI response:", aiMessage);

        res.status(200).json({
            role: aiMessage.role,
            content: aiMessage.content,
        });
    } catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({
            error: "OpenAI API failed",
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})