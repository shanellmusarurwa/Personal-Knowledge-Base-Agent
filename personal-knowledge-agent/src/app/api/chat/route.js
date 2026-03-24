import { NextResponse } from "next/server";
import { CloudClient } from "chromadb";

const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

export async function POST(req) {
  try {
    const { message, chatId, kbId, history } = await req.json();

    if (!message || !chatId || !kbId) {
      return NextResponse.json(
        { error: "Missing message, chatId, or kbId", success: false },
        { status: 400 },
      );
    }

    // Get API key from environment
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const MODEL_NAME = process.env.MODEL_NAME || "openai/gpt-3.5-turbo";

    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is missing");
      return NextResponse.json(
        {
          error: "API key not configured. Please check your .env file.",
          success: false,
        },
        { status: 500 },
      );
    }

    // Use the specific knowledge base collection
    const collectionName = `chat-${chatId}-kb-${kbId}`;

    let collection;
    let context = "";
    let sources = [];

    try {
      collection = await chromaClient.getCollection({ name: collectionName });

      // Query relevant documents
      const results = await collection.query({
        queryTexts: [message],
        nResults: 5,
      });

      const documents = results.documents?.[0] || [];
      const metadatas = results.metadatas?.[0] || [];

      context = documents.join("\n\n");
      sources = [...new Set(metadatas.map((m) => m.source))];
    } catch (err) {
      console.log("No collection found or error querying:", err.message);
      // Continue without context if no documents
    }

    //  update the messages formatting
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant. ${context ? `Use this context to answer: ${context}` : "No documents are available yet. Tell the user to upload documents first."}`,
            },
            ...(history || []).filter((msg) => msg.role !== "system"), // Make sure no duplicate system messages
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return NextResponse.json(
        {
          error: data.error?.message || "Failed to get response from AI",
          success: false,
        },
        { status: response.status },
      );
    }

    const answer =
      data.choices?.[0]?.message?.content || "No response generated";

    return NextResponse.json({
      success: true,
      answer: answer,
      sources: sources.map((s) => ({ name: s, url: s })),
      document: sources[0] || "No documents",
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Ask failed", success: false },
      { status: 500 },
    );
  }
}
