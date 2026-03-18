// app/api/upload/route.js

import * as pdfParse from "pdf-parse";
import { embed } from "@/lib/embed";
import { getTable } from "@/lib/vectordb";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert uploaded file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse PDF
    const pdf = await pdfParse.default(buffer);

    const text = pdf.text;

    // Split text into chunks
    const chunks = text.match(/(.|[\r\n]){1,500}/g) || [];

    const table = await getTable();

    for (const chunk of chunks) {
      const vector = await embed(chunk);

      await table.add([
        {
          vector: vector,
          text: chunk,
        },
      ]);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
