"use client";
import { useState, useEffect, useCallback } from "react";

function getSavedChats() {
  return JSON.parse(localStorage.getItem("chats") || "{}");
}

// Helper function to update chat title
function updateChatTitle(chatId, newTitle) {
  const chats = getSavedChats();
  if (chats[chatId]) {
    chats[chatId].title = newTitle;
    localStorage.setItem("chats", JSON.stringify(chats));
    return chats;
  }
  return chats;
}

export default function Sidebar({ chatId, setChatId, setKbId }) {
  const [chats, setChats] = useState({});

  // Initialize chats - runs only once
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
      setTimeout(() => {
        setChats(newChats);
        setChatId(id);
        setKbId(newKbId);
      }, 0);
    } else {
      setTimeout(() => {
        setChats(saved);
        if (!chatId) {
          const firstChatId = Object.keys(saved)[0];
          setChatId(firstChatId);
          const firstKb = Object.keys(
            saved[firstChatId].knowledgeBases || {},
          )[0];
          if (firstKb) setKbId(firstKb);
        }
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const deleteChat = useCallback((id) => {
    setChats((prevChats) => {
      const updated = { ...prevChats };
      delete updated[id];

      localStorage.setItem("chats", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle navigation after chat deletion
  useEffect(() => {
    if (Object.keys(chats).length === 0) {
      // If no chats left, create a new one
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
      setTimeout(() => {
        setChats(newChats);
        setChatId(id);
        setKbId(newKbId);
      }, 0);
    } else if (Object.keys(chats).length > 0 && chatId && !chats[chatId]) {
      // Current chat was deleted, switch to first available
      const firstChatId = Object.keys(chats)[0];
      setTimeout(() => {
        setChatId(firstChatId);
        const firstKb = Object.keys(chats[firstChatId].knowledgeBases || {})[0];
        if (firstKb) setKbId(firstKb);
      }, 0);
    }
  }, [chats, chatId, setChatId, setKbId]);

  const handleChatSelect = useCallback(
    (id) => {
      setChatId(id);
      const firstKb = Object.keys(chats[id]?.knowledgeBases || {})[0];
      if (firstKb) setKbId(firstKb);
    },
    [chats, setChatId, setKbId],
  );

  // Function to manually update chat title (can be called from parent)
  const updateTitle = useCallback((chatId, newTitle) => {
    const updatedChats = updateChatTitle(chatId, newTitle);
    setChats(updatedChats);
  }, []);

  // Expose updateTitle function to parent via ref or context if needed
  useEffect(() => {
    // You can expose this function globally if needed
    if (typeof window !== "undefined") {
      window.updateChatTitle = updateTitle;
    }
  }, [updateTitle]);

  return (
    <div
      style={{
        width: "260px",
        padding: "15px",
        background: "#a7d2c7",
        color: "#fff",
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
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
          marginBottom: "20px",
        }}
      >
        + New Chat
      </button>

      <div style={{ flex: 1 }}>
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
              {chat.title || "New Chat"}
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
