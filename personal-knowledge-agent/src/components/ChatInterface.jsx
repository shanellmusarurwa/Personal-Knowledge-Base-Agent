"use client";
import { useState } from "react";

export default function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function ask() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    setAnswer(data.answer);
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Ask Question</h2>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something..."
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button
        onClick={ask}
        style={{
          padding: "10px 25px",
          borderRadius: "50px", // pill shape
          background: "#3e8e7e",
          color: "white",
          border: "none",
        }}
      >
        Ask
      </button>

      <p style={{ marginTop: "20px" }}>{answer}</p>
    </div>
  );
}
