"use client";
import { useState, useEffect, useRef } from "react";

function loadMessages(chatId, kbId) {
  if (typeof window === "undefined") return [];

  const chats = JSON.parse(localStorage.getItem("chats") || "{}");
  const chat = chats[chatId];

  console.log("Loading messages for:", { chatId, kbId });
  console.log("Found chat:", chat);

  if (chat && chat.knowledgeBases && chat.knowledgeBases[kbId]) {
    const messages = chat.knowledgeBases[kbId].messages || [];
    console.log("Loaded messages:", messages.length);
    return messages;
  }

  return [];
}

// Save chat function with proper title handling
const saveChat = (chatId, kbId, userMsg, aiResponse) => {
  console.log("Saving chat:", { chatId, kbId, userMsg, aiResponse });

  const chats = JSON.parse(localStorage.getItem("chats") || "{}");
  console.log("Existing chats:", Object.keys(chats));

  if (!chats[chatId]) {
    chats[chatId] = {
      title: "New Chat",
      knowledgeBases: {},
      createdAt: Date.now(),
    };
    console.log("Created new chat:", chatId);
  }

  if (!chats[chatId].knowledgeBases[kbId]) {
    chats[chatId].knowledgeBases[kbId] = {
      title: "Knowledge Base",
      messages: [],
      documents: [],
    };
    console.log("Created new knowledge base:", kbId);
  }

  // Get existing messages
  const existingMessages = chats[chatId].knowledgeBases[kbId].messages || [];
  console.log("Existing messages count:", existingMessages.length);

  // Add new messages
  const updatedMessages = [...existingMessages, userMsg, aiResponse];

  console.log("Updated messages count:", updatedMessages.length);

  chats[chatId].knowledgeBases[kbId].messages = updatedMessages;

  // Update chat title based on first user message
  if (chats[chatId].title === "New Chat" && userMsg.content) {
    chats[chatId].title = userMsg.content.slice(0, 30);
    console.log("Updated chat title to:", chats[chatId].title);
  }

  localStorage.setItem("chats", JSON.stringify(chats));
  console.log("Chat saved successfully!");

  // Trigger storage event to update sidebar
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }

  return chats;
};

export default function ChatInterface({ chatId, kbId, setKbId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const bottomRef = useRef(null);

  // Load knowledge bases for this chat
  useEffect(() => {
    if (chatId) {
      const chats = JSON.parse(localStorage.getItem("chats") || "{}");
      const chat = chats[chatId];
      if (chat && chat.knowledgeBases) {
        setKnowledgeBases(Object.keys(chat.knowledgeBases));
      }
    }
  }, [chatId]);

  // Load messages when kbId changes
  useEffect(() => {
    if (chatId && kbId) {
      const loadedMessages = loadMessages(chatId, kbId);
      console.log("Setting messages:", loadedMessages.length);
      setMessages(loadedMessages);
    }
  }, [chatId, kbId]);

  // Listen for storage changes to update messages
  useEffect(() => {
    const handleStorageChange = () => {
      if (chatId && kbId) {
        console.log("Storage event detected, reloading messages...");
        const updatedMessages = loadMessages(chatId, kbId);
        setMessages(updatedMessages);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [chatId, kbId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function ask() {
    if (!question.trim() || loading || !kbId) return;

    const userMsg = { role: "user", content: question };
    console.log("User message:", userMsg);

    setLoading(true);
    const currentQuestion = question;
    setQuestion("");

    // Add user message instantly
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Convert messages to proper format for API (change "ai" to "assistant")
      const formattedHistory = messages.map((msg) => ({
        role: msg.role === "ai" ? "assistant" : msg.role,
        content: msg.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentQuestion,
          chatId,
          kbId,
          history: formattedHistory,
        }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (!data.success) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add empty AI message for streaming
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "",
          sources: data.sources || [],
          document: data.document || "Unknown document",
        },
      ]);

      // Streaming effect
      const words = data.answer.split(" ");
      let current = "";

      for (let i = 0; i < words.length; i++) {
        await new Promise((res) => setTimeout(res, 25));
        current += words[i] + " ";

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: current,
            };
          }
          return updated;
        });
      }

      // Create final AI response object
      const aiResponse = {
        role: "ai",
        content: current,
        sources: data.sources || [],
        document: data.document || "Unknown document",
      };

      console.log("AI Response:", aiResponse);

      // Save chat using the saveChat function
      saveChat(chatId, kbId, userMsg, aiResponse);

      console.log("Chat saved successfully!");
    } catch (err) {
      console.error("Error in ask function:", err);

      const errorMsg = {
        role: "ai",
        content: `❌ Error: ${err.message}`,
      };

      setMessages((prev) => [...prev, errorMsg]);

      // Save error message too
      const userMsgForError = { role: "user", content: currentQuestion };
      saveChat(chatId, kbId, userMsgForError, errorMsg);
    }

    setLoading(false);
  }

  return (
    <div className="flex h-full bg-[#a7d2c7] text-white">
      <div className="flex flex-col flex-1">
        {knowledgeBases.length > 0 && (
          <div className="p-3 bg-[#0c725e] border-b border-gray-700">
            <select
              value={kbId || ""}
              onChange={(e) => setKbId(e.target.value)}
              className="w-full p-2 rounded bg-[#3e8e7e] text-white outline-none"
            >
              <option value="">Select Knowledge Base</option>
              {knowledgeBases.map((kb) => (
                <option key={kb} value={kb}>
                  KB: {kb.slice(0, 8)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-300 mt-10">
              {kbId
                ? "Ask a question about your documents!"
                : "Select a knowledge base to start"}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  msg.role === "user" ? "bg-[#3e8e7e]" : "bg-[#2e6e62]"
                }`}
              >
                <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {msg.content}
                </div>

                {msg.document && msg.role === "ai" && (
                  <div className="mt-2 text-xs text-yellow-300">
                    📄 From: {msg.document}
                  </div>
                )}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs text-gray-300">
                    📚 Sources:
                    {msg.sources.map((s, idx) => (
                      <div key={idx}>
                        •{" "}
                        <button
                          onClick={() => setPreviewDoc(s.url || s)}
                          className="text-blue-400 underline"
                        >
                          View Source
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder={
                kbId
                  ? "Ask your documents..."
                  : "Select a knowledge base first..."
              }
              disabled={!kbId}
              className="flex-1 p-3 rounded-4xl bg-[#0c725e] outline-none disabled:opacity-50"
            />

            <button
              onClick={ask}
              disabled={loading || !kbId}
              className="px-5 py-2 bg-[#3e8e7e] rounded-4xl disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="p-2 text-sm text-gray-400">🤖 Thinking...</div>
        )}
      </div>

      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white w-[80%] h-[80%] rounded-lg overflow-hidden">
            <button
              onClick={() => setPreviewDoc(null)}
              className="p-2 bg-red-500 text-white"
            >
              Close
            </button>
            <iframe src={previewDoc} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
