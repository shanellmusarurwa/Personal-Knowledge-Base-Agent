// lib/embed.js

import { pipeline } from "@xenova/transformers";

let extractor = null;

export async function embed(text) {
  try {
    if (!extractor) {
      extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        {
          progress_callback: () => {}, // prevents logging issues
        },
      );
    }

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (err) {
    console.error("EMBED ERROR:", err);

    // 🔥 fallback to prevent app crash
    return Array(384).fill(0);
  }
}
