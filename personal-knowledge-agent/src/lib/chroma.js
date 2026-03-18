import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  path: "./chroma-data",
});

export async function getCollection() {
  return await client.getOrCreateCollection({
    name: "knowledge-base",
  });
}
