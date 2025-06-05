import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../utils/AuthContext";
import DropdownMenu from "../Navigation/DropdownMenu";

const ResponsiveNavbar = () => {
  const [theme, setTheme] = useState("light");
  const [showDropdown, setShowDropdown] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userImage = user.profilePic?.startsWith("http") ? user.profilePic : "/user-icon.svg";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <strong>All</strong><span className="power">in</span><strong>One⏻</strong>
        </Link>
        <div className="dropdown"><DropdownMenu title="PDF Tools" /></div>
        <div className="dropdown"><DropdownMenu title="Image Tools" /></div>
        <div className="dropdown"><DropdownMenu title="Converter Tools" /></div>
      </div>

      <div className="navbar-right">
        <button onClick={toggleTheme} className="icon-button">🌓</button>
        <button className="icon-button">❓</button>

        {isLoggedIn ? (
          <div className="profile-container" ref={dropdownRef}>
            <button className="profile-icon-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <img
                src={user.profilePic && user.profilePic.startsWith("https") ? user.profilePic : "/user-icon.svg"}
                alt="user"
                className="user-icon"
              />

            </button>
            {showDropdown && (
              <div className="profile-dropdown-box">
                <div className="profile-info">
                  <img
                    src={user.profilePic && user.profilePic.startsWith("https") ? user.profilePic : "/user-icon.svg"}
                    alt="user"
                    className="user-icon"
                  />

                  <div className="user-details">
                    <p className="user-name">{user.name || "User"}</p>
                    <p className="user-email">{user.email || "email@example.com"}</p>
                  </div>
                </div>
                <hr />
                <Link to="/dashboard" className="dropdown-item">👤 Account</Link>
                <Link to="/dashboard" className="dropdown-item">📄 Processed Files</Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">🚪 Log out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">Log in</Link>
            <Link to="/signup" className="signup-btn">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default ResponsiveNavbar;
