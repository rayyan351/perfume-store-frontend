import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const [sessionExpired, setSessionExpired] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const login = (data) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem("auth");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!auth) return;

    const resetTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSessionExpired(true);
        logout();
        setTimeout(() => setSessionExpired(false), 5000); // Hide message after 5s
      }, 60000); // ⏱ 1 minute
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [auth, logout]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}

      {sessionExpired && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#333",
          color: "#fff",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999,
          fontSize: "1rem",
        }}>
          🔒 Session expired due to inactivity. You’ve been logged out.
        </div>
      )}
    </AuthContext.Provider>
  );
};
