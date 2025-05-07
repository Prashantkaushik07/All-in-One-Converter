import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import AppNavbar from "./Components/Navbar";
import HomeTop from "./Components/HomeTop";
import Footer from "./Components/Footer";
import Features from "./Components/Features";
import UploadPDF from "./Components/UploadPDF";
import ConvertPDF from "./Components/ConvertPDF";
import ImageToPDF from "./Components/ImageToPDF";
import ToolGrid from "./Components/ToolGrid"; // Import ToolGrid component
import WhySection from "./Components/WhySection";
import JoinUsSection from "./Components/JoinUsSection";
import InfoSection from "./Components/Infosection";

// Lazy load other components/pages for improved performance
const CompressPDF = React.lazy(() => import("./Pages/CompressPDF"));
const MergePDF = React.lazy(() => import("./Pages/MergePDF"));
const SplitPDF = React.lazy(() => import("./Pages/SplitPDF"));
const ResizeImage = React.lazy(() => import("./Pages/ResizeImage"));
const ProtectPDF = React.lazy(() => import("./Pages/ProtectPDF"));
const CompressImage = React.lazy(() => import("./Components/CompressImage"));
const CompressJPG = React.lazy(() => import("./Components/CompressJPG"));
const CompressPNG = React.lazy(() => import("./Components/CompressPNG"));
const CompressJPEG = React.lazy(() => import("./Components/CompressJPEG"));
const CompressWEBP = React.lazy(() => import("./Components/CompressWEBP"));
const CompressHEIC = React.lazy(() => import("./Components/CompressHEIC"));
const CompressBMP = React.lazy(() => import("./Components/CompressBMP"));

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
                  <ToolGrid /> {/* Add ToolGrid component here */}
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
