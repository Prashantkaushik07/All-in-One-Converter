import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import "./CompressPDF.css"; // Your CSS file

const CompressPDF = () => {
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleDrop = async (acceptedFiles) => {
    if (!acceptedFiles.length) {
      alert("No valid file uploaded!");
      return;
    }

    const file = acceptedFiles[0];
    setOriginalSize(file.size);
    setFile(file);
    setIsProcessing(true);

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const pdfDoc = await PDFDocument.load(e.target.result);
        const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

        const compressedBlob = new Blob([pdfBytes], { type: "application/pdf" });
        setCompressedSize(pdfBytes.byteLength);
        setCompressedFile(compressedBlob);

        // Upload to backend
        handleUpload(file.name, file.type, compressedBlob);
      } catch (error) {
        console.error("Error compressing the file:", error);
        alert("Failed to compress the file. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  const handleUpload = async (filename, fileType, fileBlob) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            filename,
            fileType,
            fileBase64: base64,
          }),
        });
        const data = await res.json();
        console.log("Upload response:", data);
        alert("File uploaded successfully to MongoDB!");
      } catch (err) {
        console.error("Error uploading compressed file:", err);
        alert("Upload failed. Check console for details.");
      }
    };
    reader.readAsDataURL(fileBlob);
  };

  const downloadCompressedFile = () => {
    if (compressedFile) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(compressedFile);
      link.download = "compressed.pdf";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-300 shadow-lg rounded-md w-96 p-6">
        <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Compress PDF</h2>
        <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-sm">Drop PDF file here or</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded">Select PDF</button>
            </div>
          )}
        </Dropzone>

        {file && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">File uploaded: {file.name}</p>
            <p className="text-sm text-gray-600">
              Original size: {(originalSize / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-500">Processing...</p>
          </div>
        )}

        {compressedFile && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">
              Compressed size: {(compressedSize / 1024).toFixed(2)} KB
            </p>
            <button
              onClick={downloadCompressedFile}
              className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
            >
              Download Compressed PDF
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">🔒 Your files are secure.</p>
    </div>
  );
};

export default CompressPDF;
