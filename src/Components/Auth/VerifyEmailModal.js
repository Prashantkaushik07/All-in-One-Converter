import React, { useState, useEffect } from "react";
import "./VerifyEmailModal.css";

const VerifyEmailModal = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [disabled, setDisabled] = useState(true);

  
  // Use email from props or fallback to localStorage
  const storedEmail = localStorage.getItem("userEmail"); // Adjust key if different
  const effectiveEmail = email || storedEmail;

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: effectiveEmail, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        showPopup("Email verified successfully!");
        onClose();
      } else {
        showPopup(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error("Verification failed", err);
      showPopup("Something went wrong");
    }
  };

  const handleResend = async () => {
    setDisabled(true);
    setSeconds(60);
    await fetch("http://localhost:5000/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: effectiveEmail }),
    });
  };

  return (
    <div className="verify-modal-overlay">
      <div className="verify-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="icon">📧</div>
        <h2>Verify your email</h2>
        <p>Please check your inbox and enter OTP.</p>
        <div className="email-info">
          We’ve sent an OTP to:<br />
          <strong>{effectiveEmail}</strong>
        </div>
        <input
          type="text"
          placeholder="Verification code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="verify-btn" onClick={handleVerify}>Verify</button>
        <p>
          {disabled ? `${seconds} seconds wait to resend code` : (
            <button className="resend-link" onClick={handleResend}>Resend Code</button>
          )}
        </p>
        <p className="change-help">
          <a href="/">Change Email</a> · <a href="/">Contact us</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
