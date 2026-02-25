import React from "react";
import OptimizeImage from "../ImageCompression/OptimizeImage";
// import ConvertImage from "./ConvertImage";
// import EditImage from "./EditImage";
import "./ImageTools.css";

const ImageTools = () => {
  return (
    <div className="image-tools-container">
      <h2 className="text-center">Image Tools</h2>
      <div className="row">
        <div className="col-md-4">
          <OptimizeImage />
        </div>
        {/* <div className="col-md-4">
          <ConvertImage />
        </div>
        <div className="col-md-4">
          <EditImage />
        </div> */}
      </div>
    </div>
  );
};

export default ImageTools;
