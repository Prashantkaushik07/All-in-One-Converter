import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: "",
  });

  // ✅ Helper: Safe profile fetch
  const fetchUserProfile = async (email) => {
    try {
      const res = await fetch("http://localhost:5000/api/user/get-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const { name, email, profilePic } = data.user;
        setUser({ name, email, profilePic });
        setIsLoggedIn(true);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("profilePic", profilePic || "");
      } else {
        console.error("❌ Failed to load profile:", data.error || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Fetch profile error:", err);
    }
  };

  const login = (token, name, email, profilePic) => {
    if (!email || email === "undefined") return;

    localStorage.setItem("token", token);
    localStorage.setItem("name", name || "");
    localStorage.setItem("email", email);
    localStorage.setItem("profilePic", profilePic || "");

    setUser({ name: name || "", email, profilePic: profilePic || "" });
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser({ name: "", email: "", profilePic: "" });
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && email && email !== "undefined") {
      fetchUserProfile(email);
    } else {
      console.warn("⚠️ Skipped profile fetch: invalid or missing email/token");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
