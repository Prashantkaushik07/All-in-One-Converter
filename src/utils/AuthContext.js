import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
  });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const name = localStorage.getItem("name");
//     const email = localStorage.getItem("email");

//     setIsLoggedIn(!!token);
//     setUser({ name, email });
//   }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  if (token) {
    // ✅ Optionally, call backend to validate token here
    setIsLoggedIn(true);
    setUser({ name, email });
  }
}, []);

  const login = (token, name, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    setIsLoggedIn(true);
    setUser({ name, email });
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser({ name: "", email: "" });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
