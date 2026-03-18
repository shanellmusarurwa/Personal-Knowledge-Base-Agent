"use client";
import { useState } from "react";

export default function UploadDocuments() {
  const [files, setFiles] = useState([]);

  const upload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setFiles((prev) => [
      ...prev,
      { name: file.name, status: data.success ? "Completed" : "Error" },
    ]);
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
            <input type="file" multiple hidden onChange={handleFileChange} />
          </label>
        </div>

        {/* RIGHT SIDE */}
        <div className="uploaded-files">
          <h3>Uploaded Files</h3>

          {files.map((file, i) => (
            <div key={i} className="file-item">
              <span className="file-name">{file.name}</span>
              <span className="file-status">{file.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
