// BarcodeGenerator.jsx
import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import "./BarcodeGenerator.css";

const BarcodeGenerator = () => {
  const canvasRef = useRef(null);
  const [text, setText] = useState("12345609");
  const [format, setFormat] = useState("MSI");
  const [showText, setShowText] = useState(true);
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(100);
  const [margin, setMargin] = useState(10);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (canvasRef.current) {
      JsBarcode(canvasRef.current, text, {
        format,
        lineColor: "#000000",
        width: barWidth,
        height: barHeight,
        displayValue: showText,
        margin,
        fontOptions: "bold",
        font: "monospace",
        fontSize,
        textAlign: "center",
        background: "#ffffff",
      });
    }
  }, [text, format, showText, barWidth, barHeight, margin, fontSize]);

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "barcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
  <div className="container">
    <h1>Barcode Generator</h1>
    <div className="main-grid">
      <div className="barcode-preview">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div className="controls">
        <label>Barcode Text</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />

        <label>Barcode Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="MSI">MSI1110</option>
          <option value="CODE128">CODE128</option>
          <option value="EAN13">EAN13</option>
        </select>

        <div className="toggle">
          <input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} />
          <label>Show Text</label>
        </div>

        <label>Bar Width</label>
        <input type="range" min="1" max="5" value={barWidth} onChange={(e) => setBarWidth(Number(e.target.value))} />

        <label>Bar Height</label>
        <input type="range" min="50" max="200" value={barHeight} onChange={(e) => setBarHeight(Number(e.target.value))} />

        <label>Margin</label>
        <input type="range" min="0" max="30" value={margin} onChange={(e) => setMargin(Number(e.target.value))} />

        <label>Font Size</label>
        <input type="range" min="10" max="30" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />

        <button className="cc" onClick={downloadBarcode}>⬇ Download</button>
      </div>
    </div>
  </div>
);

};

export default BarcodeGenerator;
