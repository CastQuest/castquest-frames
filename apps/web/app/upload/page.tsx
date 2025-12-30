"use client";

import { useState } from "react";

export default function UploadPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ticker, setTicker] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const submit = async () => {
    await fetch("/api/media", {
      method: "POST",
      body: JSON.stringify({ name, description, ticker, imageUrl })
    });

    alert("Uploaded!");
    setName("");
    setDescription("");
    setTicker("");
    setImageUrl("");
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Upload Media</h1>

      <div style={{ marginTop: "1rem" }}>
        <label>Name</label>
        <input
          style={{ width: "100%", padding: "8px" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Description</label>
        <textarea
          style={{ width: "100%", padding: "8px" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Ticker</label>
        <input
          style={{ width: "100%", padding: "8px" }}
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Image URL</label>
        <input
          style={{ width: "100%", padding: "8px" }}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <button
        onClick={submit}
        style={{
          marginTop: "1.5rem",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          borderRadius: "6px"
        }}
      >
        Upload
      </button>
    </main>
  );
}
