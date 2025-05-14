import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./AccountPage.css";
import VerifyEmailModal from "../Auth/VerifyEmailModal";

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState("prashant kaushik");
  const [country, setCountry] = useState("India");
  const [profilePic, setProfilePic] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log("Updated Name:", name);
    console.log("Country:", country);
    setShowEditor(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;
    try {
      const res = await fetch("http://localhost:5000/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account deleted successfully.");
        localStorage.clear();
        window.location.href = "/signup";
      } else {
        alert(data.error || "Failed to delete account.");
      }
    } catch (err) {
      alert("Server error while deleting account.");
    }
  };

  return (
    <div className="account-page">
      <div className="verify-banner">
        Verifying your email gives you access to additional features on All-in-One.{" "}
        <span className="verify-link" onClick={() => setShowVerifyModal(true)}>Verify now</span>
        {showVerifyModal && (
          <VerifyEmailModal
            email={userEmail} // ✅ dynamically passed email
            onClose={() => setShowVerifyModal(false)}
          />
        )}
      </div>

      {!showEditor ? (
        <div className="card profile-card">
          <div className="card-header">
            <h3>Profile</h3>
            <button onClick={() => setShowEditor(true)}>Change</button>
          </div>
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
              <p><strong>Country:</strong> 🇮🇳 {country}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card profile-editor">
          <div className="card-header">
            <h3>Profile</h3>
            <button onClick={() => setShowEditor(false)}>Close</button>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="avatar-upload">
              <label htmlFor="profilePicInput" className="avatar-label">
                <img
                  src={profilePic || "/user-icon.svg"}
                  alt="Profile"
                  className="profile-avatar-large"
                />
                <input
                  type="file"
                  id="profilePicInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <span className="camera-icon">📷</span>
              </label>
            </div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
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
            <button type="submit" className="update-btn">UPDATE</button>
          </form>
        </div>
      )}

      <div className="card email-card">
        <div className="card-header">
          <h3>Email</h3>
        </div>
        <div className="card-body">
          <p>{userEmail}</p>
          <span className="verify-link" onClick={() => setShowVerifyModal(true)}>
            Verify now
          </span>
        </div>
      </div>

      <div className="card delete-card">
        <h3>Delete Account</h3>
        <p>
          Deleting an account is permanent on All-in-One. Once a user account is
          permanently deleted, you can't restore your account.
        </p>
        <button className="delete-link" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
