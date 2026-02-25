<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import "./VerifyEmailModal.css";
=======
import React, { useState, useEffect, useCallback } from "react";
import { API } from "../../config/api.endpoints";
import { api } from "../../lib/apiClient";

// Popup utility
const showAppPopup = (message, type = 'info') => {
  console.log(`Popup [${type}]: ${message}`);
};
>>>>>>> Stashed changes

const VerifyEmailModal = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
<<<<<<< Updated upstream
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
=======
    const storedEmail = localStorage.getItem("userEmail");
    const verified = localStorage.getItem("isEmailVerified") === "true";
    setEffectiveEmail(email || storedEmail || "");
    setIsVerified(verified);
  }, [email]);

  // Send OTP
  const handleSendOtpRequest = useCallback(async (targetEmail) => {
    if (!targetEmail) return;

    setIsLoading(true);
    setMessage("Sending OTP...");
    try {
      const data = await api.post(API.auth.resendOtp, { email: targetEmail });
      setMessage(data?.message || `OTP sent to ${targetEmail}`);
      showAppPopup(data?.message || `OTP sent to ${targetEmail}`, "success");
      setIsResendDisabled(true);
      setSeconds(60);
    } catch (err) {
      setMessage(err.message || "Network error.");
      showAppPopup(err.message || "Network error.", "error");
    } finally {
      setIsLoading(false);
    }
>>>>>>> Stashed changes
  }, []);

  const handleVerify = async () => {
    try {
<<<<<<< Updated upstream
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Email verified successfully!");
        onClose();
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error("Verification failed", err);
      alert("Something went wrong");
=======
      const data = await api.post(API.auth.verifyEmail, { email: effectiveEmail, otp });
      setMessage(data?.message || "Email verified!");
      showAppPopup(data?.message || "Email verified!", "success");
      localStorage.setItem("userEmail", effectiveEmail);
      localStorage.setItem("isEmailVerified", "true");
      setIsVerified(true);
      onClose();
    } catch (err) {
      setMessage(err.message || "Verification failed.");
      showAppPopup(err.message || "Verification failed.", "error");
    } finally {
      setIsLoading(false);
>>>>>>> Stashed changes
    }
  };

  const handleResend = async () => {
    setDisabled(true);
    setSeconds(60);
    await fetch("http://localhost:5000/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="verify-modal-overlay">
      <div className="verify-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="icon">📧</div>
        <h2>Verify your email</h2>
        <p>Please check your inbox and enter OTP.</p>
        <div className="email-info">We’ve sent an OTP to:<br /><strong>{email}</strong></div>
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
