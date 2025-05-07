/* eslint-disable jsx-a11y/anchor-is-valid */
// Navbar.js
import React, { useState } from "react";
import "./Navbar.css";
import {
  FaFilePdf,
  FaImage,
  FaFileWord,
  FaFilePowerpoint,
  FaFileExcel,
  FaLock,
  FaShieldAlt,
  FaCompress,
  FaCrop,
  FaRegEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="navbar">
      <div
        className="navbar-brand"
        onClick={() => handleNavigation("/")}
        style={{ cursor: "pointer" }}
      >
        All in One
      </div>
      <ul className="menu">
        <li
          className="menu-item"
          onMouseEnter={() => handleDropdown("pdfTools")}
          onMouseLeave={() => handleDropdown(null)}
        >
          <button>PDF Tools ▾</button>
          {openDropdown === "pdfTools" && (
            <div className="dropdown-content">
              <div className="column">
                <h4>OPTIMIZE PDF</h4>
                <p onClick={() => handleNavigation("/compress-pdf")}>
                  <FaCompress /> Compress PDF
                </p>
              </div>
              <div className="column">
                <h4>MERGE & SPLIT</h4>
                <p onClick={() => handleNavigation("/merge-pdf")}>
                  {" "}
                  <FaFilePdf /> Merge PDF
                </p>
                <p onClick={() => handleNavigation("/merge-pdf-image")}>
                  {" "}
                  <FaFilePdf /> Merge PDF and Image
                </p>
                <p onClick={() => handleNavigation("/split-pdf")}>
                  {" "}
                  <FaFilePdf /> Split PDF
                </p>
              </div>
              <div className="column">
                <h4>VIEW & EDIT</h4>
                <p onClick={() => handleNavigation("/crop-pdf")}>
                  {" "}
                  <FaCrop /> Crop PDF Page
                </p>
                <p onClick={() => handleNavigation("/organize-pdf")}>
                  {" "}
                  <FaRegEdit /> Organize PDF
                </p>
                <p onClick={() => handleNavigation("/rotate-pdf")}>
                  {" "}
                  <FaRegEdit /> Rotate PDF
                </p>
                <p onClick={() => handleNavigation("/remove-pages")}>
                  {" "}
                  <FaRegEdit /> Remove PDF Pages
                </p>
              </div>
              <div className="column">
                <h4>CONVERT TO PDF</h4>
                <p onClick={() => handleNavigation("/image-to-pdf")}>
                  {" "}
                  <FaImage /> Image to PDF
                </p>
                <p onClick={() => handleNavigation("/jpg-to-pdf")}>
                  {" "}
                  <FaImage /> JPG to PDF
                </p>
              </div>
              <div className="column">
                <h4>CONVERT FROM PDF</h4>
                <p onClick={() => handleNavigation("/pdf-to-image")}>
                  {" "}
                  <FaImage /> PDF to Image
                </p>
                <p onClick={() => handleNavigation("/pdf-to-jpg")}>
                  {" "}
                  <FaImage /> PDF to JPG
                </p>
              </div>
              <div className="column">
                <h4>CONVERT TO PDF</h4>
                <p onClick={() => handleNavigation("/word-to-pdf")}>
                  {" "}
                  <FaFileWord /> Word to PDF
                </p>
                <p onClick={() => handleNavigation("/powerpoint-to-pdf")}>
                  {" "}
                  <FaFilePowerpoint /> PowerPoint to PDF
                </p>
                <p onClick={() => handleNavigation("/excel-to-pdf")}>
                  {" "}
                  <FaFileExcel /> Excel to PDF
                </p>
              </div>
              <div className="column">
                <h4>CONVERT FROM PDF</h4>
                <p onClick={() => handleNavigation("/pdf-to-word")}>
                  {" "}
                  <FaFileWord /> PDF to Word
                </p>
                <p onClick={() => handleNavigation("/pdf-to-powerpoint")}>
                  {" "}
                  <FaFilePowerpoint /> PDF to PowerPoint
                </p>
                <p onClick={() => handleNavigation("/pdf-to-excel")}>
                  {" "}
                  <FaFileExcel /> PDF to Excel
                </p>
              </div>
              <div className="column">
                <h4>PDF SECURITY</h4>
                <p onClick={() => handleNavigation("/unlock-pdf")}>
                  {" "}
                  <FaLock /> Unlock PDF
                </p>
                <p onClick={() => handleNavigation("/protect-pdf")}>
                  {" "}
                  <FaShieldAlt /> Protect PDF
                </p>
              </div>
            </div>
          )}
        </li>
        <li
          className="menu-item"
          onMouseEnter={() => handleDropdown("imageTools")}
          onMouseLeave={() => handleDropdown(null)}
        >
          <button>Image Tools ▾</button>
          {openDropdown === "imageTools" && (
            <div className="dropdown-content"></div>
          )}
        </li>
        <li
          className="menu-item"
          onMouseEnter={() => handleDropdown("converterTools")}
          onMouseLeave={() => handleDropdown(null)}
        >
          <button>Converter Tools ▾</button>
          {openDropdown === "converterTools" && (
            <div className="dropdown-content"></div>
          )}
        </li>
        <li
          className="menu-item"
          onMouseEnter={() => handleDropdown("securityTools")}
          onMouseLeave={() => handleDropdown(null)}
        >
          <button>Security Tools ▾</button>
          {openDropdown === "securityTools" && (
            <div className="dropdown-content"></div>
          )}
        </li>
      </ul>
      <div
        className="z__help_cr tooltip tooltip--bottom"
        data-tooltip="Help Center"
      >
        <a href="#">Help</a>
      </div>
      <div className="auth-buttons">
        <a href="#" className="z__login_btn">
          Log in
        </a>
        <a href="#" className="z__signup_btn">
          Sign up
        </a>
      </div>
    </div>
  );
};

export default Navbar;
