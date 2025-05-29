import React from "react";
import { Dropdown } from "react-bootstrap";
import {
  CompressIcon,
  MergeIcon,
  MergeImageIcon,
  SplitIcon,
  CropIcon,
  OrganizeIcon,
  RotateIcon,
  RemoveIcon,
  ExtractPdfIcon,
  ExtractImgIcon,
  PageNumberIcon,
  WatermarkIcon,
  // UnlockIcon,
  // ProtectIcon,
  // ImageToPdfIcon,
  // JpgToPdfIcon,
  // WordToPdfIcon,
  // PptToPdfIcon,
  // ExcelToPdfIcon,
  // TextToPdfIcon,
  // PdfToImageIcon,
  // PdfToJpgIcon,
  // PdfToWordIcon,
  // PdfToPptIcon,
  // PdfToExcelIcon,
  // PdfToTextIcon,
} from "../icons/PDFIcons";
import "./DropdownMenu.css";

const groupedTools = {
  "PDF Tools": {
    "OPTIMIZE PDF": [
      { name: "Compress PDF", link: "/compress-pdf", icon: <CompressIcon /> },
    ],
    "MERGE & SPLIT": [
      { name: "Merge PDF", link: "/merge-pdf", icon: <MergeIcon /> },
      { name: "Merge PDF and Image", link: "/merge-pdf-image", icon: <MergeImageIcon /> },
      { name: "Split PDF", link: "/split-pdf", icon: <SplitIcon /> },
    ],
    "VIEW & EDIT": [
      { name: "Crop PDF Page", link: "/crop-pdf", icon: <CropIcon /> },
      { name: "Organize PDF", link: "/organize-pdf", icon: <OrganizeIcon /> },
      { name: "Rotate PDF", link: "/rotate-pdf", icon: <RotateIcon /> },
      { name: "Remove PDF Pages", link: "/remove-pages", icon: <RemoveIcon /> },
      { name: "Extract PDF", link: "/extract-pdf", icon: <ExtractPdfIcon /> },
      { name: "Extract Images", link: "/extract-images", icon: <ExtractImgIcon /> },
      { name: "Add Page Number", link: "/add-page-number", icon: <PageNumberIcon /> },
      { name: "Add Watermark", link: "/add-watermark", icon: <WatermarkIcon /> },
    ],
    "PDF SECURITY": [
      // { name: "Unlock PDF", link: "/unlock-pdf", icon: <UnlockIcon /> },
      // { name: "Protect PDF", link: "/protect-pdf", icon: <ProtectIcon /> },
    ],
  },
  "Image Tools": {},
  "Converter Tools": {
    "CONVERT TO PDF": [
      // { name: "Image to PDF", link: "/image-to-pdf", icon: <ImageToPdfIcon /> },
      // { name: "JPG to PDF", link: "/jpg-to-pdf", icon: <JpgToPdfIcon /> },
      // { name: "Word to PDF", link: "/word-to-pdf", icon: <WordToPdfIcon /> },
      // { name: "Powerpoint to PDF", link: "/powerpoint-to-pdf", icon: <PptToPdfIcon /> },
      // { name: "Excel to PDF", link: "/excel-to-pdf", icon: <ExcelToPdfIcon /> },
      // { name: "Text to PDF", link: "/text-to-pdf", icon: <TextToPdfIcon /> },
    ],
    "CONVERT FROM PDF": [
      // { name: "PDF to Image", link: "/pdf-to-image", icon: <PdfToImageIcon /> },
      // { name: "PDF to JPG", link: "/pdf-to-jpg", icon: <PdfToJpgIcon /> },
      // { name: "PDF to Word", link: "/pdf-to-word", icon: <PdfToWordIcon /> },
      // { name: "PDF to Powerpoint", link: "/pdf-to-powerpoint", icon: <PdfToPptIcon /> },
      // { name: "PDF to Excel", link: "/pdf-to-excel", icon: <PdfToExcelIcon /> },
      // { name: "PDF to Text", link: "/pdf-to-text", icon: <PdfToTextIcon /> },
    ],
  },
};

const DropdownMenu = ({ title }) => {
  const sections = groupedTools[title];
  if (!sections) return null;

  return (
    <Dropdown className="custom-dropdown">
      <Dropdown.Toggle
        variant="link"
        id={`dropdown-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="dropdown-toggle"
      >
        {title}
      </Dropdown.Toggle>

      <Dropdown.Menu className="multi-column-menu">
        <div className="dropdown-grid">
          {Object.entries(sections).map(([section, items], idx) => (
            <div key={idx} className="dropdown-section">
              <h6 className="dropdown-header">{section}</h6>
              {items.map((item, i) => (
                <a key={i} className="dropdown-item" href={item.link}>
                  <span className="icon-wrap">{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </div>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;
