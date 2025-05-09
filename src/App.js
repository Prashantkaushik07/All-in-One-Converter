import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import AppNavbar from "./Components/Navbar";
import HomeTop from "./Components/HomeTop";
import Footer from "./Components/Footer";
import Features from "./Components/Features/Features"; // Updated path for Features
import UploadPDF from "./Components/PDFTools/UploadPDF"; // Updated path for UploadPDF
import ConvertPDF from "./Components/PDFTools/ConvertPDF"; // Updated path for ConvertPDF
import ImageToPDF from "./Components/PDFTools/ImageToPDF"; // Updated path for ImageToPDF
import ToolGrid from "./Components/Home/ToolGrid"; // Updated path for ToolGrid
import WhySection from "./Components/Home/WhySection"; // Updated path for WhySection
import JoinUsSection from "./Components/Home/JoinUsSection"; // Updated path for JoinUsSection
import InfoSection from "./Components/Home/InfoSection"; // Updated path for InfoSection

// Lazy load other components/pages for improved performance
const CompressPDF = React.lazy(() => import("./Components/PDFTools/CompressPDF")); // Updated path
const MergePDF = React.lazy(() => import("./Components/PDFTools/MergePDF")); // Updated path
const SplitPDF = React.lazy(() => import("./Components/PDFTools/SplitPDF")); // Updated path
const ResizeImage = React.lazy(() => import("./Components/ImageTools/ResizeImage")); // Updated path
const ProtectPDF = React.lazy(() => import("./Components/PDFTools/ProtectPDF")); // Updated path
const CompressImage = React.lazy(() => import("./Components/ImageTools/CompressImage")); // Updated path
const CompressJPG = React.lazy(() => import("./Components/ImageTools/CompressJPG")); // Updated path
const CompressPNG = React.lazy(() => import("./Components/ImageTools/CompressPNG")); // Updated path
const CompressJPEG = React.lazy(() => import("./Components/ImageTools/CompressJPEG")); // Updated path
const CompressWEBP = React.lazy(() => import("./Components/ImageTools/CompressWEBP")); // Updated path
const CompressHEIC = React.lazy(() => import("./Components/ImageTools/CompressHEIC")); // Updated path
const CompressBMP = React.lazy(() => import("./Components/ImageTools/CompressBMP")); // Updated path

function App() {
  return (
    <Router>
      <div className="App">
        <AppNavbar />
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Home Route */}
            <Route
              path="/"
              element={
                <>
                  <HomeTop />
                  <Footer />
                  <ToolGrid />
                  <Features />
                  <WhySection />
                  <JoinUsSection />
                  <InfoSection />
                </>
              }
            />

            {/* PDF Upload and Conversion */}
            <Route path="/upload-pdf" element={<UploadPDF />} />
            <Route path="/convert-pdf" element={<ConvertPDF />} />

            {/* PDF Tools */}
            <Route path="/image-to-pdf" element={<ImageToPDF />} />
            <Route path="/compress-pdf" element={<CompressPDF />} />
            <Route path="/merge-pdf" element={<MergePDF />} />
            <Route path="/split-pdf" element={<SplitPDF />} />
            <Route path="/resize-image" element={<ResizeImage />} />
            <Route path="/protect-pdf" element={<ProtectPDF />} />

            {/* Image Tools */}
            <Route path="/compress-image" element={<CompressImage />} />
            <Route path="/compress-jpg" element={<CompressJPG />} />
            <Route path="/compress-png" element={<CompressPNG />} />
            <Route path="/compress-jpeg" element={<CompressJPEG />} />
            <Route path="/compress-webp" element={<CompressWEBP />} />
            <Route path="/compress-heic" element={<CompressHEIC />} />
            <Route path="/compress-bmp" element={<CompressBMP />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
