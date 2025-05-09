// Footer.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>Get started with All in One</h2>
        <button className="footer-button" onClick={handleSignupClick}>
          Sign up for free
        </button>
      </div>
    </footer>
  );
}

export default Footer;
