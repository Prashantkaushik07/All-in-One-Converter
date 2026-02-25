import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
<<<<<<< Updated upstream
=======
import "./MergePDFandImage.css"; // Import your CSS file here
import { uploadApi } from "../../api/user_apiList";
>>>>>>> Stashed changes

const MergePDFandImage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mergedPdf, setMergedPdf] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e, type) => {
    if (type === "pdf") setPdfFile(e.target.files[0]);
    else if (type === "image") setImageFile(e.target.files[0]);
    setStatusMessage("");
    setErrorMessage("");
  };

  // Merge PDF and Image
  const handleMerge = async (e) => {
    e.preventDefault();
    if (!pdfFile || !imageFile) {
      alert("Please select both PDF and Image files.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
      const imageBytes = await imageFile.arrayBuffer();
      const image = imageFile.type === "image/png"
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);

      const [page] = pdfDoc.getPages();
      const { width, height } = page.getSize();
      const imageWidth = 200;
      const imageHeight = (image.height / image.width) * imageWidth;
      page.drawImage(image, {
        x: width / 2 - imageWidth / 2,
        y: height / 2 - imageHeight / 2,
        width: imageWidth,
        height: imageHeight,
      });

      const mergedPdfBytes = await pdfDoc.save();
      const mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const outputName = `merged-image-${Date.now()}.pdf`;
      const outputFile = new File([mergedBlob], outputName, { type: "application/pdf" });

      await uploadApi.uploadFiles([outputFile]);
      setMergedPdf(URL.createObjectURL(mergedBlob));
      setStatusMessage("Merged PDF is ready and saved to Processed Files.");
    } catch (error) {
      setErrorMessage(error?.message || "Failed to merge PDF and image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Merge PDF and Image</h1>
      {errorMessage && <p>{errorMessage}</p>}
      {statusMessage && <p>{statusMessage}</p>}
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
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Merge PDF and Image"}
        </button>
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
