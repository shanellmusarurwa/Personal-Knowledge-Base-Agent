import { embed } from "./embed";
import { searchDB } from "./vectordb";

export async function retrieveContext(question) {
  const vector = await embed(question);

  const results = await searchDB(vector, 5);

  return results.map((r) => r.text).join("\n");
}
