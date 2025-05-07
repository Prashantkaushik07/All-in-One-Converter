import React, { useState } from "react";
import "./PDFToolsDropdown.css";

const PDFToolsDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const tools = [
    {
      category: "Optimize PDF",
      items: [{ name: "Compress PDF", icon: "compress.png", link: "#" }],
    },
    {
      category: "Merge & Split",
      items: [
        { name: "Merge PDF", icon: "merge.png", link: "#" },
        { name: "Merge PDF and Image", icon: "merge-image.png", link: "#" },
        { name: "Split PDF", icon: "split.png", link: "#" },
      ],
    },
    {
      category: "View & Edit",
      items: [
        { name: "Crop PDF Page", icon: "crop.png", link: "#" },
        { name: "Organize PDF", icon: "organize.png", link: "#" },
        { name: "Rotate PDF", icon: "rotate.png", link: "#" },
        { name: "Remove PDF Pages", icon: "remove.png", link: "#" },
        { name: "Extract PDF", icon: "extract.png", link: "#" },
        { name: "Extract Images", icon: "extract-image.png", link: "#" },
        { name: "Add Page Number", icon: "add-number.png", link: "#" },
        { name: "Add Watermark", icon: "watermark.png", link: "#" },
      ],
    },
    {
      category: "Convert to PDF",
      items: [
        { name: "Image to PDF", icon: "image-to-pdf.png", link: "#" },
        { name: "JPG to PDF", icon: "jpg-to-pdf.png", link: "#" },
        { name: "Word to PDF", icon: "word-to-pdf.png", link: "#" },
        { name: "Powerpoint to PDF", icon: "ppt-to-pdf.png", link: "#" },
        { name: "Excel to PDF", icon: "excel-to-pdf.png", link: "#" },
        { name: "Text to PDF", icon: "text-to-pdf.png", link: "#" },
      ],
    },
    {
      category: "Convert from PDF",
      items: [
        { name: "PDF to Image", icon: "pdf-to-image.png", link: "#" },
        { name: "PDF to JPG", icon: "pdf-to-jpg.png", link: "#" },
        { name: "PDF to Word", icon: "pdf-to-word.png", link: "#" },
        { name: "PDF to Powerpoint", icon: "pdf-to-ppt.png", link: "#" },
        { name: "PDF to Excel", icon: "pdf-to-excel.png", link: "#" },
        { name: "PDF to Text", icon: "pdf-to-text.png", link: "#" },
      ],
    },
    {
      category: "PDF Security",
      items: [
        { name: "Unlock PDF", icon: "unlock.png", link: "#" },
        { name: "Protect PDF", icon: "protect.png", link: "#" },
      ],
    },
  ];

  return (
    <div className="pdf-tools-dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        PDF Tools
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <ul className="dropdown-categories">
            {tools.map((toolCategory, index) => (
              <li key={index} className="dropdown-category">
                <div className="category-title">{toolCategory.category}</div>
                <ul className="category-tools">
                  {toolCategory.items.map((tool, idx) => (
                    <li key={idx} className="tool-item">
                      <a href={tool.link}>
                        <img
                          src={tool.icon}
                          alt={tool.name}
                          className="tool-icon"
                        />
                        {tool.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PDFToolsDropdown;
