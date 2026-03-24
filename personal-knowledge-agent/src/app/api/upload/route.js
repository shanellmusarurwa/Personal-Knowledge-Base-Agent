import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CloudClient } from "chromadb";

const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const chatId = formData.get("chatId");
    const kbId = formData.get("kbId"); // Add kbId support

    if (!file || !chatId || !kbId) {
      return NextResponse.json(
        { error: "Missing file, chatId, or kbId" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";
    let fileType = file.type;

    // Handle different file types
    if (fileType === "application/pdf") {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (fileType === "text/markdown" || fileType === "text/plain") {
      text = buffer.toString("utf-8");
    } else {
      // Try to parse as text for other formats
      text = buffer.toString("utf-8");
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Empty document" }, { status: 400 });
    }

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const docs = await splitter.createDocuments([text]);

    // Create collection specific to chat and knowledge base
    const collectionName = `chat-${chatId}-kb-${kbId}`;
    const collection = await chromaClient.getOrCreateCollection({
      name: collectionName,
    });

    // Prepare data with better metadata
    const timestamp = Date.now();
    const ids = docs.map((_, i) => `${chatId}-${kbId}-${timestamp}-${i}`);
    const documents = docs.map((d) => d.pageContent);
    const metadatas = docs.map(() => ({
      source: file.name,
      chatId,
      kbId,
      fileType,
      uploadedAt: new Date().toISOString(),
      chunkSize: docs.length,
    }));

    // Store in Chroma Cloud
    await collection.add({
      ids,
      documents,
      metadatas,
    });

    // Store file metadata in localStorage or database
    // This is a simple approach - in production, use a database
    const fileMetadata = {
      name: file.name,
      type: fileType,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
      chunks: docs.length,
    };

    return NextResponse.json({
      success: true,
      file: fileMetadata,
      chunks: docs.length,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed", success: false },
      { status: 500 },
    );
  }
}
