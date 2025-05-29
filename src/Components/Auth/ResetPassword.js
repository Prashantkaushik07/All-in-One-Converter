import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password.svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        showPopup("Password reset successful. Please log in.");
        navigate("/login"); // ✅ redirect to login page
      } else {
        showPopup(data.error || "Reset failed.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      showPopup("Something went wrong.");
    }
  };

  return (
    <div className="reset-password.svg-page">
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
