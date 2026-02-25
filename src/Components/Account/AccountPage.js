import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import "./AccountPage.css";
<<<<<<< Updated upstream
=======
import VerifyEmailModal from "../Auth/VerifyEmailModal";
import { API } from "../../config/api.endpoints";
import { api } from "../../lib/apiClient";
>>>>>>> Stashed changes

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        setUserEmail(decoded.email || "Unknown");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
<<<<<<< Updated upstream
  }, []); // ✅ no need to add 'token' as a dependency because it's from localStorage
=======
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
      await api.delete(API.users.delete, { data: { email: userEmail } });
      localStorage.clear();
      window.location.href = "/signup";
    } catch (err) {
      console.error("Delete account failed:", err);
    }
  };
>>>>>>> Stashed changes

  return (
    <div className="account-page">
      <div className="verify-banner">
        Verifying your email gives you access to additional features on 11zon.{" "}
        <a href="/">Verify now</a>
      </div>

      <div className="card profile-card">
        <div className="card-header">
          <h3>Profile</h3>
          <a href="/">Change</a>
        </div>
        <div className="profile-content">
          <div className="avatar-circle">
            <span role="img" aria-label="user">👤</span>
          </div>
          <div className="profile-info">
            <p><strong>Name</strong></p>
            <p><strong>Country</strong> 🇮🇳 India</p>
          </div>
        </div>
      </div>

      <div className="card email-card">
        <div className="card-header">
          <h3>Email</h3>
          <a href="/">Change</a>
        </div>
        <div className="card-body">
          <p>{userEmail}</p>
          <a href="/" className="verify-link">Verify now</a>
        </div>
      </div>

      <div className="card delete-card">
        <h3>Delete Account</h3>
        <p>
          Deleting an account is permanent on 11zon. Once a user account is
          permanently deleted, you can't restore your account.
        </p>
        <a href="/" className="delete-link">Delete Account</a>
      </div>
    </div>
  );
};

export default AccountPage;
