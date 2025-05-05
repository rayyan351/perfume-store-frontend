import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("❌ Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Something went wrong.");
      } else {
        setSuccessMessage("✅ Password updated successfully! Redirecting to login...");
        setPassword("");
        setRedirecting(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setErrorMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {loading && (
        <div className="full-loader">
          <div className="loader-spinner"></div>
          <p>Resetting password...</p>
        </div>
      )}

      {!loading && (
        <motion.div
          className="auth-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Reset Your Password</h2>

          {successMessage && (
            <div className="success-msg">
              {successMessage}
              {redirecting && <span className="redirect-dots"></span>}
            </div>
          )}
          {errorMessage && <p className="error-msg">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
         <div className="password-wrapper"> 
        <input
        type={showPassword ? "text" : "password"}
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="password-input"
        />
       <button
        type="button"
        className="toggle-eye"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label="Toggle password visibility"
         >
         {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
           </div>
        <button type="submit" className="btn-primary" disabled={loading}>
            Reset Password
         </button>
          </form>

        </motion.div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
