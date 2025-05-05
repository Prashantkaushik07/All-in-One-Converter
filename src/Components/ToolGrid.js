import React from "react";
import "./ToolGrid.css";

const tools = [
  {
    title: "Compress PDF",
    description: "Best tool to compress PDF size accordingly using slider.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M24,20V4.1a3.62,3.62,0,0,0-1.25-2.85A3.68,3.68,0,0,0,20,0H4.05A3.74,3.74,0,0,0,1.2,1.25,3.8,3.8,0,0,0,0,4.1V20a4,4,0,0,0,1.2,2.9A3.86,3.86,0,0,0,4.05,24H20A4,4,0,0,0,24,20Z"></path>
        <path
          d="M6.65,9.2V6c0-.91.44-1.37,1.25-1.37h7.45l2,2.3V9.15m0,5.4V18.1c0,.93-.43,1.4-1.3,1.4H7.9c-.83,0-1.25-.47-1.25-1.4V14.6"
          style={{
            fill: "none",
            stroke: "#fff",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.25px",
          }}
        ></path>
      </svg>
    ),
    link: "/compress-pdf",
  },
  {
    title: "Merge PDF",
    description:
      "Merge multiple PDF files into a single PDF. You can also rearrange PDF files accordingly.",
    icon: "/icons/merge-pdf.svg",
    link: "/merge-pdf",
  },
  {
    title: "Split PDF",
    description:
      "Split pages into fixed range or by giving range of pages from PDF accordingly.",
    icon: "/icons/split-pdf.svg",
    link: "/split-pdf",
  },
  // Add more tools here...
];

const ToolGrid = () => {
  return (
    <div className="page-content">
      <div className="tool-grid">
        {tools.map((tool, index) => (
          <div className="tool-box" key={index}>
            <a href={tool.link} className="tool-link">
              <img src={tool.icon} alt={tool.title} className="tool-icon" />
              <h4>{tool.title}</h4>
              <p>{tool.description}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;
