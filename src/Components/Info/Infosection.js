// InfoSection.js
import React from "react";
import "./InfoSectionStyles.css";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const InfoSection = () => {
  return (
    <div className="infoSection">
      <div className="container">
        <div className="column">
          <h3 className="heading">All in One</h3>
          <ul className="list">
            <li className="listItem">Simple, Fast & Secure.</li>
          </ul>
        </div>
        <div className="column">
          <h3 className="heading">All in One</h3>
          <ul className="list">
            <li className="listItem">Help</li>
            <li className="listItem">Feedback</li>
            <li className="listItem">FAQ</li>
          </ul>
        </div>
        <div className="column">
          <h3 className="heading">Product</h3>
          <ul className="list">
            <li className="listItem">Tool 1</li>
            <li className="listItem">Tool 2</li>
            <li className="listItem">Tool 3</li>
          </ul>
        </div>
        <div className="column">
          <h3 className="heading">Company</h3>
          <ul className="list">
            <li className="listItem">About</li>
            <li className="listItem">Privacy Policy</li>
            <li className="listItem">Contact Us</li>
          </ul>
        </div>
      </div>
      <div className="bottomSection">
        <p className="text">© 2024 Company. All Rights Reserved.</p>
        <div className="socialIcons">
          <FaFacebook className="icon" />
          <FaTwitter className="icon" />
          <FaInstagram className="icon" />
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
