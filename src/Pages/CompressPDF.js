// import React from "react";

// const CompressPDF = () => {
//   return (
//     <div className="container mt-5">
//       <h2>Compress PDF</h2>
//       <p>This page allows you to compress your PDF files.</p>
//     </div>
//   );
// };

// export default CompressPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import { saveAs } from "file-saver";

// const CompressPDF = () => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileChange = (event) => {
//     const uploadedFile = event.target.files[0];
//     if (uploadedFile && uploadedFile.type === "application/pdf") {
//       setFile(uploadedFile);
//       setError("");
//     } else {
//       setError("Please upload a valid PDF file.");
//     }
//   };

//   const compressPDF = async () => {
//     if (!file) {
//       setError("No file selected.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Read the PDF file
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);

//       // Compress the PDF by reducing image quality (if images exist)
//       const pages = pdfDoc.getPages();
//       pages.forEach((page) => {
//         const { width, height } = page.getSize();
//         page.setSize(width * 0.8, height * 0.8); // Example compression logic
//       });

//       // Save the compressed PDF
//       const compressedPdfBytes = await pdfDoc.save();
//       const compressedBlob = new Blob([compressedPdfBytes], { type: "application/pdf" });
//       saveAs(compressedBlob, "compressed.pdf");

//       setLoading(false);
//       alert("PDF successfully compressed!");
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while compressing the PDF.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h1>Compress PDF</h1>
//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={handleFileChange}
//         style={{ marginBottom: "20px" }}
//       />
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <button
//         onClick={compressPDF}
//         disabled={!file || loading}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#007BFF",
//           color: "#fff",
//           border: "none",
//           cursor: file ? "pointer" : "not-allowed",
//         }}
//       >
//         {loading ? "Compressing..." : "Compress PDF"}
//       </button>
//     </div>
//   );
// };

// export default CompressPDF;

// import React, { useState } from "react";
// import "./CompressPDF.css";

// const CompressPDF = () => {
//   const [fileName, setFileName] = useState("");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFileName(file.name);
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file) {
//       setFileName(file.name);
//     }
//   };

//   return (
//     <div className="compress-pdf-container">
//       <div
//         className="upload-box"
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//       >
//         <p>Drop PDF file here or</p>
//         <label className="upload-button">
//           <input type="file" accept="application/pdf" onChange={handleFileChange} />
//           Select PDF
//         </label>
//         {fileName && <p className="file-name">Selected File: {fileName}</p>}
//       </div>
//       <p className="file-security">🔒 Your files are secure</p>
//     </div>
//   );
// };

// export default CompressPDF;

// when i upload a pdf then next data will show

// import React, { useState } from "react";
// import "./CompressPDF.css";

// const CompressPDF = () => {
//   const [files, setFiles] = useState([]);
//   const [compressionLevel, setCompressionLevel] = useState(60);

//   const handleFileUpload = (event) => {
//     const uploadedFiles = Array.from(event.target.files).map((file) => ({
//       name: file.name,
//       size: file.size,
//       compressedSize: Math.round(file.size * (compressionLevel / 100)),
//     }));
//     setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
//   };

//   const handleDeleteFile = (index) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   const handleDeleteAll = () => {
//     setFiles([]);
//   };

//   const handleCompressionChange = (event) => {
//     setCompressionLevel(Number(event.target.value));
//     setFiles((prevFiles) =>
//       prevFiles.map((file) => ({
//         ...file,
//         compressedSize: Math.round(file.size * (event.target.value / 100)),
//       }))
//     );
//   };

//   return (
//     <div className="compress-pdf-container">
//       {/* Compression Level */}
//       <div className="compression-controls">
//         <label>Compression Level</label>
//         <input
//           type="range"
//           min="10"
//           max="90"
//           value={compressionLevel}
//           onChange={handleCompressionChange}
//         />
//         <span>{compressionLevel}%</span>
//         <button
//           className="btn btn-primary compress-btn"
//           disabled={!files.length}
//           onClick={() => alert("Files compressed!")}
//         >
//           Compress
//         </button>
//         <button
//           className="btn btn-danger delete-all-btn"
//           disabled={!files.length}
//           onClick={handleDeleteAll}
//         >
//           Delete All
//         </button>
//       </div>

//       {/* Uploaded Files */}
//       <div className="file-preview-container">
//         {files.map((file, index) => (
//           <div key={index} className="file-preview">
//             <div className="file-info">
//               <p>{file.name}</p>
//               <p>
//                 Original Size: {(file.size / 1024).toFixed(2)} KB
//                 <br />
//                 Compressed: {(file.compressedSize / 1024).toFixed(2)} KB
//               </p>
//             </div>
//             <button
//               className="btn btn-outline-primary download-btn"
//               onClick={() => alert("Download file")}
//             >
//               Download
//             </button>
//             <button
//               className="btn btn-danger delete-btn"
//               onClick={() => handleDeleteFile(index)}
//             >
//               ❌
//             </button>
//           </div>
//         ))}

//         {/* Add File Button */}
//         <div className="add-file-box">
//           <label className="add-file-label">
//             Add PDF Files
//             <input
//               type="file"
//               accept="application/pdf"
//               multiple
//               onChange={handleFileUpload}
//             />
//           </label>
//         </div>
//       </div>

//       {/* Bottom Buttons */}
//       <div className="bottom-controls">
//         <label className="btn btn-primary">
//           Select PDF
//           <input type="file" accept="application/pdf" multiple onChange={handleFileUpload} />
//         </label>
//         <button
//           className="btn btn-primary download-all-btn"
//           disabled={!files.length}
//           onClick={() => alert("Download all as ZIP")}
//         >
//           Download Zip
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CompressPDF;

// import React, { useState } from "react";
// import JSZip from "jszip";
// import "./CompressPDF.css";

// const CompressPDF = () => {
//   const [files, setFiles] = useState([]);
//   const [compressionLevel, setCompressionLevel] = useState(60);

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const uploadedFiles = Array.from(event.target.files).map((file) => ({
//       name: file.name,
//       size: file.size,
//       compressedSize: Math.round(file.size * (compressionLevel / 100)),
//       data: file, // Store file for download
//     }));
//     setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
//   };

//   // Handle file download
//   const handleDownloadFile = (file) => {
//     const blob = new Blob([file.data], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = file.name;
//     a.click();
//     URL.revokeObjectURL(url); // Clean up the URL object
//   };

//   // Handle download all files as ZIP
//   const handleDownloadAllAsZip = async () => {
//     const zip = new JSZip();
//     files.forEach((file) => {
//       zip.file(file.name, file.data);
//     });

//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     const zipUrl = URL.createObjectURL(zipBlob);
//     const a = document.createElement("a");
//     a.href = zipUrl;
//     a.download = "compressed_files.zip";
//     a.click();
//     URL.revokeObjectURL(zipUrl); // Clean up the URL object
//   };

//   // Handle compression level change
//   const handleCompressionChange = (event) => {
//     setCompressionLevel(Number(event.target.value));
//     setFiles((prevFiles) =>
//       prevFiles.map((file) => ({
//         ...file,
//         compressedSize: Math.round(file.size * (event.target.value / 100)),
//       }))
//     );
//   };

//   // Handle deleting a single file
//   const handleDeleteFile = (index) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   // Handle deleting all files
//   const handleDeleteAll = () => {
//     setFiles([]);
//   };

//   return (
//     <div className="compress-pdf-container">
//       {!files.length ? (
//         <div className="upload-box">
//           <p>Drop PDF files here or</p>
//           <label className="upload-button">
//             <input type="file" accept="application/pdf" multiple onChange={handleFileUpload} />
//             Select PDF
//           </label>
//         </div>
//       ) : (
//         <>
//           {/* Compression Controls */}
//           <div className="compression-controls">
//             <label>Compression Level</label>
//             <input
//               type="range"
//               min="10"
//               max="90"
//               value={compressionLevel}
//               onChange={handleCompressionChange}
//             />
//             <span>{compressionLevel}%</span>
//             <button
//               className="btn btn-primary"
//               disabled={!files.length}
//               onClick={() => alert("Files compressed!")}
//             >
//               Compress
//             </button>
//             <button
//               className="btn btn-danger"
//               disabled={!files.length}
//               onClick={handleDeleteAll}
//             >
//               Delete All
//             </button>
//           </div>

//           {/* File List */}
//           <div className="file-list">
//             {files.map((file, index) => (
//               <div key={index} className="file-item">
//                 <p className="file-name">{file.name}</p>
//                 <p>
//                   Original Size: {(file.size / 1024).toFixed(2)} KB
//                   <br />
//                   Compressed: {(file.compressedSize / 1024).toFixed(2)} KB
//                 </p>
//                 <button
//                   className="btn btn-download"
//                   onClick={() => handleDownloadFile(file)}
//                 >
//                   Download
//                 </button>
//                 <button
//                   className="btn btn-delete"
//                   onClick={() => handleDeleteFile(index)}
//                 >
//                   ❌
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Bottom Controls */}
//           <div className="bottom-controls">
//             <label className="btn btn-primary">
//               Add More Files
//               <input type="file" accept="application/pdf" multiple onChange={handleFileUpload} />
//             </label>
//             <button
//               className="btn btn-primary"
//               disabled={!files.length}
//               onClick={handleDownloadAllAsZip}
//             >
//               Download All as ZIP
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CompressPDF;

// import React, { useState } from "react";
// import "./CompressPDF.css";

// const CompressPDF = () => {
//   const [files, setFiles] = useState([]);
//   const [compressionLevel, setCompressionLevel] = useState(60);

//   const handleFileUpload = (event) => {
//     const uploadedFiles = Array.from(event.target.files).map((file) => ({
//       file: file,  // Store the file itself
//       name: file.name,
//       size: file.size,
//       compressedSize: Math.round(file.size * (compressionLevel / 100)),
//     }));
//     setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
//   };

//   const handleDownloadFile = (file) => {
//     const blob = new Blob([file], { type: 'application/pdf' });  // Create blob for the file
//     const url = URL.createObjectURL(blob);  // Create an object URL

//     const link = document.createElement('a');
//     link.href = url;
//     link.download = file.name;  // Set the download file name
//     link.click();

//     // Cleanup after download
//     URL.revokeObjectURL(url);
//   };

//   const handleCompressionChange = (event) => {
//     setCompressionLevel(Number(event.target.value));
//     setFiles((prevFiles) =>
//       prevFiles.map((file) => ({
//         ...file,
//         compressedSize: Math.round(file.size * (event.target.value / 100)),
//       }))
//     );
//   };

//   return (
//     <div className="compress-pdf-container">
//       {/* Compression Level */}
//       <div className="compression-controls">
//         <label>Compression Level</label>
//         <input
//           type="range"
//           min="10"
//           max="90"
//           value={compressionLevel}
//           onChange={handleCompressionChange}
//         />
//         <span>{compressionLevel}%</span>
//       </div>

//       {/* Uploaded Files */}
//       <div className="file-preview-container">
//         {files.map((file, index) => (
//           <div key={index} className="file-preview">
//             <div className="file-info">
//               <p>{file.name}</p>
//               <p>
//                 Original Size: {(file.size / 1024).toFixed(2)} KB
//                 <br />
//                 Compressed: {(file.compressedSize / 1024).toFixed(2)} KB
//               </p>
//             </div>
//             <button
//               className="btn btn-outline-primary download-btn"
//               onClick={() => handleDownloadFile(file.file)}  // Trigger download
//             >
//               Download
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Add File Button */}
//       <div className="add-file-box">
//         <label className="add-file-label">
//           Add PDF Files
//           <input
//             type="file"
//             accept="application/pdf"
//             multiple
//             onChange={handleFileUpload}
//           />
//         </label>
//       </div>
//     </div>
//   );
// };

// export default CompressPDF;
// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";

// const CompressPDF = () => {
//   const [file, setFile] = useState(null);
//   const [compressedFile, setCompressedFile] = useState(null);

//   const handleDrop = async (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const fileReader = new FileReader();

//     fileReader.onload = async (e) => {
//       const pdfDoc = await PDFDocument.load(e.target.result);
//       const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
//       setCompressedFile(new Blob([pdfBytes], { type: "application/pdf" }));
//     };

//     fileReader.readAsArrayBuffer(file);
//     setFile(file);
//   };

//   const downloadCompressedFile = () => {
//     if (compressedFile) {
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(compressedFile);
//       link.download = "compressed.pdf";
//       link.click();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <div className="p-6 bg-white shadow-lg rounded-lg">
//         <h2 className="text-2xl font-bold mb-4 text-center">Compress PDF</h2>
//         <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//           {({ getRootProps, getInputProps }) => (
//             <div
//               {...getRootProps()}
//               className="border-2 border-dashed border-gray-300 p-10 rounded-lg text-center cursor-pointer"
//             >
//               <input {...getInputProps()} />
//               <p className="text-gray-600">Drop PDF file here or</p>
//               <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
//                 Select PDF
//               </button>
//             </div>
//           )}
//         </Dropzone>
//         {file && (
//           <div className="mt-4">
//             <p className="text-green-600">File uploaded: {file.name}</p>
//           </div>
//         )}
//         {compressedFile && (
//           <button
//             onClick={downloadCompressedFile}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
//           >
//             Download Compressed PDF
//           </button>
//         )}
//       </div>
//       <p className="mt-4 text-sm text-gray-500">
//         🔒 Your files are secure.
//       </p>
//     </div>
//   );
// };

// export default CompressPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import "./CompressPDF.css";

// const CompressPDF = () => {
//   const [file, setFile] = useState(null);
//   const [compressedFile, setCompressedFile] = useState(null);

//   const handleDrop = async (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const fileReader = new FileReader();

//     fileReader.onload = async (e) => {
//       const pdfDoc = await PDFDocument.load(e.target.result);
//       const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
//       setCompressedFile(new Blob([pdfBytes], { type: "application/pdf" }));
//     };

//     fileReader.readAsArrayBuffer(file);
//     setFile(file);
//   };

//   const downloadCompressedFile = () => {
//     if (compressedFile) {
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(compressedFile);
//       link.download = "compressed.pdf";
//       link.click();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white border border-gray-300 shadow-lg rounded-md w-96 p-6">
//         <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
//           Compress PDF
//         </h2>
//         <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//           {({ getRootProps, getInputProps }) => (
//             <div
//               {...getRootProps()}
//               className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer"
//             >
//               <input {...getInputProps()} />
//               <p className="text-sm">Drop PDF file here or</p>
//               <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded">
//                 Select PDF
//               </button>
//             </div>
//           )}
//         </Dropzone>
//         {file && (
//           <div className="mt-4 text-center">
//             <p className="text-sm text-green-600">File uploaded: {file.name}</p>
//           </div>
//         )}

//         {compressedFile && (
//           <div className="mt-4 text-center">
//             <button
//               onClick={downloadCompressedFile}
//               className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
//             >
//               Download Compressed PDF
//             </button>
//           </div>
//         )}
//       </div>
//       <p className="mt-4 text-sm text-gray-500">🔒 Your files are secure.</p>
//     </div>
//   );
// };

// export default CompressPDF;

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import "./CompressPDF.css"; // Import your CSS file here

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

        setCompressedSize(pdfBytes.byteLength);
        setCompressedFile(new Blob([pdfBytes], { type: "application/pdf" }));
      } catch (error) {
        console.error("Error compressing the file:", error);
        alert("Failed to compress the file. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    fileReader.readAsArrayBuffer(file);
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
        <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
          Compress PDF
        </h2>
        <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-sm">Drop PDF file here or</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded"
                aria-label="Select PDF"
              >
                Select PDF
              </button>
            </div>
          )}
        </Dropzone>

        {/* File upload info */}
        {file && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">File uploaded: {file.name}</p>
            <p className="text-sm text-gray-600">
              Original size: {(originalSize / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {/* Processing/loading indicator */}
        {isProcessing && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-500">Processing...</p>
          </div>
        )}

        {/* Compressed file info and download button */}
        {compressedFile && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">
              Compressed size: {(compressedSize / 1024).toFixed(2)} KB
            </p>
            <button
              onClick={downloadCompressedFile}
              className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
              aria-label="Download Compressed PDF"
            >
              Download Compressed PDF
            </button>
          </div>
        )}
      </div>

      {/* Footer security note */}
      <p className="mt-4 text-sm text-gray-500">🔒 Your files are secure.</p>
    </div>
  );
};

export default CompressPDF;
