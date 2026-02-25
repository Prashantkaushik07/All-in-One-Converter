import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import "./TwoFAModal.css";
import { API } from "../../config/api.endpoints";
import { api } from "../../lib/apiClient";

const TwoFAModal = ({ onClose, showPopup }) => {
  const [otp, setOtp] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const email = localStorage.getItem("pendingUserEmail");
  const token = localStorage.getItem("pendingToken");

  // 🔁 Fetch QR only if not scanned before
  const fetchQrCode = useCallback(async () => {
    try {
      const data = await api.post(API.auth.generate2FA, { email });
      if (data?.qr) {
        setQrCode(data.qr);
      } else {
        console.error("Failed to get QR code:", "Missing QR code");
      }
    } catch (error) {
      console.error("QR code fetch failed:", error);
    }
  }, [email]);

  useEffect(() => {
    const alreadyScanned = localStorage.getItem(`2fa_scanned_${email}`);
    if (!alreadyScanned) fetchQrCode();
  }, [fetchQrCode, email]);

  // ✅ This is the function triggered on form submit
  const handleVerify2FA = async () => {
    try {
      if (!token || token === "undefined") {
        showPopup("Missing login token. Please log in again.");
        return;
      }

      const data = await api.post(API.auth.verifyLogin2FA, {
        email,
        otp,
        token,
        rememberDevice,
      });

      login(data.token, data.name, data.email, data.profilePic);
      showPopup("2FA verification successful");

      localStorage.removeItem("pendingToken");
      localStorage.removeItem("pendingUserEmail");
      localStorage.removeItem("pendingUserName");

      if (rememberDevice) {
        localStorage.setItem(`2fa_trusted_${email}`, "true");
      }

      localStorage.setItem(`2fa_scanned_${email}`, "true");

      onClose();
      navigate("/dashboard");
    } catch (err) {
      console.error("2FA verification failed:", err);
      showPopup(err.message || "Something went wrong during verification");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Two-Factor Authentication</h2>

        {qrCode && (
          <img src={qrCode} alt="QR Code" className="qr-image" />
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify2FA();
          }}
        >
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
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
