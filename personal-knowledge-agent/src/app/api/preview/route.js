import { NextResponse } from "next/server";
import { CloudClient } from "chromadb";

const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("file");
    const chatId = searchParams.get("chatId");
    const kbId = searchParams.get("kbId");

    if (!filename || !chatId || !kbId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const collectionName = `chat-${chatId}-kb-${kbId}`;
    const collection = await chromaClient.getCollection({
      name: collectionName,
    });

    // Query for documents with this filename
    const results = await collection.get({
      where: { source: filename },
    });

    if (!results.documents || results.documents.length === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    // Return the document content for preview
    const fullText = results.documents.join("\n\n...\n\n");

    return NextResponse.json({
      success: true,
      filename,
      content: fullText.slice(0, 5000), // Limit preview length
      chunks: results.documents.length,
    });
  } catch (err) {
    console.error("PREVIEW ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
