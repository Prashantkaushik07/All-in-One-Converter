import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import VerifyEmailModal from "../Auth/VerifyEmailModal";

const Dashboard = () => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  

  return (
    <div className="dashboard-container">
      {showVerifyModal && (
        <VerifyEmailModal
          email={"user@example.com"} // Replace dynamically if needed
          onClose={() => setShowVerifyModal(false)}
        />
      )}

      <aside className="sidebar">
        <div className="sidebar-section">
          <h4>MY PROFILE</h4>
          <ul>
            <li><Link to="/account">Account</Link></li>
            <li>Security</li>
            <li>Settings</li>
          </ul>
        </div>
        <div className="sidebar-section">
          <h4>ACTIVITY</h4>
          <ul>
            <li className="active">Processed Files</li>
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <div className="verify-banner">
          Verifying your email gives you access to additional features on All-in-One.{" "}
          <button className="verify-now-btn" onClick={() => setShowVerifyModal(true)}>
            Verify now
          </button>
        </div>

        <div className="file-section">
          <h2>Processed files</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Tool</th>
                <th>N Files</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                  No file found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
