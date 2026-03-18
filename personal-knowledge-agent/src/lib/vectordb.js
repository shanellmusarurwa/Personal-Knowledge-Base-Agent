// lib/vectordb.js

let store = [];

export async function addToDB(items) {
  for (const item of items) {
    store.push(item);
  }
}

export async function searchDB(queryVector, topK = 5) {
  // simple cosine similarity
  function cosine(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
  }

  const scored = store.map((item) => ({
    ...item,
    score: cosine(queryVector, item.vector),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
