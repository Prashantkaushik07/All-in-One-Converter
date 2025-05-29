// src/Components/Layout/ToolGrid.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ToolGrid.css";

import {
  CompressIcon,
  MergeIcon,
  MergeImageIcon,
  SplitIcon,
  CropIcon,
  // OrganizeIcon,
  // RotateIcon,
  RemoveIcon,
  ExtractPdfIcon,
  ExtractImgIcon,
  PageNumberIcon,
  WatermarkIcon,
} from "../icons/PDFIcons";

const tools = [
  // PDFTools Folder
  {
    title: "Compress PDF",
    description: "Compress PDF size accordingly using slider.",
    icon: <CompressIcon />,
    link: "/compress-pdf",
  },
  {
    title: "Merge PDF",
    description: "Merge multiple PDF files into a single PDF.",
    icon: <MergeIcon />,
    link: "/merge-pdf",
  },
  {
    title: "Merge PDF and Image",
    description: "Merge PDFs and images into one PDF.",
    icon: <MergeImageIcon />,
    link: "/merge-pdf-image",
  },
  {
    title: "Split PDF",
    description: "Split PDF pages by range or manually.",
    icon: <SplitIcon />,
    link: "/split-pdf",
  },
  {
    title: "Protect PDF",
    description: "Add password protection to your PDF files.",
    icon: <RemoveIcon />,
    link: "/protect-pdf",
  },
  {
    title: "Resize Image",
    description: "Resize images for PDF optimization.",
    icon: <CropIcon />,
    link: "/resize-image",
  },

  // PDFConversion Folder
  {
    title: "Convert PDF",
    description: "Convert different file types to PDF.",
    icon: <ExtractPdfIcon />,
    link: "/convert-pdf",
  },
  {
    title: "Image to PDF",
    description: "Convert image files to a single PDF.",
    icon: <ExtractImgIcon />,
    link: "/image-to-pdf",
  },
  {
    title: "Upload PDF",
    description: "Upload and preview your PDF file.",
    icon: <PageNumberIcon />,
    link: "/upload-pdf",
  },

  // Tools Folder (Image Tools)
  {
    title: "Image Tools",
    description: "Compress, resize, or optimize images.",
    icon: <WatermarkIcon />,
    link: "/image-tools",
  },
  {
  title: "Merge PDF and Image",
  description: "Merge PDFs and Images into a PDF file.",
  icon: <MergeImageIcon />,
  link: "/merge-pdf-image",
},
{
  title: "Image Tools",
  description: "Compress, resize or manage images online.",
  icon: <WatermarkIcon />,
  link: "/image-tools",
},
 {
    title: "GIF Maker",
    description: "You can select multiple images to make a GIF.",
    icon: <span className="tool-icon-text">GIF</span>,
    link: "/gif-maker",
  },
  {
    title: "GIF to Images",
    description: "You can split a GIF File into multiple images.",
    icon: <span className="tool-icon-text">GIF</span>,
    link: "/gif-to-images",
  },
  {
    title: "ZIP Maker",
    description: "You can select multiple files to create a ZIP file.",
    icon: <span className="tool-icon-text">📄</span>,
    link: "/zip-maker",
  },
  {
    title: "ZIP Extractor",
    description: "The best way to extract ZIP file online.",
    icon: <span className="tool-icon-text">📄</span>,
    link: "/zip-extractor",
  },
  {
    title: "Barcode Generator",
    description: "You can generate barcode by entering text and download barcode.",
    icon: <span className="tool-icon-text">🏷️</span>,
    link: "/barcode-generator",
  },
  {
    title: "Password Generator",
    description: "You can easily generate random password with its strength.",
    icon: <span className="tool-icon-text">🔒</span>,
    link: "/password-generator",
  },
  {
    title: "Image to Color",
    description: "You can easily extract all the colors from image.",
    icon: <span className="tool-icon-text">🎨</span>,
    link: "/image-to-color",
  },
  {
    title: "Color Extractor",
    description: "You can simply extract color from any image.",
    icon: <span className="tool-icon-text">🎨</span>,
    link: "/color-extractor",
  },
];

const ToolGrid = () => {
  const navigate = useNavigate();
  return (
    <div className="tool-container">
      {tools.map((tool, index) => (
        <div
          className="tool-card"
          key={index}
          onClick={() => navigate(tool.link)}
          style={{ cursor: "pointer" }}
        >
          <div className="tool-icon">{tool.icon}</div>
          <h4 className="tool-title">{tool.title}</h4>
          <p className="tool-description">{tool.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ToolGrid;