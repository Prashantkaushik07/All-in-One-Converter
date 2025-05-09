import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ConvertPDF.css";

function ConvertPDF() {
  const location = useLocation();
  const file = location.state?.file;

  const [format, setFormat] = useState("A4");
  const [orientation, setOrientation] = useState("Portrait");
  const [margin, setMargin] = useState("No Margin");
  const [quality, setQuality] = useState("Medium");

  const handleConvert = () => {
    if (file) {
      alert(
        `Converting ${file.name} with format: ${format}, orientation: ${orientation}, margin: ${margin}, quality: ${quality}`
      );
    } else {
      alert("No file to convert.");
    }
  };

  const handleAddImage = () => {
    alert("Add image logic here");
  };

  return (
    <div className="convert-container">
      <div className="settings">
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
        </select>
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
        >
          <option value="Portrait">Portrait</option>
          <option value="Landscape">Landscape</option>
        </select>
        <select value={margin} onChange={(e) => setMargin(e.target.value)}>
          <option value="No Margin">No Margin</option>
          <option value="Small Margin">Small Margin</option>
        </select>
        <select value={quality} onChange={(e) => setQuality(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="file-preview">
        {file && (
          <div className="file-details">
            <span>{file.name}</span>
            <span>{(file.size / 1024).toFixed(2)} KB</span>
          </div>
        )}
        <button className="add-image-button" onClick={handleAddImage}>
          Add Images
        </button>
      </div>
      <div className="actions">
        <button className="convert-button" onClick={handleConvert}>
          Convert to PDF
        </button>
      </div>
    </div>
  );
}

export default ConvertPDF;
