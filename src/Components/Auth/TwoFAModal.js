import React, { useState, useEffect } from "react";
import "./TwoFAModal.css";

const TwoFAModal = ({ email, onClose, onVerify }) => {
  const [token, setToken] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/generate-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok && data.qr) setQrCode(data.qr);
      } catch (error) {
        console.error("Failed to load QR code", error);
      }
    };

    fetchQrCode();
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify({ email, token, rememberDevice });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Two-Factor Authentication</h2>
        {qrCode && <img src={qrCode} alt="QR Code" className="qr-image" />}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            required
            className="otp-input"
          />
          <div className="checkbox">
            <input
              type="checkbox"
              id="rememberDevice"
              checked={rememberDevice}
              onChange={() => setRememberDevice(!rememberDevice)}
            />
            <label htmlFor="rememberDevice">Remember this device</label>
          </div>
          <div className="actions">
            <button type="submit" className="btn verify">Verify</button>
            <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFAModal;
