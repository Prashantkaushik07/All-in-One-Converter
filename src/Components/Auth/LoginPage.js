import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";
import { useAuth } from "../../utils/AuthContext"; // ✅ import auth context
import TwoFAModal from "./TwoFAModal"; // adjust relative path if needed



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showVerifyOtp, setShowVerifyOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  // eslint-disable-next-line
  const [triggeredFromSignup, setTriggeredFromSignup] = useState(false); // optional, only needed if reused
  const [pendingToken, setPendingToken] = useState(null); // holds token before 2FA
  const [pendingUser, setPendingUser] = useState({ name: "", email: "" }); // holds name/email before 2FA




  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email"); // Save it on login
    const name = localStorage.getItem("name");   // Save it on login
    if (token) {
      setIsLoggedIn(true);
      setUser({ name, email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return "Strong";
    return "Medium";
  };

  useEffect(() => {
    if (showVerifyOtp) {
      setResendDisabled(true);
      setTimer(30);
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [showVerifyOtp]);

  //   const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("http://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       localStorage.setItem("token", data.token);
  //       showPopup("Login successful", "success");
  //       navigate("/dashboard");
  //     } else {
  //       showPopup(data.error || "Login failed", "error");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     showPopup("An error occurred.", "error");
  //   }
  // };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("http://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });
  //     const data = await res.json();

  //     // ✅ 2FA condition added before default login
  //     if (res.ok && data.twoFARequired) {
  //       showPopup("2FA required. Enter your OTP.", "info");
  //       setShow2FAModal(true);
  //       setTriggeredFromSignup(false); // optional: harmless if you leave it
  //     } else if (res.ok) {
  //       login(data.token, data.name, data.email); // ✅ update global context
  //       showPopup("Login successful", "success");
  //       navigate("/dashboard");
  //     } else {
  //       showPopup(data.error || "Login failed", "error");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     showPopup("An error occurred.", "error");
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.twoFARequired) {
        showPopup("2FA required. Enter your OTP.", "info");
        setPendingToken(data.token); // temporarily store token
        setPendingUser({ name: data.name, email: data.email }); // temporarily store user
        setShow2FAModal(true); // show 2FA modal
      } else if (res.ok) {
        login(data.token, data.name, data.email); // ✅ update global context
        showPopup("Login successful", "success");
        navigate("/dashboard");
      } else {
        showPopup(data.error || "Login failed", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      showPopup("An error occurred.", "error");
    }
  };
  const handle2FAVerification = async ({ email, token, rememberDevice }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: token, rememberDevice }),
      });

      const data = await res.json();

      if (res.ok) {
        login(pendingToken, pendingUser.name, pendingUser.email);
        showPopup("2FA verification successful", "success");
        setShow2FAModal(false);
        navigate("/dashboard");
      } else {
        showPopup(data.error || "Invalid OTP", "error");
      }
    } catch (err) {
      console.error("2FA verification failed:", err);
      showPopup("Failed to verify OTP", "error");
    }
  };



  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        showPopup("Verification email sent. Please check your inbox.", "success");
        setShowVerifyOtp(true);
      } else {
        showPopup(data.error || "Reset request failed.", "error");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      showPopup("Something went wrong.", "error");
    }
  };

  const handleOtpVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        showPopup("OTP verified. You can now reset your password.", "success");
        setShowNewPassword(true);
      } else {
        showPopup(data.error || "Invalid OTP", "error");
      }
    } catch (err) {
      console.error("OTP verification failed", err);
      showPopup("Something went wrong.", "error");
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      setTimer(30);
      await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      showPopup("OTP resent to your email.", "success");
    } catch (err) {
      showPopup("Failed to resend OTP.", "error");
    }
  };

  if (newPassword !== confirmPassword) {
    showPopup("Passwords do not match.");
    return;
  }

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showPopup("Passwords do not match.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showPopup("Password reset successful. Please log in.", "success");
        setShowReset(false);
        setShowVerifyOtp(false);
        setShowNewPassword(false);
        navigate("/login");
      } else {
        showPopup(data.error || "Reset failed.", "error");
      }
    } catch (err) {
      console.error("Reset error:", err);
      showPopup("Something went wrong.", "error");
    }
  };


  return (
    <div className="login-page">
      {/* Profile section */}
      <div className="profile-wrapper">
        {isLoggedIn ? (
          <div className="profile-dropdown">
            <button className="profile-icon-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <img src="/user-icon.svg" alt="user" className="user-icon" />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="user-info">
                  <p className="user-name">{user.name || "User"}</p>
                  <p className="user-email">{user.email || "email@example.com"}</p>
                </div>
                <hr />
                <Link to="/account" className="dropdown-item">👤 Account</Link>
                <Link to="/dashboard" className="dropdown-item">📄 Processed Files</Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">🚪 Log out</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            {/* <Link to="/login" className="auth-link">Log in</Link>
            <Link to="/signup" className="auth-link">Sign up</Link> */}
          </div>
        )}
      </div>

      {/* Popup alert box */}
      {popup.show && (
        <div className={`popup-box ${popup.type}`}>
          {popup.message}
        </div>
      )}
      {show2FAModal && (
        <TwoFAModal
          email={pendingUser.email}
          onClose={() => setShow2FAModal(false)}
          onVerify={handle2FAVerification}
        />
      )}

      <div className="login-container">
        <div className="login-left">
          <img
            src="reset-password.svg"
            alt="Reset Password"
            style={{ maxWidth: "80%" }}
          />
        </div>

        <div className="login-right">
          {showReset ? (
            showNewPassword ? (
              <>
                <h1>Set a new password</h1>
                <p>Please enter your new password to complete the reset process.</p>
                <form onSubmit={handleNewPasswordSubmit} className="login-form">
                  <div className="form-group">
                    <div className="password-field">
                      <input
                        type={showNewPasswordField ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewPassword(val);
                          setPasswordStrength(evaluatePasswordStrength(val));
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasswordField(!showNewPasswordField)}
                        className="show-hide-btn"
                      >
                        {showNewPasswordField ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="password-field">
                      <input
                        type={showConfirmPasswordField ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                        className="show-hide-btn"
                      >
                        {showConfirmPasswordField ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {newPassword && (
                    <div style={{ marginBottom: "10px", fontWeight: "bold", color: passwordStrength === "Weak" ? "red" : passwordStrength === "Medium" ? "orange" : "green" }}>
                      Password strength: {passwordStrength}
                    </div>
                  )}

                  <button type="submit" className="login-btn">Reset Password</button>
                </form>
                <p className="bottom-links">
                  Already reset your password? <a href="/login">Log in</a>
                </p>
              </>
            ) : showVerifyOtp ? (
              <>
                <h1>Email verification code</h1>
                <p>An email with a verification code was just sent to <strong>{resetEmail}</strong></p>
                <form onSubmit={(e) => { e.preventDefault(); handleOtpVerify(); }} className="login-form">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter Verification Code"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,6}$/.test(val)) setOtp(val);
                      }}
                      maxLength={6}
                      pattern="\d{6}"
                      title="Please enter a 6-digit code"
                      className="otp-input"
                      required
                    />
                  </div>
                  <button type="submit" className="login-btn">Verify</button>
                </form>
                <p style={{ marginTop: "10px" }}>
                  Didn’t get the code?{" "}
                  <button
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                    style={{ background: "none", border: "none", color: "blue", cursor: resendDisabled ? "not-allowed" : "pointer" }}
                  >
                    Resend {resendDisabled && `(${timer}s)`}
                  </button>
                </p>
              </>
            ) : (
              <>
                <h1>Reset your password</h1>
                <p>Please enter your email and check your inbox or spam for the verification code.</p>
                <form onSubmit={handleResetSubmit} className="login-form">
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="recaptcha-box">
                    <p style={{ margin: "10px 0", fontSize: "0.9rem" }}>
                      <input type="checkbox" /> Verify you are human
                    </p>
                    <div className="recaptcha-placeholder">Cloudflare CAPTCHA here</div>
                  </div>
                  <button type="submit" className="login-btn">Next</button>
                </form>
              </>
            )
          ) : (
            <>
              <h1>Log in to All-in-One</h1>
              <button className="google-btn">Continue with Google</button>
              <div className="separator"><span>or</span></div>
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="show-hide-btn"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <button type="submit" className="login-btn">Log in</button>
              </form>
              <div className="bottom-links">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowReset(true);
                  }}
                >
                  Forgot password?
                </a>
                <p>Don’t have an account? <a href="/signup">Create an account</a></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
