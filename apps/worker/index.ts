import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "db/client";
import { systemPrompt } from "./systemPropmpt";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/prompt", async (req, res) => {
  const { prompt, projectId } = req.body;

  if (!prompt || !projectId) {
    res.status(400).json({ error: "Missing prompt or projectId" });
    return;
  }

  const genai = new GoogleGenerativeAI(process.env.API_KEY!);
  // const models = await genai();
  // console.log("Available models:", models);
  try {
    // Save user prompt
    await prisma.prompt.create({
      data: {
        content: prompt,
        projectId,
        type: "USER",
      },
    });

    // Get conversation history
    const allPrompts = await prisma.prompt.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    // Initialize AI components
    let artifactProcessor = new ArtifactProcessor(
      "",
      onFileUpdate,
      onShellCommand
    );
    let artifact = "";

    // Convert history to Gemini API format
    const history = allPrompts.map((p) => ({
      role: p.type === "USER" ? "user" : "model",
      parts: [{ text: p.content }],
    }));

    // Initialize model with system instruction
    const model = genai.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }],
      },
    });

    // Generate content stream
    const stream = await model.generateContentStream({
      contents: history,
      generationConfig: {
        maxOutputTokens: 8000, // Correct parameter name
        temperature: 0.9,
        topP: 1,
      },
    });

    // Process response stream
    for await (const chunk of stream.stream) {
      const text = chunk.text();
      artifactProcessor.append(text);
      artifactProcessor.parse();
      artifact += text;
    }

    // Save AI response
    await prisma.prompt.create({
      data: {
        content: artifact,
        projectId,
        type: "SYSTEM",
      },
    });

    res.status(200).json({ success: true, response: artifact });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(9090, () => {
  console.log("Worker running on port 9090");
});
