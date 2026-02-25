import React from "react";
import "./JoinUsSection.css";

const JoinUsSection = () => {
  return (
    <div className="join-us-container">
      <div className="join-us-content">
        <h2>Join the All in One Today!</h2>
        <p>
          Explore the endless user experience and unlock your full potential.
        </p>
        <button className="join-us-button">Sign up</button>
      </div>
      <div className="join-us-graphic">
        <div className="account-icon">
          <span>👤</span>
          <p>My Account</p>
        </div>
        <div className="icon-cloud">☁️</div>
        <div className="icon-heart">💙</div>
        <div className="icon-security">🛡️</div>
      </div>
    </div>
  );
};

export default JoinUsSection;
