import { embed } from "@/lib/embed";
import { searchDB } from "@/lib/vectordb";

export async function retrieveContext(question) {
  try {
    console.log("💬 Question:", question);

    // 🔥 Create embedding for question
    const queryVector = await embed(question);

    // 🔥 Search your in-memory DB
    const results = await searchDB(queryVector, 5);

    console.log("🔎 Raw search results:", results);

    // 🔥 Build context
    const context = results.map((r) => r.text).join("\n");

    console.log("📄 Final Context:", context);

    return context;
  } catch (err) {
    console.error("❌ RETRIEVE ERROR:", err);
    return "";
  }
}
