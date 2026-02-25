import React, { useState } from "react";
import "./CompressHEIC.css";

const CompressHEIC = () => {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCompress = () => {
    if (file) {
      // Simulate HEIC compression (placeholder logic)
      setCompressedFile(file);
      alert("HEIC image compressed!");
    } else {
      alert("Please upload a HEIC image first.");
    }
  };

  return (
    <div className="compress-container">
      <h2>Compress HEIC</h2>
      <input type="file" onChange={handleFileChange} accept="image/heic" />
      {file && <p>{file.name}</p>}
      <button onClick={handleCompress} className="compress-btn">
        Compress
      </button>
      {compressedFile && <p>Compressed File: {compressedFile.name}</p>}
    </div>
  );
};

export default CompressHEIC;
