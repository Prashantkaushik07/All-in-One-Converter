import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";
import "./CompressPDF.css";
import { uploadApi } from "../../api/user_apiList";
import { API_BASE_URL } from "../../config/api.config";

const GUEST_MAX_UPLOADS = 5;

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const CompressPDF = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [compressedFile, setCompressedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [guestUploadsCount, setGuestUploadsCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const remainingGuestUploads = useMemo(
    () => Math.max(GUEST_MAX_UPLOADS - guestUploadsCount, 0),
    [guestUploadsCount]
  );

  const fetchGuestUploads = useCallback(async () => {
    if (isLoggedIn) return;

    try {
      const data = await uploadApi.getGuestUploads({ page: 1, limit: GUEST_MAX_UPLOADS });
      const uploads = data?.uploads || [];
      const total = data?.pagination?.total;
      setGuestUploadsCount(typeof total === "number" ? total : uploads.length);
    } catch (error) {
      console.error("Failed to fetch guest uploads:", error);
    }
  }, [isLoggedIn]);

  const fetchProcessedFiles = useCallback(async () => {
    if (!isLoggedIn) {
      setProcessedFiles([]);
      return;
    }

    setIsLoadingUploads(true);
    try {
      const data = await uploadApi.getMyUploads({ page: 1, limit: 50, status: "processed" });
      setProcessedFiles(data?.uploads || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load processed files.");
    } finally {
      setIsLoadingUploads(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchGuestUploads();
  }, [fetchGuestUploads]);

  useEffect(() => {
    if (activeTab === "processed") {
      fetchProcessedFiles();
    }
  }, [activeTab, fetchProcessedFiles]);

  const handleDrop = async (acceptedFiles) => {
    setErrorMessage("");
    setStatusMessage("");

    if (!acceptedFiles.length) {
      setErrorMessage("No valid file uploaded.");
      return;
    }

    if (!isLoggedIn && guestUploadsCount + acceptedFiles.length > GUEST_MAX_UPLOADS) {
      setErrorMessage(
        "Guest upload limit reached (max 5 files). Please login to upload more."
      );
      return;
    }

    const file = acceptedFiles[0];
    setSelectedFiles([file]);
    setOriginalSize(file.size);
    setIsProcessing(true);

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const pdfDoc = await PDFDocument.load(e.target.result);
        const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

        const compressedBlob = new Blob([pdfBytes], { type: "application/pdf" });
        setCompressedSize(pdfBytes.byteLength);
        setCompressedFile(compressedBlob);

        await handleUpload(file.name, compressedBlob);
      } catch (error) {
        console.error("Error compressing the file:", error);
        setErrorMessage("Failed to compress the file. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

<<<<<<< Updated upstream
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
=======
  const handleUpload = async (filename, fileBlob) => {
    setIsUploading(true);
    setErrorMessage("");

    try {
      const uploadFile = new File([fileBlob], filename, { type: "application/pdf" });
      const data = await uploadApi.uploadFiles([uploadFile]);
      setStatusMessage(data?.message || "File uploaded successfully.");

      if (isLoggedIn) {
        await fetchProcessedFiles();
        setActiveTab("processed");
      } else {
        await fetchGuestUploads();
      }
    } catch (error) {
      const backendMessage =
        error?.data?.message ||
        error?.data?.error ||
        error.message ||
        "Upload failed. Please try again.";
      setErrorMessage(backendMessage);
    } finally {
      setIsUploading(false);
    }
>>>>>>> Stashed changes
  };

  const downloadCompressedFile = () => {
    if (!compressedFile) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(compressedFile);
    link.download = "compressed.pdf";
    link.click();
  };

  const handleDownloadProcessed = async (upload) => {
    const uploadId = upload?._id || upload?.id;
    if (!uploadId) return;

    try {
      const response = await fetch(`${API_BASE_URL}${uploadApi.getDownloadUrl(uploadId)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = "Failed to download file";
        try {
          const errorData = await response.json();
          message = errorData?.message || message;
        } catch (_err) {
          // no-op
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = upload.originalName || upload.fileName || "download";
      anchor.click();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setErrorMessage(error.message || "Failed to download file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white border border-gray-300 shadow-lg rounded-md w-full max-w-4xl p-6">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("upload")}
            type="button"
          >
            Upload
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "processed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("processed")}
            type="button"
          >
            Processed Files
          </button>
        </div>

        {errorMessage && <p className="text-sm text-red-600 mb-3">{errorMessage}</p>}
        {statusMessage && <p className="text-sm text-green-600 mb-3">{statusMessage}</p>}

        {activeTab === "upload" && (
          <>
            <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Compress PDF</h2>

            {!isLoggedIn && (
              <p className="text-sm text-gray-600 text-center mb-4">
                Guest uploads remaining: {remainingGuestUploads} / {GUEST_MAX_UPLOADS}
              </p>
            )}

            <Dropzone
              onDrop={handleDrop}
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={isLoggedIn ? 20 : Math.max(remainingGuestUploads, 1)}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-md h-36 flex flex-col items-center justify-center text-center text-gray-600 cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-sm">Drop PDF file here or</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded" type="button">
                    Select PDF
                  </button>
                </div>
              )}
            </Dropzone>

            {selectedFiles[0] && (
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600">File selected: {selectedFiles[0].name}</p>
                <p className="text-sm text-gray-600">Original size: {(originalSize / 1024).toFixed(2)} KB</p>
              </div>
            )}

            {(isProcessing || isUploading) && (
              <div className="mt-4 text-center">
                <p className="text-sm text-blue-500">{isProcessing ? "Processing..." : "Uploading..."}</p>
              </div>
            )}

            {compressedFile && (
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600">Compressed size: {(compressedSize / 1024).toFixed(2)} KB</p>
                <button
                  onClick={downloadCompressedFile}
                  className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded"
                  type="button"
                >
                  Download Compressed PDF
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "processed" && (
          <div>
            {!isLoggedIn ? (
              <p className="text-sm text-gray-600">Login to view your processed files.</p>
            ) : isLoadingUploads ? (
              <p className="text-sm text-gray-600">Loading processed files...</p>
            ) : processedFiles.length === 0 ? (
              <p className="text-sm text-gray-600">No processed files yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-2">Filename</th>
                      <th className="border-b p-2">Type</th>
                      <th className="border-b p-2">Size</th>
                      <th className="border-b p-2">Uploaded</th>
                      <th className="border-b p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedFiles.map((item) => {
                      const uploadId = item._id || item.id;
                      return (
                        <tr key={uploadId}>
                          <td className="border-b p-2">{item.originalName || item.fileName}</td>
                          <td className="border-b p-2">{item.mimeType || "-"}</td>
                          <td className="border-b p-2">{formatBytes(item.size)}</td>
                          <td className="border-b p-2">{new Date(item.createdAt).toLocaleString()}</td>
                          <td className="border-b p-2">
                            <button
                              type="button"
                              className="px-3 py-1 bg-blue-600 text-white rounded"
                              onClick={() => handleDownloadProcessed(item)}
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">Your files are secure.</p>
    </div>
  );
};

export default CompressPDF;
