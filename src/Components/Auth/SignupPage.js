import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";


const texts = [
  "All-in-One Hub: Convert, Compress, and Edit Your Files",
  "Fast and Secure File Conversion Tools",
  "Start Compressing, Merging, and Converting Today"
];

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        showPopup("Account created successfully");
        navigate("/");
      } else {
        showPopup(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      showPopup("An error occurred.");
    }
  };

  const TypingText = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      const currentText = texts[textIndex];
      let typingSpeed = isDeleting ? 30 : 70;

      const timer = setTimeout(() => {
        if (!isDeleting) {
          setDisplayedText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setDisplayedText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }

        if (!isDeleting && charIndex === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }

        if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }, typingSpeed);

      return () => clearTimeout(timer);
    }, [charIndex, isDeleting, textIndex]);

    return <h3>{displayedText}<span className="blinking-cursor">|</span></h3>;
  };

  return (
    <div className="login-page">
      {/* Popup alert box */}
      {popup.show && (
        <div className={`popup-box ${popup.type}`}>
          {popup.message}
        </div>
      )}
      <div className="login-container">
        <div className="login-left">
          <TypingText />
        </div>
        <div className="login-right">
          <h1>Get started with All-in-One</h1>
          <button className="google-btn">Continue with Google</button>
          <div className="separator"><span>or</span></div>
          <form onSubmit={handleSignup} className="login-form">
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
            <button type="submit" className="login-btn">Create Account</button>
          </form>
          <p className="bottom-links">
            By creating an account, you agree to All-in-One <a href="/">terms</a> and <a href="/">privacy</a>.<br />
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
