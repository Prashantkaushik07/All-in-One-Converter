// ✅ App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Context & Utilities
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

// Layout Components
import AppNavbar from "./Components/Layout/Navbar";
import Footer from "./Components/Footer/Footer";

// Home Page Sections
import HomeTop from "./Components/Header/HomeTop";
import ToolGrid from "./Components/Layout/ToolGrid";
import Features from "./Components/Features/Features";
import WhySection from "./Components/Sections/WhySection";
import JoinUsSection from "./Components/Sections/JoinUsSection";
import InfoSection from "./Components/Info/Infosection";

// Authentication & Dashboard
import LoginPage from "./Components/Auth/LoginPage";
import SignupPage from "./Components/Auth/SignupPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import AccountPage from "./Components/Account/AccountPage";
import VerifyEmailModal from "./Components/Auth/VerifyEmailModal";

// PDF Tools (eager-loaded)
import UploadPDF from "./Components/PDFConversion/UploadPDF";
import ConvertPDF from "./Components/PDFConversion/ConvertPDF";
import ImageToPDF from "./Components/PDFConversion/ImageToPDF";

// PDF & Image Tools (lazy-loaded)
const CompressPDF = React.lazy(() => import("./Components/PDFTools/CompressPDF"));
const MergePDF = React.lazy(() => import("./Components/PDFTools/MergePDF"));
const SplitPDF = React.lazy(() => import("./Components/PDFTools/SplitPDF"));
const ResizeImage = React.lazy(() => import("./Components/PDFTools/ResizeImage"));
const ProtectPDF = React.lazy(() => import("./Components/PDFTools/ProtectPDF"));
const MergePDFandImage = React.lazy(() => import("./Components/PDFTools/MergePDFandImage"));
const ImageTools = React.lazy(() => import("./Components/Tools/ImageTools"));
const BarcodeGenerator = React.lazy(() => import("./Components/Tools/BarcodeGenerator"));

// Image Compression Tools
const CompressImage = React.lazy(() => import("./Components/ImageCompression/CompressImage"));
const CompressJPG = React.lazy(() => import("./Components/ImageCompression/CompressJPG"));
const CompressPNG = React.lazy(() => import("./Components/ImageCompression/CompressPNG"));
const CompressJPEG = React.lazy(() => import("./Components/ImageCompression/CompressJPEG"));
const CompressWEBP = React.lazy(() => import("./Components/ImageCompression/CompressWEBP"));
const CompressHEIC = React.lazy(() => import("./Components/ImageCompression/CompressHEIC"));
const CompressBMP = React.lazy(() => import("./Components/ImageCompression/CompressBMP"));

function App() {
  return (
    <GoogleOAuthProvider clientId="270039151432-5m4vtear3he11983fd2qo5slcibsqf4e.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <div className="App">
            <AppNavbar />
            <React.Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {/* Home */}
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

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-email" element={<VerifyEmailModal />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />

                {/* PDF Tools */}
                <Route path="/upload-pdf" element={<UploadPDF />} />
                <Route path="/convert-pdf" element={<ConvertPDF />} />
                <Route path="/image-to-pdf" element={<ImageToPDF />} />
                <Route path="/compress-pdf" element={<CompressPDF />} />
                <Route path="/merge-pdf" element={<MergePDF />} />
                <Route path="/split-pdf" element={<SplitPDF />} />
                <Route path="/resize-image" element={<ResizeImage />} />
                <Route path="/protect-pdf" element={<ProtectPDF />} />
                <Route path="/merge-pdf-image" element={<MergePDFandImage />} />

                {/* Image Tools */}
                <Route path="/image-tools" element={<ImageTools />} />
                <Route path="/compress-image" element={<CompressImage />} />
                <Route path="/compress-jpg" element={<CompressJPG />} />
                <Route path="/compress-png" element={<CompressPNG />} />
                <Route path="/compress-jpeg" element={<CompressJPEG />} />
                <Route path="/compress-webp" element={<CompressWEBP />} />
                <Route path="/compress-heic" element={<CompressHEIC />} />
                <Route path="/compress-bmp" element={<CompressBMP />} />
                <Route path="/barcode-generator" element={<BarcodeGenerator />} />
              </Routes>
            </React.Suspense>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
