import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

<<<<<<< Updated upstream
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
=======
// Context & Utilities
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import AdminRoute from "./utils/AdminRoute";

// Layout Components
import AppNavbar from "./Components/Layout/Navbar";
import Footer from "./Components/Footer/Footer";
import VideoConverter from "./Components/Convert/VideoConverter";// Adjust path if needed
// import ShoppingCart from './Components/Shopping/ShoppingCart';
// import { CartProvider } from './Components/Shopping/CartContext';
// import ProductList from './Components/Shopping/ProductList';
// import CartPopup from './Components/Shopping/CartPopup';
// import ViewCartButton from './Components/Shopping/ViewCartButton';

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
import AdminUsersPage from "./Components/Admin/AdminUsersPage";
import AdminUserUploadsPage from "./Components/Admin/AdminUserUploadsPage";

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
                      <VideoConverter />
                      {/* <ShoppingCart /> */}
                      {/* <CartProvider>
                        <div style={{ padding: '20px' }}>
                          <h1>🛍️ My Shop</h1>
                          <ProductList />
                          <CartPopup />
                          <ViewCartButton />
                        </div>
                      </CartProvider> */}
                    </>
                  }
                />
>>>>>>> Stashed changes

            {/* PDF Upload and Conversion */}
            <Route path="/upload-pdf" element={<UploadPDF />} />
            <Route path="/convert-pdf" element={<ConvertPDF />} />

<<<<<<< Updated upstream
            {/* PDF Tools */}
            <Route path="/image-to-pdf" element={<ImageToPDF />} />
            <Route path="/compress-pdf" element={<CompressPDF />} />
            <Route path="/merge-pdf" element={<MergePDF />} />
            <Route path="/split-pdf" element={<SplitPDF />} />
            <Route path="/resize-image" element={<ResizeImage />} />
            <Route path="/protect-pdf" element={<ProtectPDF />} />
=======
                {/* Protected Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                <Route path="/admin/users/:userId" element={<AdminRoute><AdminUserUploadsPage /></AdminRoute>} />
>>>>>>> Stashed changes

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
