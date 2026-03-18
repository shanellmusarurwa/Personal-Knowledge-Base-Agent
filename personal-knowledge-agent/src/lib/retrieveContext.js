import { embed } from "./embed";
import { getTable } from "./vectordb";

export async function retrieveContext(question) {
  const table = await getTable();

  const vector = await embed(question);

  const results = await table.search(vector).limit(5);

  const context = results.map((r) => r.text).join("\n");

  return context;
}
