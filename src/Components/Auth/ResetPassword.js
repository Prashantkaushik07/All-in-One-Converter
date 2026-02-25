import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import { API } from "../../config/api.endpoints";
import { api } from "../../lib/apiClient";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", type: "info" });
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
<<<<<<< Updated upstream
      const res = await fetch("http://localhost:5000/api/auth/reset-password.svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password reset successful. Please log in.");
        navigate("/login"); // ✅ redirect to login page
      } else {
        alert(data.error || "Reset failed.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Something went wrong.");
=======
      await api.post(API.auth.resetPassword, { email, newPassword });
      showPopup("Password reset successful. Please log in.");
      navigate("/login"); // ✅ redirect to login page
    } catch (err) {
      console.error("Reset error:", err);
      showPopup(err.message || "Something went wrong.");
>>>>>>> Stashed changes
    }
  };

  return (
    <div className="reset-password.svg-page">
      {popup.show && <div className={`popup-box ${popup.type}`}>{popup.message}</div>}
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
