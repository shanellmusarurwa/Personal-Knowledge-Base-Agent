"use client";
import { useState, useEffect, useRef } from "react";

export default function UploadDocuments({ chatId, kbId }) {
  const [files, setFiles] = useState([]);
  const isInitialLoad = useRef(true);

  // ✅ LOAD saved files for specific chat and knowledge base
  useEffect(() => {
    if (typeof window !== "undefined" && chatId && kbId) {
      const saved = localStorage.getItem(`uploadedFiles_${chatId}_${kbId}`);
      if (saved) {
        // Use setTimeout to move setState out of the effect's synchronous flow
        setTimeout(() => {
          setFiles(JSON.parse(saved));
        }, 0);
      } else {
        setTimeout(() => {
          setFiles([]);
        }, 0);
      }
    }
  }, [chatId, kbId]);

  // ✅ SAVE files whenever they change to specific chat/kb
  useEffect(() => {
    if (chatId && kbId && !isInitialLoad.current) {
      localStorage.setItem(
        `uploadedFiles_${chatId}_${kbId}`,
        JSON.stringify(files),
      );
    }
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [files, chatId, kbId]);

  const upload = async (file) => {
    if (!chatId || !kbId) {
      alert("Please select a knowledge base first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chatId);
    formData.append("kbId", kbId);

    setFiles((prev) => [...prev, { name: file.name, status: "Uploading..." }]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Invalid JSON response");
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "Error" } : f,
          ),
        );
        return;
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, status: data.success ? "Completed" : "Error" }
            : f,
        ),
      );
    } catch (err) {
      console.error("Upload error:", err);
      setFiles((prev) =>
        prev.map((f) => (f.name === file.name ? { ...f, status: "Error" } : f)),
      );
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    selected.forEach(upload);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    dropped.forEach(upload);
  };

  const deleteFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  // Show message if no knowledge base selected
  if (!chatId || !kbId) {
    return (
      <div className="upload-wrapper">
        <div className="upload-card">
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            ⚠️ Please select a knowledge base to upload files
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-wrapper">
      <div className="upload-card">
        {/* LEFT SIDE */}
        <div
          className="upload-box"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="upload-icon">☁️</div>

          <p className="drag-text">Drag and drop files here</p>

          <p className="or">- OR -</p>

          <label className="upload-btn">
            Browse Files
            <input
              type="file"
              multiple
              hidden
              onChange={handleFileChange}
              accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
            />
          </label>
        </div>

        {/* RIGHT SIDE */}
        <div className="uploaded-files">
          <h3 style={{ color: "black" }}>Uploaded Files</h3>

          {files.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
              No files uploaded yet
            </p>
          ) : (
            files.map((file, i) => (
              <div key={i} className="file-item">
                <span className="file-name">{file.name}</span>
                <span className="file-status">{file.status}</span>

                <button
                  onClick={() => deleteFile(i)}
                  style={{
                    marginLeft: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
