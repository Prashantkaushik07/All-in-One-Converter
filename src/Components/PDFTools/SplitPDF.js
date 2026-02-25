// import React from "react";

// const SplitPDF = () => {
//   return (
//     <div className="container mt-5">
//       <h2>Split PDF</h2>
//       <p>This page allows you to split your PDF files into multiple parts.</p>
//     </div>
//   );
// };

// export default SplitPDF;

// import React, { useState } from 'react';
// import { PDFDocument } from 'pdf-lib';

// const SplitPDF = () => {
//   const [pdfFile, setPdfFile] = useState(null);
//   const [splittedPdfs, setSplittedPdfs] = useState([]);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     setPdfFile(e.target.files[0]);
//   };

//   // Split PDF
//   const handleSplit = async (e) => {
//     e.preventDefault();
//     if (!pdfFile) {
//       alert("Please select a PDF file.");
//       return;
//     }

//     const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
//     const totalPages = pdfDoc.getPages().length;
//     const newPdfFiles = [];

//     for (let i = 0; i < totalPages; i++) {
//       const newPdf = await PDFDocument.create();
//       const [page] = await newPdf.copyPages(pdfDoc, [i]);
//       newPdf.addPage(page);

//       const pdfBytes = await newPdf.save();
//       const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const pdfUrl = URL.createObjectURL(pdfBlob);
//       newPdfFiles.push(pdfUrl);
//     }

//     setSplittedPdfs(newPdfFiles);
//   };

//   return (
//     <div className="container mt-4">
//       <h1>Split PDF</h1>
//       <form onSubmit={handleSplit}>
//         <input type="file" accept=".pdf" onChange={handleFileChange} />
//         <button type="submit">Split PDF</button>
//       </form>

//       {splittedPdfs.length > 0 && (
//         <div>
//           <h2>Download Split PDFs</h2>
//           {splittedPdfs.map((url, index) => (
//             <div key={index}>
//               <a href={url} download={`split-page-${index + 1}.pdf`}>
//                 Download Page {index + 1}
//               </a>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SplitPDF;

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import "./SplitPDF.css";
import { uploadApi } from "../../api/user_apiList";

const SplitPDF = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrop = async (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setStatusMessage("");
    setErrorMessage("");
  };

  const splitPDF = async () => {
    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("");
    setErrorMessage("");
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pagePromises = pdfDoc.getPageIndices().map(async (pageIndex) => {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        return new Blob([pdfBytes], { type: "application/pdf" });
      });

      const splitPages = await Promise.all(pagePromises);
      setPages(splitPages);

      const outputFiles = splitPages.map(
        (pageBlob, index) =>
          new File([pageBlob], `split-page-${index + 1}-${Date.now()}.pdf`, {
            type: "application/pdf",
          })
      );
      await uploadApi.uploadFiles(outputFiles);
      setStatusMessage("Split PDFs are ready and saved to Processed Files.");
    } catch (error) {
      console.error("Error splitting the PDF:", error);
      setErrorMessage(error?.message || "Failed to split the PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPage = (page, index) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(page);
    link.download = `page-${index + 1}.pdf`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-300 shadow-lg rounded-md w-96 p-6">
        <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
          Split PDF
        </h2>
        {errorMessage && <p className="text-sm text-red-600 text-center">{errorMessage}</p>}
        {statusMessage && <p className="text-sm text-green-600 text-center">{statusMessage}</p>}
        <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-sm">Drop a PDF file here or</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded"
                aria-label="Select PDF"
              >
                Select PDF
              </button>
            </div>
          )}
        </Dropzone>
        {file && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">File uploaded: {file.name}</p>
            <button
              onClick={splitPDF}
              className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
              aria-label="Split PDF"
            >
              Split PDF
            </button>
          </div>
        )}
        {isProcessing && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-500">Processing...</p>
          </div>
        )}
        {pages.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">Split Pages:</p>
            {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => downloadPage(page, index)}
                className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
                aria-label={`Download Page ${index + 1}`}
              >
                Download Page {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">🔒 Your files are secure.</p>
    </div>
  );
};

export default SplitPDF;
