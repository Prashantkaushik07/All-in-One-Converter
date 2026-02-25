// import React from "react";

// const MergePDF = () => {
//   return (
//     <div className="container mt-5">
//       <h2>Merge PDF</h2>
//       <p>This page allows you to merge multiple PDF files.</p>
//     </div>
//   );
// };

// export default MergePDF;

// import React, { useState } from 'react';
// import { PDFDocument } from 'pdf-lib';
// import "./MergePDF.css";

// const MergePDF = () => {
//   const [files, setFiles] = useState(null);
//   const [mergedPdf, setMergedPdf] = useState(null);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     setFiles(e.target.files);
//   };

//   // Merge PDFs
//   const handleMerge = async (e) => {
//     e.preventDefault();
//     if (!files || files.length < 2) {
//       alert("Please select at least two PDF files.");
//       return;
//     }

//     const pdfDoc = await PDFDocument.create();
//     for (const file of files) {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await PDFDocument.load(arrayBuffer);
//       const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPages().map((_, i) => i));
//       copiedPages.forEach((page) => pdfDoc.addPage(page));
//     }

//     const mergedPdfBytes = await pdfDoc.save();
//     const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
//     const mergedUrl = URL.createObjectURL(mergedBlob);
//     setMergedPdf(mergedUrl);
//   };

//   return (
//     <div className="container mt-4">
//       <h1>Merge PDF</h1>
//       <form onSubmit={handleMerge}>
//         <input type="file" accept=".pdf" multiple onChange={handleFileChange} />
//         <button type="submit">Merge PDF</button>
//       </form>
//       {mergedPdf && (
//         <div>
//           <h2>Download Merged PDF</h2>
//           <a href={mergedPdf} download="merged.pdf">
//             Click here to download the merged PDF
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MergePDF;

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import "./MergePDF.css"; // Import your CSS file here

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [mergedFile, setMergedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrop = async (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const mergePDFs = async () => {
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      setMergedFile(new Blob([mergedBytes], { type: "application/pdf" }));
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMergedFile = () => {
    if (mergedFile) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(mergedFile);
      link.download = "merged.pdf";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-300 shadow-lg rounded-md w-96 p-6">
        <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
          Merge PDF
        </h2>
        <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-sm">Drop PDF files here or</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded"
                aria-label="Select PDFs"
              >
                Select PDFs
              </button>
            </div>
          )}
        </Dropzone>
        {files.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">
              Files uploaded: {files.map((file) => file.name).join(", ")}
            </p>
            <button
              onClick={mergePDFs}
              className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
              aria-label="Merge PDFs"
            >
              Merge PDFs
            </button>
          </div>
        )}
        {isProcessing && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-500">Processing...</p>
          </div>
        )}
        {mergedFile && (
          <div className="mt-4 text-center">
            <button
              onClick={downloadMergedFile}
              className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
              aria-label="Download Merged PDF"
            >
              Download Merged PDF
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">🔒 Your files are secure.</p>
    </div>
  );
};

export default MergePDF;
