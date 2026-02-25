<<<<<<< Updated upstream
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import VerifyEmailModal from "../Auth/VerifyEmailModal";
=======
import React, { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import VerifyEmailModal from "../Auth/VerifyEmailModal";
import { useAuth } from "../../utils/AuthContext";
import { useTranslation } from "react-i18next";
import { API } from "../../config/api.endpoints";
import { api } from "../../lib/apiClient";
import { uploadApi } from "../../api/user_apiList";
import { API_BASE_URL } from "../../config/api.config";

>>>>>>> Stashed changes

const Dashboard = () => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
<<<<<<< Updated upstream
=======
  const [activeTab, setActiveTab] = useState("account");
  const [password, setPassword] = useState("");
  const [twoFAStatus, setTwoFAStatus] = useState("disabled");
  const [qrCode, setQrCode] = useState("");
  // eslint-disable-next-line
  const [twoFASecret, setTwoFASecret] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [processedFiles, setProcessedFiles] = useState([]);
  const [processedLoading, setProcessedLoading] = useState(false);
  const [processedError, setProcessedError] = useState("");
  const { i18n, t } = useTranslation();
  // eslint-disable-next-line
  const [showSuccessModal, setShowSuccessModal] = useState(false);
// console.log("User from context", user);
  // eslint-disable-next-line
  
  const countryFlags = {
    India: "🇮🇳",
    USA: "🇺🇸",
    UK: "🇬🇧",
    Germany: "🇩🇪"
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email || "Unknown");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const formatBytes = (bytes = 0) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** index;
    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const fetchProcessedFiles = useCallback(async () => {
    setProcessedLoading(true);
    setProcessedError("");
    try {
      const data = await uploadApi.getMyUploads({ page: 1, limit: 50, status: "processed" });
      setProcessedFiles(data?.uploads || []);
    } catch (err) {
      setProcessedError(err.message || "Failed to fetch processed files");
    } finally {
      setProcessedLoading(false);
    }
  }, []);

  const handleDownloadProcessed = async (upload) => {
    const uploadId = upload?._id || upload?.id;
    if (!uploadId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}${uploadApi.getDownloadUrl(uploadId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        let message = "Failed to download file";
        try {
          const errorData = await response.json();
          message = errorData?.message || message;
        } catch (_err) {
          // no-op
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = upload.originalName || upload.fileName || "download";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showPopup(err.message || "Failed to download file");
    }
  };

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setProfilePicFile(file);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const data = await api.post(API.auth.generate2FA, { email: userEmail });
      setQrCode(data?.qr || "");
      setTwoFASecret(data?.secret || "");
      setShow2FAModal(true);
    } catch (err) {
      showPopup(err.message || "Failed to start 2FA setup");
    }
  };

  const handleVerify2FA = async () => {
    try {
      await api.post(API.auth.verify2FA, { email: userEmail, otp: otpCode });
      setTwoFAStatus("enabled");
      setShow2FAModal(false);
      showPopup("2FA setup successfully");
    } catch (err) {
      showPopup(err.message || "Failed to verify 2FA");
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", userEmail);
    formData.append("name", name);
    formData.append("country", country);
    if (profilePicFile) formData.append("profilePic", profilePicFile);

    try {
      const data = await api.post(API.users.profile, formData);
      if (data?.user) {
        login(
          localStorage.getItem("token"),
          data.user.name,
          data.user.email,
          data.user.profilePic
        );
        setProfilePic(data.user.profilePic); // ✅ Update local image preview
      } else {
        showPopup("Update failed");
      }
    } catch (err) {
      showPopup(err.message || "Something went wrong.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!password) return showPopup("Password required");
    try {
      await api.post(API.auth.updatePassword, {
        email: userEmail,
        newPassword: password,
      });
      showPopup("Password updated");
    } catch (err) {
      showPopup(err.message || "Password update failed");
    }
  };

  // const handleEnable2FA = () => {
  //   alert("2FA Enabled (demo only)");
  //   setTwoFAStatus("enabled");
  // };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(API.users.delete, { data: { email: userEmail } });
      localStorage.clear();
      window.location.href = "/signup";
    } catch (err) {
      showPopup(err.message || "Server error");
    }
  };
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    showPopup(`Language changed to ${selectedLang}`);
  };

  useEffect(() => {
    if (user.profilePic) {
      setProfilePic(user.profilePic);
    }
  }, [user.profilePic]);
>>>>>>> Stashed changes

  useEffect(() => {
    if (activeTab === "activity") {
      fetchProcessedFiles();
    }
  }, [activeTab, fetchProcessedFiles]);

  useEffect(() => {
    const onUploadsUpdated = () => {
      if (activeTab === "activity") {
        fetchProcessedFiles();
      }
    };

    window.addEventListener("uploads:updated", onUploadsUpdated);
    return () => window.removeEventListener("uploads:updated", onUploadsUpdated);
  }, [activeTab, fetchProcessedFiles]);

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
          Verifying your email gives you access to additional features on 11zon.{" "}
          <button className="verify-now-btn" onClick={() => setShowVerifyModal(true)}>
            Verify now
          </button>
        </div>

<<<<<<< Updated upstream
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
=======
        <aside className="sidebar">
          <div className="sidebar-section">
            <h4>MY PROFILE</h4>
            <ul>
              <li className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>{t("Account")}</li>
              <li className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>{t("Security")}</li>
              <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>{t("Settings")}</li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h4>ACTIVITY</h4>
            <ul>
              <li className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>{t("Processed Files")}</li>
            </ul>
          </div>
        </aside>

        <main className="main-content">
          {activeTab === "account" && (
            <>
              <div className="card profile-card">
                <div className="card-header">
                  <h3>Profile</h3>
                  {!showEditor && (
                    <button onClick={() => setShowEditor(true)}>Change</button>
                  )}
                </div>
                {!showEditor ? (
                  <div className="profile-content">
                    <div className="avatar-circle">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="profile-avatar" />
                      ) : (
                        <span role="img" aria-label="user">👤</span>
                      )}
                    </div>
                    <div className="profile-info">
                      <p><strong>Name:</strong> {name}</p>
                      <p><strong>Country:</strong> {countryFlags[country]} {country}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="profile-editor updated-form">
                    <div className="form-header">
                      <h3>Profile</h3>
                      <button type="button" className="form-close" onClick={() => setShowEditor(false)}>Close</button>
                    </div>
                    <div className="form-avatar-wrapper">
                      <img
                        src={profilePic?.startsWith("http") ? profilePic : "/user-icon.svg"}
                        alt="Profile"
                        className="profile-avatar-large"
                      />
                      <label htmlFor="profilePicInput" className="avatar-label upload-btn">
                        Upload
                        <input
                          type="file"
                          id="profilePicInput"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input-field"
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="input-field"
                      >
                        <option value="India">🇮🇳 India</option>
                        <option value="USA">🇺🇸 USA</option>
                        <option value="UK">🇬🇧 UK</option>
                        <option value="Germany">🇩🇪 Germany</option>
                      </select>
                    </div>
                    <button type="submit" className="update-btn full-width">UPDATE</button>
                  </form>
                )}
              </div>

              <div className="card email-card">
                <div className="card-header">
                  <h3>Email</h3>
                  <span className="verify-link" onClick={() => setShowVerifyModal(true)}>Change</span>
                </div>
                <div className="card-body">
                  <p>{userEmail}</p>
                  <span className="verify-link" onClick={() => setShowVerifyModal(true)}>Verify now</span>
                </div>
              </div>

              <div className="card delete-card">
                <h3>Delete Account</h3>
                <p>Deleting an account is permanent. Once deleted, it cannot be restored.</p>
                <button className="delete-link" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <div className="card">
                <div className="card-header">
                  <h3>Password</h3>
                  <span className="verify-link" onClick={handlePasswordUpdate}>Add Password</span>
                </div>
                <div className="card-body">
                  <input
                    type="password"
                    placeholder="Setup New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Two-Factor Authentication</h3>
                  <span className="verify-link" onClick={handleEnable2FA}>Enable</span>
                </div>
                <div className="card-body">
                  <p>Enabling 2FA enhances security using password + app-generated OTP.</p>
                  <p>Status: <strong>{twoFAStatus}</strong></p>
                </div>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <div className="card">
              <div className="card-header">
                <h3>{t("Language")}</h3>
              </div>
              <div className="card-body">
                <label htmlFor="language-select">{t("Current Language")}:</label>
                <select id="language-select" value={i18n.language} onChange={handleLanguageChange} className="input-field">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="processed-files-container">
              <h2 className="table-title">Processed files</h2>
              <table className="processed-files-table">
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {processedLoading ? (
                    <tr>
                      <td colSpan="5" className="no-files">Loading processed files...</td>
                    </tr>
                  ) : processedError ? (
                    <tr>
                      <td colSpan="5" className="no-files">{processedError}</td>
                    </tr>
                  ) : processedFiles.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-files">No processed files yet.</td>
                    </tr>
                  ) : (
                    processedFiles.map((file) => (
                      <tr key={file._id || file.id}>
                        <td>{file.originalName || file.fileName}</td>
                        <td>{file.mimeType || "-"}</td>
                        <td>{formatBytes(file.size)}</td>
                        <td>{new Date(file.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            type="button"
                            className="verify-link"
                            onClick={() => handleDownloadProcessed(file)}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
>>>>>>> Stashed changes
  );
};

export default Dashboard;
