import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

export async function getVectorStore(chatId) {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: "text-embedding-3-small",
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
  });

  // ✅ ONLY CONNECT (no creation here)
  return await Chroma.fromExistingCollection(embeddings, {
    collectionName: `chat-${chatId}`,
    url: "http://localhost:8000",
  });
}
