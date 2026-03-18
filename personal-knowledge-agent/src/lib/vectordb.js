import * as lancedb from "@lancedb/lancedb";

let db = null;
let table = null;

export async function getTable() {
  if (!db) {
    db = await lancedb.connect("./data");
  }

  if (!table) {
    try {
      table = await db.openTable("documents");
    } catch (err) {
      table = await db.createTable("documents", [
        {
          vector: Array(384).fill(0),
          text: "",
        },
      ]);
    }
  }

  return table;
}
