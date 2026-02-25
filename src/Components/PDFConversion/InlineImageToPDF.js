import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";

function InlineImageToPDF() {
  const [images, setImages] = useState([]);
  const dropZoneRef = useRef(null);

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length > 0) {
      setImages((prev) => [...prev, ...imageFiles]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add("drag-over");
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove("drag-over");
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  };

  const onFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const pdf = new jsPDF("p", "pt", "a4");
    for (let i = 0; i < images.length; i++) {
      const imgData = await readFileAsDataURL(images[i]);
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let imgWidth = img.width;
      let imgHeight = img.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      imgWidth *= ratio;
      imgHeight *= ratio;

      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(
        imgData,
        "JPEG",
        (pageWidth - imgWidth) / 2,
        (pageHeight - imgHeight) / 2,
        imgWidth,
        imgHeight
      );
    }

    pdf.save("converted.pdf");
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="image-to-pdf-container">
      <div
        className="dropzone"
        ref={dropZoneRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <p className="dropzone-text">Drop image files here or</p>
        <input
          type="file"
          id="fileInput"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileInputChange}
        />
        <label htmlFor="fileInput" className="select-image-button">
          Select Image
        </label>
        <div className="secure-text">
          <span className="lock-icon" role="img" aria-label="lock">
            🔒
          </span>{" "}
          Your files are secure
        </div>
      </div>

      {images.length > 0 && (
        <div className="preview-section">
          <h4>Selected Images:</h4>
          <div className="preview-grid">
            {images.map((img, index) => (
              <div key={index} className="preview-item">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  className="preview-image"
                />
                <p>{img.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <button className="convert-button" onClick={convertToPDF}>
          Convert to PDF
        </button>
      )}
    </div>
  );
}

export default InlineImageToPDF;
