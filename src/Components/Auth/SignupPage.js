import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { API } from "../../config/api.endpoints";
import { api } from "../../lib/apiClient";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
<<<<<<< Updated upstream
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Account created successfully");
        navigate("/");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred.");
=======
      const data = await api.post(API.auth.signup, { email, password });
      if (data?.token) localStorage.setItem("token", data.token);
      showPopup("Account created successfully");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      showPopup(err.message || "An error occurred.");
>>>>>>> Stashed changes
    }
  };

  const TypingText = () => {
    const texts = [
      "All-in-One Hub: Convert, Compress, and Edit Your Files",
      "Fast and Secure File Conversion Tools",
      "Start Compressing, Merging, and Converting Today"
    ];
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
  
        // If text is fully typed
        if (!isDeleting && charIndex === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
  
        // If text is fully deleted
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
      <div className="login-container">
        <div className="login-left">
          <h3><TypingText /></h3>
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
