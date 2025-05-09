import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const MergePDFandImage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mergedPdf, setMergedPdf] = useState(null);

  // Handle file selection
  const handleFileChange = (e, type) => {
    if (type === "pdf") setPdfFile(e.target.files[0]);
    else if (type === "image") setImageFile(e.target.files[0]);
  };

  // Merge PDF and Image
  const handleMerge = async (e) => {
    e.preventDefault();
    if (!pdfFile || !imageFile) {
      alert("Please select both PDF and Image files.");
      return;
    }

    const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
    const imageBytes = await imageFile.arrayBuffer();
    const image = await pdfDoc.embedJpg(imageBytes);

    const [page] = pdfDoc.getPages();
    const { width, height } = page.getSize();
    const imageWidth = 200; // Resize image width
    const imageHeight = (image.height / image.width) * imageWidth;
    page.drawImage(image, {
      x: width / 2 - imageWidth / 2,
      y: height / 2 - imageHeight / 2,
      width: imageWidth,
      height: imageHeight,
    });

    const mergedPdfBytes = await pdfDoc.save();
    const mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const mergedUrl = URL.createObjectURL(mergedBlob);
    setMergedPdf(mergedUrl);
  };

  return (
    <div className="container mt-4">
      <h1>Merge PDF and Image</h1>
      <form onSubmit={handleMerge}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, "pdf")}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "image")}
        />
        <button type="submit">Merge PDF and Image</button>
      </form>
      {mergedPdf && (
        <div>
          <h2>Download Merged PDF</h2>
          <a href={mergedPdf} download="merged.pdf">
            Click here to download the merged PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default MergePDFandImage;
