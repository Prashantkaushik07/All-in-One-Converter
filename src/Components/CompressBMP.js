import React, { useState } from "react";
import "./CompressBMP.css";

const CompressBMP = () => {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCompress = () => {
    if (file) {
      // Simulate BMP compression (placeholder logic)
      setCompressedFile(file);
      alert("BMP image compressed!");
    } else {
      alert("Please upload a BMP image first.");
    }
  };

  return (
    <div className="compress-container">
      <h2>Compress BMP</h2>
      <input type="file" onChange={handleFileChange} accept="image/bmp" />
      {file && <p>{file.name}</p>}
      <button onClick={handleCompress} className="compress-btn">
        Compress
      </button>
      {compressedFile && <p>Compressed File: {compressedFile.name}</p>}
    </div>
  );
};

export default CompressBMP;
