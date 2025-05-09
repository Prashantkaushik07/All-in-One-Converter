import React, { useState } from "react";
import "./CompressImage.css"; // Create a CSS file for styling

const CompressImage = () => {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCompress = () => {
    if (file) {
      // Here, you'd implement the actual image compression logic (this is a placeholder)
      setCompressedFile(file);
      alert("Image compressed!");
    } else {
      alert("Please upload an image first.");
    }
  };

  return (
    <div className="compress-container">
      <h2>Compress Image</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {file && <p>{file.name}</p>}
      <button onClick={handleCompress} className="compress-btn">
        Compress
      </button>
      {compressedFile && <p>Compressed File: {compressedFile.name}</p>}
    </div>
  );
};

export default CompressImage;
