import React, { useState } from "react";
import "./CompressPNG.css";

const CompressPNG = () => {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCompress = () => {
    if (file) {
      // Simulate PNG compression (placeholder logic)
      setCompressedFile(file);
      alert("PNG image compressed!");
    } else {
      alert("Please upload a PNG image first.");
    }
  };

  return (
    <div className="compress-container">
      <h2>Compress PNG</h2>
      <input type="file" onChange={handleFileChange} accept="image/png" />
      {file && <p>{file.name}</p>}
      <button onClick={handleCompress} className="compress-btn">
        Compress
      </button>
      {compressedFile && <p>Compressed File: {compressedFile.name}</p>}
    </div>
  );
};

export default CompressPNG;
