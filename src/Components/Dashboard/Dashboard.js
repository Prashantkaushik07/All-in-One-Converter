import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import VerifyEmailModal from "../Auth/VerifyEmailModal";
import { useAuth } from "../../utils/AuthContext";
import { useTranslation } from "react-i18next";


const Dashboard = () => {
  const { user, login } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState("prashant kaushik");
  const [country, setCountry] = useState("India");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [password, setPassword] = useState("");
  const [twoFAStatus, setTwoFAStatus] = useState("disabled");
  const [qrCode, setQrCode] = useState("");
  // eslint-disable-next-line
  const [twoFASecret, setTwoFASecret] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  // eslint-disable-next-line
  const [processedFiles, setProcessedFiles] = useState([]);
  const { i18n, t } = useTranslation();
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
    const res = await fetch("http://localhost:5000/api/auth/generate-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
    const data = await res.json();
    setQrCode(data.qr);
    setTwoFASecret(data.secret);
    setShow2FAModal(true);
  };

  const handleVerify2FA = async () => {
    const res = await fetch("http://localhost:5000/api/auth/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, token: otpCode }),
    });
    const data = await res.json();
    if (res.ok) {
      setTwoFAStatus("enabled");
      setShow2FAModal(false);
      showPopup("2FA setup successfully");
    } else {
      showPopup(data.error || "Failed to verify 2FA");
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
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        login(
          localStorage.getItem("token"),
          data.user.name,
          data.user.email,
          data.user.profilePic
        );
        setProfilePic(data.user.profilePic); // ✅ Update local image preview
      } else {
        showPopup(data.error || "Update failed");
      }
    } catch (err) {
      showPopup("Something went wrong.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!password) return showPopup("Password required");
    try {
      const res = await fetch("http://localhost:5000/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) showPopup("Password updated");
      else showPopup(data.error);
    } catch (err) {
      showPopup("Password update failed");
    }
  };

  // const handleEnable2FA = () => {
  //   alert("2FA Enabled (demo only)");
  //   setTwoFAStatus("enabled");
  // };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch("http://localhost:5000/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.clear();
        window.location.href = "/signup";
      } else showPopup(data.error);
    } catch (err) {
      showPopup("Server error");
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

  return (
    <>
      {show2FAModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Scan QR with Google Authenticator</h3>
            {qrCode && <img src={qrCode} alt="2FA QR Code" className="qr-image" />}
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="otp-input"
            />
            <div className="actions">
              <button onClick={handleVerify2FA} className="btn verify">Verify</button>
              <button onClick={() => setShow2FAModal(false)} className="btn cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {popup.show && (
        <div className={`popup-box ${popup.type}`}>
          {popup.message}
        </div>
      )}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>✅ Profile updated successfully!</h3>
          </div>
        </div>
      )}

      <div className="dashboard-container">
        {showVerifyModal && (
          <VerifyEmailModal email={userEmail} onClose={() => setShowVerifyModal(false)} />
        )}

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
                    <th>Name</th>
                    <th>Tool</th>
                    <th>N Files</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {processedFiles.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-files">No file found.</td>
                    </tr>
                  ) : (
                    processedFiles.map((file, index) => (
                      <tr key={index}>
                        <td>{file.name}</td>
                        <td>{file.tool}</td>
                        <td>{file.count}</td>
                        <td>{new Date(file.date).toLocaleDateString()}</td>
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
  );
};

export default Dashboard;
