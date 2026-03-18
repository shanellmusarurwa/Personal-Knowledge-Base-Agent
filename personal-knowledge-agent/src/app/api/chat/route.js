// app/api/chat/route.js

import { retrieveContext } from "@/lib/retrieveContext";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

export async function POST(req) {
  try {
    console.log("Chat API called");

    const body = await req.json();
    const { question } = body;

    if (!question) {
      throw new Error("No question provided");
    }

    // Retrieve context from vector DB
    const context = await retrieveContext(question);

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const prompt = `
You are a helpful assistant.

Answer the user's question using the context below.
If the context does not contain the answer, say you don't know.

Context:
${context}

Question:
${question}
`;

    const response = await generateText({
      model: openrouter(process.env.MODEL_NAME),
      prompt: prompt,
    });

    return new Response(
      JSON.stringify({
        answer: response.text,
        context,
      }),
      { status: 200 },
    );
  } catch (err) {
    console.error("CHAT API ERROR:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
