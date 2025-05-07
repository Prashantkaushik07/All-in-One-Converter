// Features.js
import React from "react";
import "../Components/Features.css";

function Features() {
  return (
    <div className="features-container">
      <h1 className="features-heading">The fastest tool for file processing</h1>
      <p className="features-subheading">
        Whether you're looking for convert, compress or edit files, you'll find
        the perfect solution on 11zon.
      </p>
      <div className="features-content">
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">✍️</span>
            <div>
              <h3>Lightning Fast File Processing</h3>
              <p>
                Experience a new level of speed and efficiency in processing
                your files.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div>
              <h3>Secure File Handling and Data Privacy</h3>
              <p>
                Protect your files and ensure data privacy with our secure file
                handling and data privacy features.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📄</span>
            <div>
              <h3>Multi-Format File Support</h3>
              <p>
                Support for a wide range of file formats for seamless file
                processing.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <div>
              <h3>Batch Processing</h3>
              <p>
                Boost your productivity with seamless simultaneous processing of
                multiple files.
              </p>
            </div>
          </div>
        </div>
        <div className="features-images">
          <div className="image-grid">
            <div className="image-item">⚡</div>
            <div className="image-item">🛡️</div>
            <div className="image-item">PDF DOC</div>
            <div className="image-item">JPG XLS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
