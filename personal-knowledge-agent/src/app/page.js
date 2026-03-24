"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import UploadDocuments from "@/components/UploadDocuments";
import Sidebar from "@/components/Sidebar";
import "./upload.css";

export default function Home() {
  const [chatId, setChatId] = useState(null);
  const [kbId, setKbId] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  // Run tests function
  const runTests = async () => {
    if (!chatId || !kbId) {
      alert("Please select a chat and knowledge base first");
      return;
    }

    setIsTesting(true);
    setTestResults([]);

    const testQuestions = [
      "What happens if I get locked out of my bank account?",
      "How can I view my recent transactions?",
      "What are the fees and interest rates for personal loans?",
      "How do I report a lost or stolen card and what are the fees?",
      "What are the different account types available and their fees?",
    ];

    console.log("Starting tests...");

    const results = [];

    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      console.log(`\nTesting ${i + 1}/${testQuestions.length}: ${question}`);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            chatId: chatId,
            kbId: kbId,
            history: [],
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log(`Response: ${data.answer.substring(0, 200)}...`);
          console.log(
            `Sources: ${data.sources.map((s) => s.name || s).join(", ")}`,
          );

          results.push({
            question: question,
            answer: data.answer,
            sources: data.sources,
            success: true,
          });
        } else {
          console.log(`Error: ${data.error}`);
          results.push({
            question: question,
            answer: `Error: ${data.error}`,
            sources: [],
            success: false,
          });
        }
      } catch (err) {
        console.error(`Error testing question: ${question}`, err);
        results.push({
          question: question,
          answer: `Error: ${err.message}`,
          sources: [],
          success: false,
        });
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setTestResults(results);
    setIsTesting(false);
    console.log("\nTests completed!");

    // Show summary in console
    const passed = results.filter((r) => r.success).length;
    console.log(`\n📊 Test Summary: ${passed}/${results.length} passed`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* 📂 SIDEBAR */}
      <Sidebar chatId={chatId} setChatId={setChatId} setKbId={setKbId} />

      {/* 👉 MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
        }}
      >
        {/* 🧠 HEADER */}
        <div
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid #eee",
            fontWeight: "600",
            color: "#000",
          }}
        >
          RAG AI Assistant
        </div>

        {/* 📭 EMPTY STATE */}
        {!chatId ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontSize: "18px",
            }}
          >
            Start a new chat 👈
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 📤 Upload stays ABOVE chat */}
            <div
              style={{
                padding: "10px 20px",
                borderBottom: "1px solid #eee",
                background: "#fff",
              }}
            >
              <UploadDocuments chatId={chatId} kbId={kbId} />
            </div>

            {/* 💬 Chat (handles input internally) */}
            <div style={{ flex: 1 }}>
              <ChatInterface chatId={chatId} kbId={kbId} setKbId={setKbId} />
            </div>
          </div>
        )}
      </div>

      {/* Test Results Modal */}
      {testResults.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "80%",
              maxWidth: "800px",
              maxHeight: "80vh",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, color: "#333" }}>
                Test Results ({testResults.filter((r) => r.success).length}/
                {testResults.length} Passed)
              </h2>
              <button
                onClick={() => setTestResults([])}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "20px",
                    padding: "15px",
                    backgroundColor: result.success ? "#f0f9f0" : "#fee",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${result.success ? "#4caf50" : "#f44336"}`,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      color: "#333",
                    }}
                  >
                    {idx + 1}. {result.question}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>Response:</strong> {result.answer.substring(0, 300)}
                    ...
                  </div>
                  {result.sources && result.sources.length > 0 && (
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      <strong>Sources:</strong>{" "}
                      {result.sources.map((s) => s.name || s).join(", ")}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      color: result.success ? "#4caf50" : "#f44336",
                    }}
                  >
                    Status: {result.success ? "✅ Passed" : "❌ Failed"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Button */}
      <button
        onClick={runTests}
        disabled={isTesting || !chatId || !kbId}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "12px 24px",
          backgroundColor: isTesting ? "#ccc" : "#3e8e7e",
          color: "white",
          border: "none",
          borderRadius: "25px",
          cursor: isTesting || !chatId || !kbId ? "not-allowed" : "pointer",
          fontWeight: "bold",
          zIndex: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          opacity: isTesting || !chatId || !kbId ? 0.6 : 1,
        }}
      >
        {isTesting ? "Running Tests..." : "🧪 Run Tests"}
      </button>
    </div>
  );
}
