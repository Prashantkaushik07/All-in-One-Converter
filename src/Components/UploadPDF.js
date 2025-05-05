import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPDF.css";

function UploadPDF() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      navigate("/convert-pdf", { state: { file } });
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      navigate("/convert-pdf", { state: { file } });
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="upload-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p className="upload-text">Drop PDF files here or</p>
      <button
        className="upload-button"
        onClick={() => fileInputRef.current.click()}
      >
        Select PDF
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
        accept="application/pdf"
      />
      <div className="secure-text">
        <span className="lock-icon" role="img" aria-label="lock">
          🔒
        </span>{" "}
        Your files are secure
      </div>
    </div>
  );
}

export default UploadPDF;
