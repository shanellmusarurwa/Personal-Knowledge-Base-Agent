// app/api/reindex/route.js
import fs from "fs";
import path from "path";
import { ingestDocument } from "@/lib/ingestDocument";

export async function POST() {
  try {
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      return new Response(
        JSON.stringify({ error: "Uploads folder not found" }),
        { status: 400 },
      );
    }

    const files = fs.readdirSync(uploadsDir);

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const text = fs.readFileSync(filePath, "utf8");
      await ingestDocument(text);
    }

    return new Response(
      JSON.stringify({ message: "Knowledge base re-indexed successfully" }),
      { status: 200 },
    );
  } catch (err) {
    console.error("REINDEX ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
