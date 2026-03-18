"use client";
import { useState, useEffect } from "react";

export default function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // 📜 Load history
  useEffect(() => {
    const saved = localStorage.getItem("lastAnswer");
    if (saved) setAnswer(saved);
  }, []);

  // 📜 Save history
  useEffect(() => {
    if (answer) {
      localStorage.setItem("lastAnswer", answer);
    }
  }, [answer]);

  // ✨ Typing effect
  function typeEffect(text) {
    let i = 0;
    let current = "";

    const interval = setInterval(() => {
      current += text[i];
      i++;

      setAnswer(current);

      if (i >= text.length) clearInterval(interval);
    }, 15);
  }

  async function ask() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    setAnswer(""); // clear first

    // 🧠 simulate streaming via typing
    typeEffect(data.answer || "No response");
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ color: "black" }}>Ask Question</h2>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something..."
        style={{
          padding: "10px",
          borderRadius: "50px",
          width: "300px",
          marginRight: "10px",
          color: "black",
        }}
      />

      <button
        onClick={ask}
        style={{
          padding: "10px 25px",
          borderRadius: "50px",
          background: "#3e8e7e",
          color: "white",
          border: "none",
        }}
      >
        Ask
      </button>

      {/* 🧠 Answer */}
      <p style={{ marginTop: "20px", color: "black", whiteSpace: "pre-wrap" }}>
        {answer}
      </p>
    </div>
  );
}
