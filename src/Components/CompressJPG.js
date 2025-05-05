import React, { useState } from "react";
import "./CompressJPG.css";

const CompressJPG = () => {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCompress = () => {
    if (file) {
      // Simulate JPG compression (placeholder logic)
      setCompressedFile(file);
      alert("JPG image compressed!");
    } else {
      alert("Please upload a JPG image first.");
    }
  };

  return (
    <div className="compress-container">
      <h2>Compress JPG</h2>
      <input type="file" onChange={handleFileChange} accept="image/jpeg" />
      {file && <p>{file.name}</p>}
      <button onClick={handleCompress} className="compress-btn">
        Compress
      </button>
      {compressedFile && <p>Compressed File: {compressedFile.name}</p>}
    </div>
  );
};

export default CompressJPG;
