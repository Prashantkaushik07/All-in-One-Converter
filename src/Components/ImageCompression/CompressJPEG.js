import React, { useState } from "react";
import "./CompressJPEG.css";

const CompressJPEG = () => {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCompress = () => {
    if (file) {
      // Simulate JPEG compression (placeholder logic)
      const compressedFile = new Blob([file], { type: file.type }); // Simulate compression
      setCompressedFile(compressedFile);

      // Create a URL for the compressed file
      const url = URL.createObjectURL(compressedFile);
      setDownloadURL(url);

      alert("JPEG image compressed!");
    } else {
      alert("Please upload a JPEG image first.");
    }
  };

  return (
    <div className="compress-container">
      <h2>Compress JPEG</h2>
      <input type="file" onChange={handleFileChange} accept="image/jpeg" />
      {file && <p>{file.name}</p>}
      <button onClick={handleCompress} className="compress-btn">
        Compress
      </button>
      {compressedFile && (
        <div>
          <p>Compressed File: {file.name}</p>
          <a
            href={downloadURL}
            download={`compressed-${file.name}`}
            className="download-btn"
          >
            Download Compressed File
          </a>
        </div>
      )}
    </div>
  );
};

export default CompressJPEG;
