import React, { useState, useEffect, useCallback } from "react";

// Popup utility
const showAppPopup = (message, type = 'info') => {
  console.log(`Popup [${type}]: ${message}`);
};

const VerifyEmailModal = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [effectiveEmail, setEffectiveEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // Load email and verification status
  useEffect(() => {
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
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || `OTP sent to ${targetEmail}`);
        showAppPopup(data.message || `OTP sent to ${targetEmail}`, "success");
        setIsResendDisabled(true);
        setSeconds(60);
      } else {
        setMessage(data.error || "Failed to send OTP.");
        showAppPopup(data.error || "Failed to send OTP.", "error");
      }
    } catch (err) {
      setMessage("Network error.");
      showAppPopup("Network error.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial send OTP if not verified
  useEffect(() => {
    if (effectiveEmail && !isVerified) {
      handleSendOtpRequest(effectiveEmail);
    }
  }, [effectiveEmail, isVerified, handleSendOtpRequest]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (isResendDisabled && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResendDisabled, seconds]);

  // OTP Verification
  const handleVerify = async () => {
    if (!otp) return showAppPopup("Enter OTP", "warn");

    setIsLoading(true);
    setMessage("Verifying OTP...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: effectiveEmail, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Email verified!");
        showAppPopup(data.message || "Email verified!", "success");
        localStorage.setItem("userEmail", effectiveEmail);
        localStorage.setItem("isEmailVerified", "true");
        setIsVerified(true);
        onClose();
      } else {
        setMessage(data.error || "OTP invalid.");
        showAppPopup(data.error || "OTP invalid.", "error");
      }
    } catch (err) {
      setMessage("Verification failed.");
      showAppPopup("Verification failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend handler
  const handleResendClick = () => {
    if (effectiveEmail) handleSendOtpRequest(effectiveEmail);
  };

  // Save new email
  const handleSaveEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      return showAppPopup("Enter valid email", "warn");
    }

    localStorage.setItem("userEmail", newEmail);
    localStorage.setItem("isEmailVerified", "false");

    setEffectiveEmail(newEmail);
    setIsEditingEmail(false);
    setIsVerified(false);
    setOtp("");
    handleSendOtpRequest(newEmail);
  };

  // UI Styles
  const getMessageStyle = () => {
    const base = { fontSize: '14px', marginBottom: '15px', padding: '10px', borderRadius: '4px', border: '1px solid transparent' };
    if (message.toLowerCase().includes("success") || message.toLowerCase().includes("sent"))
      return { ...base, color: '#155724', backgroundColor: '#d4edda', borderColor: '#c3e6cb' };
    if (message.toLowerCase().includes("fail") || message.toLowerCase().includes("error"))
      return { ...base, color: '#721c24', backgroundColor: '#f8d7da', borderColor: '#f5c6cb' };
    return { ...base, color: '#0c5460', backgroundColor: '#d1ecf1', borderColor: '#bee5eb' };
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeBtnStyle} onClick={onClose} disabled={isLoading}>×</button>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📧</div>
        <h2 style={{ fontSize: '20px' }}>Verify your email</h2>
        <p>Please check your inbox for the OTP.</p>

        {isEditingEmail ? (
          <>
            <input
              type="email"
              value={newEmail}
              placeholder="Enter new email"
              onChange={(e) => setNewEmail(e.target.value)}
              style={inputStyle}
            />
            <button style={buttonStyle} onClick={handleSaveEmail} disabled={isLoading}>
              Save & Send OTP
            </button>
          </>
        ) : (
          <div style={emailBoxStyle}>
            <strong>{effectiveEmail}</strong>
            {isVerified && <span style={{ color: "green", marginLeft: 8 }}>(Verified)</span>}
          </div>
        )}

        {message && <div style={getMessageStyle()}>{message}</div>}

        {!isVerified && !isEditingEmail && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
              style={inputStyle}
              disabled={isLoading}
            />
            <button onClick={handleVerify} disabled={isLoading || !otp} style={{ ...buttonStyle, backgroundColor: isLoading || !otp ? "#ccc" : "#007bff" }}>
              {isLoading && message.includes("Verifying") ? "Verifying..." : "Verify"}
            </button>
            <p>
              {isResendDisabled ? (
                `Resend in ${seconds}s`
              ) : (
                <button
                  onClick={handleResendClick}
                  disabled={isLoading}
                  style={{ background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                >
                  Resend Code
                </button>
              )}
            </p>
          </>
        )}

        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          <button onClick={() => setIsEditingEmail(!isEditingEmail)} style={linkStyle}>
            {isEditingEmail ? "Cancel" : "Change Email"}
          </button>
          {" · "}
          <a href="/contact-us" style={linkStyle}>Contact us</a>
        </p>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "25px",
  maxWidth: "400px",
  width: "90%",
  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
  position: "relative",
  textAlign: "center"
};

const closeBtnStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "20px",
  border: "none",
  background: "none",
  cursor: "pointer"
};

const emailBoxStyle = {
  margin: "15px 0",
  padding: "10px",
  backgroundColor: "#f1f1f1",
  borderRadius: "4px",
  fontSize: "14px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "15px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "4px",
  fontSize: "16px",
  color: "#fff",
  backgroundColor: "#007bff",
  border: "none",
  cursor: "pointer",
  marginBottom: "10px"
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "underline",
  background: "none",
  border: "none",
  cursor: "pointer"
};

export default VerifyEmailModal;
