"use client";
import { useState, useEffect, useCallback } from "react";

function getSavedChats() {
  return JSON.parse(localStorage.getItem("chats") || "{}");
}

export default function Sidebar({ chatId, setChatId, setKbId }) {
  const [chats, setChats] = useState({});

  // Initialize chats - runs only once on mount
  useEffect(() => {
    const saved = getSavedChats();

    if (Object.keys(saved).length === 0) {
      const id = "chat_" + Date.now();
      const newKbId = "kb_" + Date.now();

      const newChats = {
        [id]: {
          title: "New Chat",
          createdAt: Date.now(),
          knowledgeBases: {
            [newKbId]: {
              title: "My Knowledge Base",
              messages: [],
              documents: [],
              createdAt: Date.now(),
            },
          },
        },
      };

      localStorage.setItem("chats", JSON.stringify(newChats));
      // Use functional update to avoid setState in effect warning
      setChats(() => newChats);
      setChatId(id);
      setKbId(newKbId);
    } else {
      setChats(() => saved);
      if (!chatId) {
        const firstChatId = Object.keys(saved)[0];
        setChatId(firstChatId);
        const firstKb = Object.keys(saved[firstChatId].knowledgeBases || {})[0];
        if (firstKb) setKbId(firstKb);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  const newChat = useCallback(() => {
    const id = "chat_" + Date.now();
    const newKbId = "kb_" + Date.now();

    setChats((prevChats) => {
      const updated = {
        ...prevChats,
        [id]: {
          title: "New Chat",
          createdAt: Date.now(),
          knowledgeBases: {
            [newKbId]: {
              title: "My Knowledge Base",
              messages: [],
              documents: [],
              createdAt: Date.now(),
            },
          },
        },
      };

      localStorage.setItem("chats", JSON.stringify(updated));
      return updated;
    });

    setChatId(id);
    setKbId(newKbId);
  }, [setChatId, setKbId]);

  const deleteChat = useCallback(
    (id) => {
      setChats((prevChats) => {
        const updated = { ...prevChats };
        delete updated[id];

        localStorage.setItem("chats", JSON.stringify(updated));

        const first = Object.keys(updated)[0];
        if (first) {
          setChatId(first);
          const firstKb = Object.keys(updated[first].knowledgeBases || {})[0];
          if (firstKb) setKbId(firstKb);
        }

        return updated;
      });
    },
    [setChatId, setKbId],
  );

  const handleChatSelect = useCallback(
    (id) => {
      setChatId(id);
      const firstKb = Object.keys(chats[id]?.knowledgeBases || {})[0];
      if (firstKb) setKbId(firstKb);
    },
    [chats, setChatId, setKbId],
  );

  return (
    <div
      style={{
        width: "260px",
        padding: "15px",
        background: "#a7d2c7",
        color: "#fff",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <button
        onClick={newChat}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "500px",
          background: "#3e8e7e",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        + New Chat
      </button>

      <div style={{ marginTop: "20px" }}>
        {Object.entries(chats).map(([id, chat]) => (
          <div
            key={id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: chatId === id ? "#1e293b" : "transparent",
              cursor: "pointer",
            }}
          >
            <div
              onClick={() => handleChatSelect(id)}
              style={{ color: "#fff", fontWeight: "500" }}
            >
              {chat.title}
            </div>

            <small style={{ color: "#cbd5f5" }}>
              {new Date(chat.createdAt).toLocaleDateString()}
            </small>

            <button
              onClick={() => deleteChat(id)}
              style={{
                float: "right",
                color: "#f87171",
                cursor: "pointer",
                background: "none",
                border: "none",
                fontSize: "14px",
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
