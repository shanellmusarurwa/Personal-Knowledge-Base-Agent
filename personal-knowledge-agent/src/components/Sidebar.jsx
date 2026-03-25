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
      setTimeout(() => {
        setChats(() => newChats);
        setChatId(id);
        setKbId(newKbId);
      }, 0);
    } else {
      setTimeout(() => {
        setChats(() => saved);
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

  const deleteChat = useCallback(
    (id) => {
      setChats((prevChats) => {
        const updated = { ...prevChats };

        // Also delete associated uploaded files from localStorage
        const chatToDelete = updated[id];
        if (chatToDelete && chatToDelete.knowledgeBases) {
          Object.keys(chatToDelete.knowledgeBases).forEach((kbId) => {
            localStorage.removeItem(`uploadedFiles_${id}_${kbId}`);
          });
        }

        delete updated[id];
        localStorage.setItem("chats", JSON.stringify(updated));

        const first = Object.keys(updated)[0];
        if (first) {
          setTimeout(() => {
            setChatId(first);
            const firstKb = Object.keys(updated[first].knowledgeBases || {})[0];
            if (firstKb) setKbId(firstKb);
          }, 0);
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

      // Dispatch storage event to notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    },
    [chats, setChatId, setKbId],
  );

  // Function to create a new knowledge base within current chat
  const newKnowledgeBase = useCallback(() => {
    if (!chatId) return;

    const newKbId = "kb_" + Date.now();
    setChats((prevChats) => {
      // Make a deep copy of the chats
      const updated = { ...prevChats };

      // Check if the chat exists and has the knowledgeBases property
      if (!updated[chatId]) {
        // If chat doesn't exist, create it
        updated[chatId] = {
          title: "New Chat",
          createdAt: Date.now(),
          knowledgeBases: {},
        };
      }

      // Ensure knowledgeBases exists
      if (!updated[chatId].knowledgeBases) {
        updated[chatId].knowledgeBases = {};
      }

      // Add the new knowledge base
      updated[chatId].knowledgeBases[newKbId] = {
        title: `Knowledge Base ${Object.keys(updated[chatId].knowledgeBases).length + 1}`,
        messages: [],
        documents: [],
        createdAt: Date.now(),
      };

      localStorage.setItem("chats", JSON.stringify(updated));
      return updated;
    });

    setKbId(newKbId);
  }, [chatId, setKbId]);

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
          marginBottom: "10px",
        }}
      >
        + New Chat
      </button>

      {chatId && (
        <button
          onClick={newKnowledgeBase}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "500px",
            background: "#2e6e62",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "12px",
          }}
        >
          + New Knowledge Base
        </button>
      )}

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", opacity: 0.8 }}>
          Your Chats ({Object.keys(chats).length})
        </h4>
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

            <small style={{ color: "#cbd5f5", fontSize: "10px" }}>
              {new Date(chat.createdAt).toLocaleDateString()} •
              {chat.knowledgeBases
                ? Object.keys(chat.knowledgeBases).length
                : 0}{" "}
              KBs
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

            {/* Show knowledge bases in this chat */}
            {chatId === id && chat.knowledgeBases && (
              <div style={{ marginTop: "8px", paddingLeft: "10px" }}>
                {Object.entries(chat.knowledgeBases).map(([kbId, kb]) => (
                  <div
                    key={kbId}
                    onClick={(e) => {
                      e.stopPropagation();
                      setKbId(kbId);
                    }}
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      marginTop: "4px",
                      borderRadius: "6px",
                      background:
                        chatId === id && kbId === chatId
                          ? "#3e8e7e"
                          : "#2e6e62",
                      cursor: "pointer",
                      opacity: 0.9,
                    }}
                  >
                    📚 {kb.title} • {kb.documents?.length || 0} docs
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
