/* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import "./ProtectPDF.css"; // Import your CSS file here

// const ProtectPDF = () => {
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [protectedFile, setProtectedFile] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const protectPDF = async () => {
//     if (!password) {
//       alert("Please enter a password to protect the PDF.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const fileBytes = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(fileBytes);

//       pdfDoc.encrypt({
//         userPassword: password,
//         ownerPassword: password,
//         permissions: {
//           printing: "highResolution",
//           copying: false,
//           modifying: false,
//           fillingForms: false,
//         },
//       });

//       const protectedBytes = await pdfDoc.save();
//       setProtectedFile(new Blob([protectedBytes], { type: "application/pdf" }));
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert("Failed to protect the PDF. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const downloadProtectedFile = () => {
//     if (protectedFile) {
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(protectedFile);
//       link.download = "protected.pdf";
//       link.click();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white border border-gray-300 shadow-lg rounded-md w-96 p-6">
//         <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
//           Protect PDF
//         </h2>
//         <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//           {({ getRootProps, getInputProps }) => (
//             <div
//               {...getRootProps()}
//               className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer"
//             >
//               <input {...getInputProps()} />
//               <p className="text-sm">Drop a PDF file here or</p>
//               <button
//                 className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded"
//                 aria-label="Select PDF"
//               >
//                 Select PDF
//               </button>
//             </div>
//           )}
//         </Dropzone>
//         {file && (
//           <div className="mt-4">
//             <p className="text-sm text-green-600 text-center">
//               File uploaded: {file.name}
//             </p>
//             <input
//               type="password"
//               placeholder="Enter password"
//               className="mt-4 w-full px-4 py-2 border rounded text-sm text-gray-600"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               aria-label="Enter password"
//             />
//             <button
//               onClick={protectPDF}
//               className="mt-4 w-full px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
//               aria-label="Protect PDF"
//             >
//               Protect PDF
//             </button>
//           </div>
//         )}
//         {isProcessing && (
//           <div className="mt-4 text-center">
//             <p className="text-sm text-blue-500">Processing...</p>
//           </div>
//         )}
//         {protectedFile && (
//           <div className="mt-4 text-center">
//             <button
//               onClick={downloadProtectedFile}
//               className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
//               aria-label="Download Protected PDF"
//             >
//               Download Protected PDF
//             </button>
//           </div>
//         )}
//       </div>
//       <p className="mt-4 text-sm text-gray-500">🔒 Your files are secure.</p>
//     </div>
//   );
// };

// export default ProtectPDF;
// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const protectPDF = async () => {
//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const fileBytes = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(fileBytes);

//       pdfDoc.encrypt({
//         userPassword: password,
//         ownerPassword: password,
//         permissions: {
//           printing: "highResolution",
//           copying: false,
//           modifying: false,
//           fillingForms: false,
//         },
//       });

//       const protectedBytes = await pdfDoc.save();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(
//         new Blob([protectedBytes], { type: "application/pdf" })
//       );
//       link.download = "protected.pdf";
//       link.click();
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert("Failed to protect the PDF. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {!file ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 <p>{(file.size / 1024).toFixed(2)} KB</p>
//                 <p>{file.name}</p>
//                 <button
//                   onClick={() => setFile(null)}
//                   className="remove-file-btn"
//                 >
//                   ✖
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={!file || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     setFiles([...files, ...acceptedFiles]);  // Add new files to the existing list
//   };

//   const removeFile = (fileToRemove) => {
//     setFiles(files.filter(file => file !== fileToRemove));
//   };

//   const protectPDF = async () => {
//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const pdfDoc = await PDFDocument.create();

//       // Add all uploaded files to the PDF document
//       for (let file of files) {
//         const fileBytes = await file.arrayBuffer();
//         const existingPdfDoc = await PDFDocument.load(fileBytes);
//         const copiedPages = await pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
//         copiedPages.forEach((page) => pdfDoc.addPage(page));
//       }

//       // Encrypt the combined PDF with the provided password
//       pdfDoc.encrypt({
//         userPassword: password,
//         ownerPassword: password,
//         permissions: {
//           printing: "highResolution",
//           copying: false,
//           modifying: false,
//           fillingForms: false,
//         },
//       });

//       const protectedBytes = await pdfDoc.save();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(
//         new Blob([protectedBytes], { type: "application/pdf" })
//       );
//       link.download = "protected.pdf";
//       link.click();
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert("Failed to protect the PDF. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {files.length === 0 ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 {files.map((file, index) => (
//                   <div key={index} className="file-item">
//                     <p>{(file.size / 1024).toFixed(2)} KB</p>
//                     <p>{file.name}</p>
//                     <button
//                       onClick={() => removeFile(file)}
//                       className="remove-file-btn"
//                     >
//                       ✖
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={files.length === 0 || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;
// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     setFiles([...files, ...acceptedFiles]);  // Add new files to the existing list
//   };

//   const removeFile = (fileToRemove) => {
//     setFiles(files.filter(file => file !== fileToRemove));
//   };

//   const protectPDF = async () => {
//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       // Ensure at least one file is selected
//       if (files.length === 0) {
//         throw new Error("No PDF files selected.");
//       }

//       const pdfDoc = await PDFDocument.create();

//       // Add all uploaded files to the PDF document
//       for (let file of files) {
//         const fileBytes = await file.arrayBuffer();

//         // Check if the file is a valid PDF before attempting to load it
//         if (!file.name.endsWith(".pdf")) {
//           throw new Error(`Invalid file type: ${file.name}`);
//         }

//         const existingPdfDoc = await PDFDocument.load(fileBytes);
//         const copiedPages = await pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
//         copiedPages.forEach((page) => pdfDoc.addPage(page));
//       }

//       // Encrypt the combined PDF with the provided password
//       await pdfDoc.encrypt({
//         userPassword: password,
//         ownerPassword: password,
//         permissions: {
//           printing: "highResolution",
//           copying: false,
//           modifying: false,
//           fillingForms: false,
//         },
//       });

//       const protectedBytes = await pdfDoc.save();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(
//         new Blob([protectedBytes], { type: "application/pdf" })
//       );
//       link.download = "protected.pdf";
//       link.click();

//       alert("PDF protected successfully.");
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert(`Failed to protect the PDF: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {files.length === 0 ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 {files.map((file, index) => (
//                   <div key={index} className="file-item">
//                     <p>{(file.size / 1024).toFixed(2)} KB</p>
//                     <p>{file.name}</p>
//                     <button
//                       onClick={() => removeFile(file)}
//                       className="remove-file-btn"
//                     >
//                       ✖
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={files.length === 0 || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     console.log("Files dropped:", acceptedFiles);  // Log the dropped files
//     setFiles([...files, ...acceptedFiles]);  // Add new files to the existing list
//   };

//   const removeFile = (fileToRemove) => {
//     console.log("Removing file:", fileToRemove);
//     setFiles(files.filter(file => file !== fileToRemove));
//   };

//   const protectPDF = async () => {
//     console.log("Password:", password);
//     console.log("Confirm Password:", confirmPassword);

//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     if (files.length === 0) {
//       alert("No files selected.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const pdfDoc = await PDFDocument.create();

//       for (let file of files) {
//         console.log(`Processing file: ${file.name}`);  // Log each file being processed

//         // Check if the file is a PDF based on MIME type
//         if (!file.type.startsWith("application/pdf")) {
//           throw new Error(`The file ${file.name} is not a valid PDF.`);
//         }

//         const fileBytes = await file.arrayBuffer();
//         console.log("File bytes:", fileBytes);  // Log the file content

//         try {
//           const existingPdfDoc = await PDFDocument.load(fileBytes);
//           console.log(`Loaded PDF: ${file.name}`);

//           const copiedPages = await pdfDoc.copyPages(
//             existingPdfDoc,
//             existingPdfDoc.getPageIndices()
//           );
//           copiedPages.forEach((page) => pdfDoc.addPage(page));
//         } catch (pdfLoadError) {
//           throw new Error(`Failed to load PDF: ${file.name} - ${pdfLoadError.message}`);
//         }
//       }

//       console.log("Encrypting the PDF with password.");
//       await pdfDoc.encrypt({
//         userPassword: password,
//         ownerPassword: password,
//         permissions: {
//           printing: "highResolution",
//           copying: false,
//           modifying: false,
//           fillingForms: false,
//         },
//       });

//       const protectedBytes = await pdfDoc.save();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(
//         new Blob([protectedBytes], { type: "application/pdf" })
//       );
//       link.download = "protected.pdf";
//       link.click();

//       alert("PDF protected successfully.");
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert(`Failed to protect the PDF: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {files.length === 0 ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 {files.map((file, index) => (
//                   <div key={index} className="file-item">
//                     <p>{(file.size / 1024).toFixed(2)} KB</p>
//                     <p>{file.name}</p>
//                     <button
//                       onClick={() => removeFile(file)}
//                       className="remove-file-btn"
//                     >
//                       ✖
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={files.length === 0 || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import { jsPDF } from "jspdf"; // Import jsPDF for encryption
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     console.log("Files dropped:", acceptedFiles);  // Log the dropped files
//     setFiles([...files, ...acceptedFiles]);  // Add new files to the existing list
//   };

//   const removeFile = (fileToRemove) => {
//     console.log("Removing file:", fileToRemove);
//     setFiles(files.filter(file => file !== fileToRemove));
//   };

//   const protectPDF = async () => {
//     console.log("Password:", password);
//     console.log("Confirm Password:", confirmPassword);

//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     if (files.length === 0) {
//       alert("No files selected.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Create a new PDF document using jsPDF
//       const pdf = new jsPDF();

//       // Add the uploaded PDFs to the jsPDF document
//       for (let file of files) {
//         console.log(`Processing file: ${file.name}`);  // Log each file being processed

//         if (!file.type.startsWith("application/pdf")) {
//           throw new Error(`The file ${file.name} is not a valid PDF.`);
//         }

//         const fileBytes = await file.arrayBuffer();
//         console.log("File bytes:", fileBytes);  // Log the file content

//         try {
//           const existingPdfDoc = await PDFDocument.load(fileBytes);
//           console.log(`Loaded PDF: ${file.name}`);

//           const copiedPages = await pdf.copyPages(
//             existingPdfDoc,
//             existingPdfDoc.getPageIndices()
//           );
//           copiedPages.forEach((page) => pdf.addPage(page));
//         } catch (pdfLoadError) {
//           throw new Error(`Failed to load PDF: ${file.name} - ${pdfLoadError.message}`);
//         }
//       }

//       console.log("Encrypting the PDF with password.");

//       // Encrypt the PDF using jsPDF's encryption feature
//       const protectedPdfBytes = pdf.output("arraybuffer");

//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(new Blob([protectedPdfBytes], { type: "application/pdf" }));
//       link.download = "protected.pdf";
//       link.click();

//       alert("PDF protected successfully.");
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert(`Failed to protect the PDF: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {files.length === 0 ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 {files.map((file, index) => (
//                   <div key={index} className="file-item">
//                     <p>{(file.size / 1024).toFixed(2)} KB</p>
//                     <p>{file.name}</p>
//                     <button
//                       onClick={() => removeFile(file)}
//                       className="remove-file-btn"
//                     >
//                       ✖
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={files.length === 0 || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import { jsPDF } from "jspdf";
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const protectPDF = async () => {
//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       // Load the PDF using pdf-lib
//       const fileBytes = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(fileBytes);

//       // Create a new PDF for jsPDF to encrypt
//       const pdfBytes = await pdfDoc.save();

//       // Create a PDF document using jsPDF to apply password protection
//       const protectedPdf = new jsPDF();

//       // Use jsPDF to add the loaded pages from pdf-lib into jsPDF
//       for (let i = 0; i < pdfDoc.getPages().length; i++) {
//         const page = pdfDoc.getPages()[i];
//         protectedPdf.addImage(page, "PDF", 0, 0);
//       }

//       // Encrypt the PDF with password protection
//       protectedPdf.setEncryption(password, password, "owner", {
//         permissions: ["print", "modify", "copy", "annotate"],
//       });

//       // Save the protected PDF
//       const protectedPdfBytes = protectedPdf.output("arraybuffer");
//       const blob = new Blob([protectedPdfBytes], { type: "application/pdf" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "protected.pdf";
//       link.click();
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert("Failed to protect the PDF. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {!file ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 <p>{(file.size / 1024).toFixed(2)} KB</p>
//                 <p>{file.name}</p>
//                 <button
//                   onClick={() => setFile(null)}
//                   className="remove-file-btn"
//                 >
//                   ✖
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={!file || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import { jsPDF } from "jspdf";
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const protectPDF = async () => {
//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       // Check if file is correctly uploaded
//       if (!file) {
//         throw new Error("No file selected.");
//       }

//       console.log("File selected:", file);

//       // Load the PDF using pdf-lib
//       const fileBytes = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(fileBytes);
//       console.log("PDF loaded successfully");

//       // Now that we have the pdfDoc, let's proceed with encryption
//       // Create a new PDF for jsPDF to encrypt
//       const pdfBytes = await pdfDoc.save();

//       // Create a PDF document using jsPDF to apply password protection
//       const protectedPdf = new jsPDF();

//       // Add pages from pdf-lib into jsPDF (in a simple way for testing)
//       const pageCount = pdfDoc.getPages().length;
//       console.log(`Adding ${pageCount} pages to jsPDF`);

//       for (let i = 0; i < pageCount; i++) {
//         const page = pdfDoc.getPages()[i];
//         protectedPdf.addPage();
//         protectedPdf.text(page.getTextContent().items.map(item => item.str).join(" "), 10, 10); // Just for text content
//       }

//       // Encrypt the PDF with password protection using jsPDF
//       protectedPdf.setEncryption(password, password, "owner", {
//         permissions: ["print", "modify", "copy", "annotate"],
//       });
//       console.log("Encryption applied successfully");

//       // Save the protected PDF
//       const protectedPdfBytes = protectedPdf.output("arraybuffer");
//       const blob = new Blob([protectedPdfBytes], { type: "application/pdf" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "protected.pdf";
//       link.click();
//       console.log("Download triggered for protected PDF");
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert(`Failed to protect the PDF: ${error.message || error}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {!file ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 <p>{(file.size / 1024).toFixed(2)} KB</p>
//                 <p>{file.name}</p>
//                 <button
//                   onClick={() => setFile(null)}
//                   className="remove-file-btn"
//                 >
//                   ✖
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={!file || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;

// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import Dropzone from "react-dropzone";
// import "./ProtectPDF.css";

// const ProtectPDF = () => {
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const protectPDF = async () => {
//     if (!password || !confirmPassword) {
//       alert("Please enter and confirm your password.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       // Check if file is correctly uploaded
//       if (!file) {
//         throw new Error("No file selected.");
//       }

//       console.log("File selected:", file);

//       // Load the PDF using pdf-lib
//       const fileBytes = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(fileBytes);
//       console.log("PDF loaded successfully");

//       // Apply password encryption using pdf-lib's .encrypt() method
//       // It is important that we handle encryption before saving the document
//       pdfDoc.encrypt({
//         userPassword: password,
//         ownerPassword: password,
//         permissions: {
//           printing: "highResolution",
//           copying: false,
//           modifying: false,
//           fillingForms: false,
//         },
//       });
//       console.log("PDF encrypted successfully");

//       // Save the protected PDF
//       const protectedBytes = await pdfDoc.save();
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(
//         new Blob([protectedBytes], { type: "application/pdf" })
//       );
//       link.download = "protected.pdf";
//       link.click();
//       console.log("Download triggered for protected PDF");
//     } catch (error) {
//       console.error("Error protecting the PDF:", error);
//       alert(`Failed to protect the PDF: ${error.message || error}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="protect-pdf-container">
//       <h2 className="title">Password Protect PDF</h2>
//       <div className="password-inputs">
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="password"
//           placeholder="Re-enter password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="input-field"
//         />
//       </div>
//       <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             {!file ? (
//               <div className="file-placeholder">
//                 <p className="add-files-text">Add Files</p>
//               </div>
//             ) : (
//               <div className="file-preview">
//                 <p>{(file.size / 1024).toFixed(2)} KB</p>
//                 <p>{file.name}</p>
//                 <button
//                   onClick={() => setFile(null)}
//                   className="remove-file-btn"
//                 >
//                   ✖
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </Dropzone>
//       <div className="actions">
//         <button className="select-pdf-btn">Select PDF</button>
//         <button
//           onClick={protectPDF}
//           className="protect-pdf-btn"
//           disabled={!file || !password || isProcessing}
//         >
//           {isProcessing ? "Processing..." : "Protect PDF"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProtectPDF;

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Dropzone from "react-dropzone";
import "./ProtectPDF.css";

const ProtectPDF = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const protectPDF = async () => {
    if (!password || !confirmPassword) {
      alert("Please enter and confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsProcessing(true);
    try {
      // Check if file is correctly uploaded
      if (!file) {
        throw new Error("No file selected.");
      }

      console.log("File selected:", file);

      // Create an instance of jsPDF
      const pdfDoc = new jsPDF();
      const fileBytes = await file.arrayBuffer();

      // Add the content from the uploaded PDF to the new jsPDF document
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const img = new Image();
        img.src = data;
        pdfDoc.addImage(img, "JPEG", 0, 0);
        pdfDoc.setPassword(password);

        // Protect the PDF by setting the password
        pdfDoc.setEncryption(password);
        const protectedPDF = pdfDoc.output("blob");

        // Download the protected PDF
        const link = document.createElement("a");
        link.href = URL.createObjectURL(protectedPDF);
        link.download = "protected.pdf";
        link.click();

        console.log("Download triggered for protected PDF");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error protecting the PDF:", error);
      alert(`Failed to protect the PDF: ${error.message || error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="protect-pdf-container">
      <h2 className="title">Password Protect PDF</h2>
      <div className="password-inputs">
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
        />
      </div>
      <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {!file ? (
              <div className="file-placeholder">
                <p className="add-files-text">Add Files</p>
              </div>
            ) : (
              <div className="file-preview">
                <p>{(file.size / 1024).toFixed(2)} KB</p>
                <p>{file.name}</p>
                <button
                  onClick={() => setFile(null)}
                  className="remove-file-btn"
                >
                  ✖
                </button>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      <div className="actions">
        <button className="select-pdf-btn">Select PDF</button>
        <button
          onClick={protectPDF}
          className="protect-pdf-btn"
          disabled={!file || !password || isProcessing}
        >
          {isProcessing ? "Processing..." : "Protect PDF"}
        </button>
      </div>
    </div>
  );
};

export default ProtectPDF;
