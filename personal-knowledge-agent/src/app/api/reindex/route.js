import { NextResponse } from "next/server";
import { CloudClient } from "chromadb";

const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

export async function POST(req) {
  try {
    const { chatId, kbId } = await req.json();

    if (!chatId || !kbId) {
      return NextResponse.json(
        { error: "Missing chatId or kbId" },
        { status: 400 },
      );
    }

    const collectionName = `chat-${chatId}-kb-${kbId}`;

    // Check if collection exists
    let collection;
    try {
      collection = await chromaClient.getCollection({ name: collectionName });
    } catch (err) {
      return NextResponse.json(
        { error: "Knowledge base not found", success: false },
        { status: 404 },
      );
    }

    // Get all documents in the collection
    const allDocs = await collection.get();

    if (!allDocs.ids || allDocs.ids.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No documents to reindex",
        documentsReindexed: 0,
      });
    }

    // Reindex by re-adding all documents with the same IDs
    // This effectively refreshes the embeddings
    await collection.add({
      ids: allDocs.ids,
      documents: allDocs.documents,
      metadatas: allDocs.metadatas,
    });

    return NextResponse.json({
      success: true,
      message: "Knowledge base reindexed successfully",
      documentsReindexed: allDocs.ids.length,
      collection: collectionName,
    });
  } catch (err) {
    console.error("REINDEX ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Reindex failed", success: false },
      { status: 500 },
    );
  }
}
