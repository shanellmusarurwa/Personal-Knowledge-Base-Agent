import { chunkText } from "./chunkText";
import { createEmbedding } from "./embeddings";
import { getCollection } from "./chroma";
import { v4 as uuid } from "uuid";

export async function ingestDocument(text) {
  const chunks = chunkText(text);
  const collection = await getCollection();

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    await collection.add({
      ids: [uuid()],
      documents: [chunk],
      embeddings: [embedding],
    });
  }
}
